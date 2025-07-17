import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import IcationView from "@/views/ication/View.vue";
import { fetchIcationData } from "@/views/ication/icationData.js";
import { File } from "@/models/File.js";

// Mock the data service
vi.mock("@/views/ication/icationData.js", () => ({
  fetchIcationData: vi.fn(),
  createIcationApi: vi.fn(() => ({
    post: vi.fn(() => Promise.resolve({ data: "<div>Rendered HTML</div>" })),
    getUri: vi.fn(() => "http://localhost:8000"),
    defaults: {
      baseURL: "http://localhost:8000",
      headers: { common: {} },
    },
  })),
  createIcationFileStore: vi.fn((file) => ({
    files: [file],
    tags: file.tags || [],
    isLoading: false,
    error: undefined,
    queueSync: () => Promise.resolve(),
    loadFiles: () => Promise.resolve(),
    loadTags: () => Promise.resolve(),
  })),
  createIcationUser: vi.fn(() => ({
    id: null,
    username: "anonymous",
    email: null,
    firstName: "Anonymous",
    lastName: "User",
  })),
  createIcationAnnotations: vi.fn(() => []),
}));

// Mock components that are heavy or not needed for this test
vi.mock("@/views/workspace/Sidebar.vue", () => ({
  default: {
    name: "Sidebar",
    template: "<div data-testid='sidebar'>Sidebar</div>",
    emits: ["show-component", "hide-component"],
  },
}));

vi.mock("@/views/workspace/Canvas.vue", () => ({
  default: {
    name: "Canvas",
    template: "<div data-testid='canvas'>Canvas</div>",
    props: ["modelValue", "showEditor", "showSearch"],
    emits: ["update:modelValue"],
  },
}));

vi.mock("@/composables/useKeyboardShortcuts.js", () => ({
  useKeyboardShortcuts: vi.fn(),
}));

describe("IcationView", () => {
  let router;
  let wrapper;
  let mockFetchIcationData;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Setup router
    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: "/ication/:identifier", component: IcationView }],
    });

    // Mock fetch function
    mockFetchIcationData = vi.mocked(fetchIcationData);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = async (identifier = "test123") => {
    await router.push(`/ication/${identifier}`);

    return mount(IcationView, {
      global: {
        plugins: [router],
        provide: {
          breakpoints: { xs: 480, sm: 768, md: 1024, lg: 1280, xl: 1536 },
          xsMode: { value: false },
          mobileMode: { value: false },
        },
      },
    });
  };

  describe("Component Structure", () => {
    it("renders correctly with proper structure", async () => {
      const mockFile = new File({
        id: 123,
        title: "Test Preprint",
        source: ":rsm: test content ::",
        _settings: { background: "#ffffff", fontSize: "18px" },
      });

      const mockMetadata = {
        id: 123,
        title: "Test Preprint",
        authors: "Test Author",
        published_at: "2023-01-01T00:00:00Z",
      };

      mockFetchIcationData.mockResolvedValueOnce({
        file: mockFile,
        metadata: mockMetadata,
      });

      wrapper = await createWrapper();

      expect(wrapper.find("[data-testid='ication-container']").exists()).toBe(true);
      expect(wrapper.find("[data-testid='sidebar']").exists()).toBe(true);
    });

    it("has correct CSS classes", async () => {
      const mockFile = new File({
        id: 123,
        title: "Test Preprint",
        source: ":rsm: test content ::",
      });

      mockFetchIcationData.mockResolvedValueOnce({
        file: mockFile,
        metadata: { id: 123, title: "Test Preprint" },
      });

      wrapper = await createWrapper();

      const container = wrapper.find("[data-testid='ication-container']");
      expect(container.classes()).toContain("view");
      expect(container.classes()).toContain("ication-view");
    });
  });

  describe("Loading States", () => {
    it("shows loading spinner while fetching data", async () => {
      // Mock a delayed response
      mockFetchIcationData.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  file: new File({ id: 123, title: "Test", source: ":rsm: test ::" }),
                  metadata: { id: 123, title: "Test" },
                }),
              100
            );
          })
      );

      wrapper = await createWrapper();

      expect(wrapper.find("[data-testid='ication-loading']").exists()).toBe(true);
      expect(wrapper.find(".loading-spinner").exists()).toBe(true);
      expect(wrapper.text()).toContain("Loading preprint...");
    });

    it("shows canvas when content is loaded", async () => {
      const mockFile = new File({
        id: 123,
        title: "Test Preprint",
        source: ":rsm: test content ::",
      });

      mockFetchIcationData.mockResolvedValueOnce({
        file: mockFile,
        metadata: { id: 123, title: "Test Preprint" },
      });

      wrapper = await createWrapper();

      // Wait for the async data loading
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(wrapper.find("[data-testid='ication-canvas']").exists()).toBe(true);
      expect(wrapper.find("[data-testid='ication-loading']").exists()).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("shows error message when preprint not found", async () => {
      const notFoundError = new Error("HTTP 404: Not Found");
      mockFetchIcationData.mockRejectedValueOnce(notFoundError);

      wrapper = await createWrapper();

      // Wait for error to be processed
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(wrapper.find("[data-testid='ication-error']").exists()).toBe(true);
      expect(wrapper.text()).toContain("Preprint not found or not published");
    });

    it("shows generic error message for other errors", async () => {
      const networkError = new Error("Network error");
      mockFetchIcationData.mockRejectedValueOnce(networkError);

      wrapper = await createWrapper();

      // Wait for error to be processed
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(wrapper.find("[data-testid='ication-error']").exists()).toBe(true);
      expect(wrapper.text()).toContain("Network error");
    });

    it("converts 404 errors to user-friendly message", async () => {
      const notFoundError = new Error("HTTP 404: Not Found");
      mockFetchIcationData.mockRejectedValueOnce(notFoundError);

      wrapper = await createWrapper();

      // Wait for error to be processed
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(wrapper.vm.loadingError.message).toBe("Preprint not found or not published");
    });
  });

  describe("Preprint Banner", () => {
    it("shows preprint banner with metadata", async () => {
      const mockFile = new File({
        id: 123,
        title: "Test Preprint",
        source: ":rsm: test content ::",
      });

      const mockMetadata = {
        id: 123,
        title: "Test Preprint",
        authors: "John Doe, Jane Smith",
        published_at: "2023-01-01T00:00:00Z",
      };

      mockFetchIcationData.mockResolvedValueOnce({
        file: mockFile,
        metadata: mockMetadata,
      });

      wrapper = await createWrapper();

      // Wait for data to load
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(wrapper.find("[data-testid='preprint-banner']").exists()).toBe(true);
      expect(wrapper.text()).toContain("Public Preprint");
      expect(wrapper.text()).toContain("John Doe, Jane Smith");
      expect(wrapper.text()).toContain("Published");
    });

    it("hides banner in focus mode", async () => {
      const mockFile = new File({
        id: 123,
        title: "Test Preprint",
        source: ":rsm: test content ::",
      });

      mockFetchIcationData.mockResolvedValueOnce({
        file: mockFile,
        metadata: { id: 123, title: "Test Preprint", authors: "Test Author" },
      });

      wrapper = await createWrapper();

      // Wait for data to load
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Enable focus mode
      wrapper.vm.focusMode = true;
      await wrapper.vm.$nextTick();

      expect(wrapper.find("[data-testid='preprint-banner']").exists()).toBe(false);
    });

    it("shows back link to Aris homepage", async () => {
      const mockFile = new File({
        id: 123,
        title: "Test Preprint",
        source: ":rsm: test content ::",
      });

      mockFetchIcationData.mockResolvedValueOnce({
        file: mockFile,
        metadata: { id: 123, title: "Test Preprint", authors: "Test Author" },
      });

      wrapper = await createWrapper();

      // Wait for data to load
      await wrapper.vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 50));

      const backLink = wrapper.find("[data-testid='preprint-home-link']");
      expect(backLink.exists()).toBe(true);
      expect(backLink.attributes("href")).toBe("/");
      expect(backLink.text()).toContain("← Back to Aris");
    });
  });

  describe("Route Parameter Handling", () => {
    it("extracts identifier from route params", async () => {
      const mockFile = new File({
        id: 123,
        title: "Test Preprint",
        source: ":rsm: test content ::",
      });

      mockFetchIcationData.mockResolvedValueOnce({
        file: mockFile,
        metadata: { id: 123, title: "Test Preprint" },
      });

      wrapper = await createWrapper("abc123");

      expect(wrapper.vm.identifier).toBe("abc123");
      expect(mockFetchIcationData).toHaveBeenCalledWith("abc123");
    });

    it("handles UUID identifiers", async () => {
      const mockFile = new File({
        id: 123,
        title: "Test Preprint",
        source: ":rsm: test content ::",
      });

      mockFetchIcationData.mockResolvedValueOnce({
        file: mockFile,
        metadata: { id: 123, title: "Test Preprint" },
      });

      wrapper = await createWrapper("AbC123");

      expect(wrapper.vm.identifier).toBe("AbC123");
      expect(mockFetchIcationData).toHaveBeenCalledWith("AbC123");
    });

    it("handles permalink slug identifiers", async () => {
      const mockFile = new File({
        id: 123,
        title: "Test Preprint",
        source: ":rsm: test content ::",
      });

      mockFetchIcationData.mockResolvedValueOnce({
        file: mockFile,
        metadata: { id: 123, title: "Test Preprint" },
      });

      wrapper = await createWrapper("my-research-paper");

      expect(wrapper.vm.identifier).toBe("my-research-paper");
      expect(mockFetchIcationData).toHaveBeenCalledWith("my-research-paper");
    });
  });

  describe("Panel Management", () => {
    it("disables editor and search panels for public viewing", async () => {
      const mockFile = new File({
        id: 123,
        title: "Test Preprint",
        source: ":rsm: test content ::",
      });

      mockFetchIcationData.mockResolvedValueOnce({
        file: mockFile,
        metadata: { id: 123, title: "Test Preprint" },
      });

      wrapper = await createWrapper();

      expect(wrapper.vm.showEditor).toBe(false);
      expect(wrapper.vm.showSearch).toBe(false);

      // Try to show components - should remain false
      wrapper.vm.showComponent("DockableEditor");
      wrapper.vm.showComponent("DockableSearch");

      expect(wrapper.vm.showEditor).toBe(false);
      expect(wrapper.vm.showSearch).toBe(false);
    });
  });
});
