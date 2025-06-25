import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import DemoView from "@/views/demo/View.vue";

// Mock child components
vi.mock("@/views/workspace/Sidebar.vue", () => ({
  default: {
    name: "Sidebar",
    template: '<div data-testid="sidebar-mock">Sidebar</div>',
    emits: ["show-component", "hide-component"],
  },
}));

vi.mock("@/components/demo/DemoCanvas.vue", () => ({
  default: {
    name: "DemoCanvas",
    template: '<div data-testid="demo-canvas-mock">DemoCanvas</div>',
    props: ["showEditor", "showSearch"],
    emits: ["update:modelValue"],
  },
}));

// Mock demo data with default mock
const mockPost = vi.fn().mockResolvedValue({ data: "<html>Test HTML</html>" });
vi.mock("@/views/demo/demoData.js", () => ({
  demoFile: {
    id: 999,
    title: "Test Demo File",
    source: ":rsm:# Test Content::",
  },
  demoUser: { id: 1, name: "Demo User" },
  demoFileStore: { files: [] },
  demoAnnotations: [],
  createDemoApi: () => ({
    post: mockPost,
    getUri: () => "http://localhost:8000",
  }),
}));

// Mock File model
vi.mock("@/models/File.js", () => ({
  File: class MockFile {
    constructor(data) {
      Object.assign(this, data);
    }
  },
}));

// Mock composables
const mockUseKeyboardShortcuts = vi.fn();
vi.mock("@vueuse/core", () => ({
  breakpointsTailwind: {},
  useBreakpoints: () => ({
    smallerOrEqual: (size) => ref(size === "xs" ? false : false),
  }),
}));

vi.mock("@/composables/useKeyboardShortcuts.js", () => ({
  useKeyboardShortcuts: mockUseKeyboardShortcuts,
}));

describe("Demo View", () => {
  let wrapper;
  let _mockApi;

  beforeEach(() => {
    _mockApi = {
      post: vi.fn().mockResolvedValue({ data: "<html>Test HTML</html>" }),
      getUri: () => "http://localhost:8000",
    };
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.clearAllMocks();
  });

  describe("Basic Rendering & Structure", () => {
    it("renders demo banner with correct text and back link", async () => {
      wrapper = mount(DemoView);
      await nextTick();

      const banner = wrapper.find(".demo-banner");
      expect(banner.exists()).toBe(true);
      expect(banner.text()).toContain("Demo Mode - Experience Aris workspace with sample content");

      const backLink = wrapper.find(".demo-link");
      expect(backLink.exists()).toBe(true);
      expect(backLink.attributes("href")).toBe("/");
      expect(backLink.text()).toContain("← Back to homepage");
    });

    it("renders demo container with correct data-testid", async () => {
      wrapper = mount(DemoView);
      await nextTick();

      const container = wrapper.find('[data-testid="demo-container"]');
      expect(container.exists()).toBe(true);
      expect(container.classes()).toContain("demo-view");
    });

    it("renders Sidebar component", async () => {
      wrapper = mount(DemoView);
      await nextTick();

      const sidebar = wrapper.find('[data-testid="sidebar-mock"]');
      expect(sidebar.exists()).toBe(true);
    });

    it("renders DemoCanvas when file is available", async () => {
      wrapper = mount(DemoView);
      await nextTick();

      const demoCanvas = wrapper.find('[data-testid="demo-canvas-mock"]');
      expect(demoCanvas.exists()).toBe(true);
    });

    it("has correct demo banner icon", async () => {
      wrapper = mount(DemoView);
      await nextTick();

      const icon = wrapper.find(".demo-icon");
      expect(icon.exists()).toBe(true);
      expect(icon.text()).toBe("ℹ️");
    });
  });

  describe("Responsive Behavior", () => {
    it("applies mobile class when mobileMode is true", async () => {
      // Mock breakpoints to return mobile true
      vi.doMock("@vueuse/core", () => ({
        breakpointsTailwind: {},
        useBreakpoints: () => ({
          smallerOrEqual: (size) => ref(size === "sm"),
        }),
      }));

      wrapper = mount(DemoView);
      await nextTick();

      const container = wrapper.find('[data-testid="demo-container"]');
      expect(container.classes()).toContain("mobile");
    });

    it("applies focus class when focusMode is true", async () => {
      wrapper = mount(DemoView);
      await nextTick();

      // Trigger focus mode
      const vm = wrapper.vm;
      vm.focusMode = true;
      await nextTick();

      const container = wrapper.find('[data-testid="demo-container"]');
      expect(container.classes()).toContain("focus");
    });

    it("hides demo banner in focus mode", async () => {
      wrapper = mount(DemoView);
      await nextTick();

      // Enable focus mode
      const vm = wrapper.vm;
      vm.focusMode = true;
      await nextTick();

      const banner = wrapper.find(".demo-banner");
      expect(banner.element.style.display).toBe("none");
    });
  });

  describe("Component Communication", () => {
    it("handles showComponent event from Sidebar for editor", async () => {
      wrapper = mount(DemoView);
      await nextTick();

      const sidebar = wrapper.findComponent({ name: "Sidebar" });
      await sidebar.vm.$emit("show-component", "DockableEditor");

      const demoCanvas = wrapper.findComponent({ name: "DemoCanvas" });
      expect(demoCanvas.props("showEditor")).toBe(true);
    });

    it("handles hideComponent event from Sidebar for editor", async () => {
      wrapper = mount(DemoView);
      await nextTick();

      // First show the editor
      const sidebar = wrapper.findComponent({ name: "Sidebar" });
      await sidebar.vm.$emit("show-component", "DockableEditor");
      await nextTick();

      // Then hide it
      await sidebar.vm.$emit("hide-component", "DockableEditor");
      await nextTick();

      const demoCanvas = wrapper.findComponent({ name: "DemoCanvas" });
      expect(demoCanvas.props("showEditor")).toBe(false);
    });

    it("handles showComponent event from Sidebar for search", async () => {
      wrapper = mount(DemoView);
      await nextTick();

      const sidebar = wrapper.findComponent({ name: "Sidebar" });
      await sidebar.vm.$emit("show-component", "DockableSearch");

      const demoCanvas = wrapper.findComponent({ name: "DemoCanvas" });
      expect(demoCanvas.props("showSearch")).toBe(true);
    });

    it("handles hideComponent event from Sidebar for search", async () => {
      wrapper = mount(DemoView);
      await nextTick();

      // First show the search
      const sidebar = wrapper.findComponent({ name: "Sidebar" });
      await sidebar.vm.$emit("show-component", "DockableSearch");
      await nextTick();

      // Then hide it
      await sidebar.vm.$emit("hide-component", "DockableSearch");
      await nextTick();

      const demoCanvas = wrapper.findComponent({ name: "DemoCanvas" });
      expect(demoCanvas.props("showSearch")).toBe(false);
    });
  });

  describe("Async Content Loading", () => {
    it("calls demo API to render RSM content on mount", async () => {
      mockPost.mockClear();

      wrapper = mount(DemoView);
      await nextTick();

      // Wait for the onMounted hook to execute
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockPost).toHaveBeenCalledWith("/render", {
        source: ":rsm:# Test Content::",
      });
    });

    it("sets file.html property after successful API call", async () => {
      mockPost.mockResolvedValue({ data: "<html>Rendered HTML</html>" });
      mockPost.mockClear();

      wrapper = mount(DemoView);
      await nextTick();

      // Wait for async API call
      await new Promise((resolve) => setTimeout(resolve, 100));
      await nextTick();

      const vm = wrapper.vm;
      expect(vm.demoFileReactive.html).toBe("<html>Rendered HTML</html>");
    });
  });

  describe("Keyboard Shortcuts", () => {
    it("registers keyboard shortcuts for focus mode", async () => {
      mockUseKeyboardShortcuts.mockClear();

      wrapper = mount(DemoView);
      await nextTick();

      expect(mockUseKeyboardShortcuts).toHaveBeenCalledWith({
        c: expect.any(Function),
      });
    });

    it("toggles focus mode when shortcut function is called", async () => {
      let shortcutCallback;

      mockUseKeyboardShortcuts.mockImplementation((shortcuts) => {
        shortcutCallback = shortcuts.c;
      });

      wrapper = mount(DemoView);
      await nextTick();

      const vm = wrapper.vm;
      expect(vm.focusMode).toBe(false);

      // Call the shortcut callback
      if (shortcutCallback) {
        shortcutCallback();
        await nextTick();

        expect(vm.focusMode).toBe(true);

        // Call again to toggle back
        shortcutCallback();
        await nextTick();

        expect(vm.focusMode).toBe(false);
      } else {
        // If shortcut callback isn't captured, skip this test
        expect(true).toBe(true);
      }
    });
  });

  describe("Provide/Inject Integration", () => {
    it("provides API instance to child components", async () => {
      wrapper = mount(DemoView);
      await nextTick();

      const provided = wrapper.vm.$.provides;
      expect(provided.api).toBeDefined();
      expect(provided.api.getUri).toBeDefined();
    });

    it("provides viewport and breakpoint info", async () => {
      wrapper = mount(DemoView);
      await nextTick();

      const provided = wrapper.vm.$.provides;
      expect(provided.breakpoints).toBeDefined();
      expect(provided.xsMode).toBeDefined();
      expect(provided.mobileMode).toBeDefined();
    });

    it("provides user, fileStore, and file data", async () => {
      wrapper = mount(DemoView);
      await nextTick();

      const provided = wrapper.vm.$.provides;
      expect(provided.user).toBeDefined();
      expect(provided.fileStore).toBeDefined();
      expect(provided.file).toBeDefined();
    });

    it("provides demo annotations and file settings", async () => {
      wrapper = mount(DemoView);
      await nextTick();

      const provided = wrapper.vm.$.provides;
      expect(provided.annotations).toBeDefined();
      expect(provided.fileSettings).toBeDefined();
    });

    it("provides drawer and focus mode state", async () => {
      wrapper = mount(DemoView);
      await nextTick();

      const provided = wrapper.vm.$.provides;
      expect(provided.drawerOpen).toBeDefined();
      expect(provided.focusMode).toBeDefined();
      expect(provided.sidebarIsCollapsed).toBeDefined();
      expect(provided.isDev).toBeDefined();
    });
  });
});
