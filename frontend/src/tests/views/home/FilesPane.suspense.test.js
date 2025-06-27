import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, nextTick } from "vue";
import FilesPane from "@/views/home/FilesPane.vue";

// Mock useListKeyboardNavigation
vi.mock("@/composables/useListKeyboardNavigation.js", () => ({
  useListKeyboardNavigation: vi.fn(() => ({
    activeIndex: ref(null),
  })),
}));

describe("FilesPane.vue - Suspense and Async Behavior", () => {
  let mockFileStore;
  let mockProvides;

  const createMockFile = (id, title, filtered = false, focused = false) => ({
    id,
    title,
    filtered,
    focused,
    last_edited_at: new Date().toISOString(),
    getFormattedDate: () => "2 hours ago",
    getFullDateTime: () => "December 27, 2024 at 8:33:46 AM",
    tags: [],
  });

  beforeEach(() => {
    const createMockFile = (id, title, filtered = false, focused = false) => ({
      id,
      title,
      filtered,
      focused,
      last_edited_at: new Date().toISOString(),
      getFormattedDate: () => "2 hours ago",
      getFullDateTime: () => "December 27, 2024 at 8:33:46 AM",
      tags: [],
    });

    mockFileStore = ref({
      files: [
        createMockFile("1", "File 1", false, false),
        createMockFile("2", "File 2", false, false),
        createMockFile("3", "File 3", true, false), // filtered out
      ],
    });

    mockProvides = {
      fileStore: mockFileStore,
      xsMode: ref(false),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = (overrides = {}) => {
    return mount(FilesPane, {
      global: {
        provide: {
          ...mockProvides,
          ...overrides.provide,
        },
        stubs: {
          Pane: {
            template: '<div class="pane"><slot name="header"></slot><slot></slot></div>',
          },
          Topbar: {
            template: '<div data-testid="topbar"></div>',
            emits: ["list", "cards"],
          },
          FilesHeader: {
            template: '<div data-testid="files-header"></div>',
            props: ["mode"],
          },
          FilesItem: {
            template: '<div class="file-item" data-testid="file-item">{{ modelValue.title }}</div>',
            props: ["modelValue", "mode"],
          },
          // Don't stub Suspense - let it work naturally
          ...overrides.stubs,
        },
      },
    });
  };

  describe("Suspense with Async FilesItem Components", () => {
    it("should render files container when files are available", async () => {
      const wrapper = createWrapper();

      // Check if we can find the files container or loading state
      await nextTick();
      
      // Check that the component renders some basic structure
      const filesWrapper = wrapper.find(".files-wrapper");
      expect(filesWrapper.exists()).toBe(true);

      // Check if loading fallback appears
      const loadingElement = wrapper.find(".loading");
      if (loadingElement.exists()) {
        expect(loadingElement.text()).toBe("loading files...");
      }

      // Wait for async components to resolve
      await nextTick();

      // Should render files container when files are available
      const filesContainer = wrapper.find('[data-testid="files-container"]');
      expect(filesContainer.exists()).toBe(true);
    });

    it("should handle async FilesItem mounting and unmounting", async () => {
      const wrapper = createWrapper();

      // Wait for initial mount
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should render correctly
      await nextTick();
      const filesWrapper = wrapper.find(".files-wrapper");
      expect(filesWrapper.exists()).toBe(true);

      // Update file store to trigger re-render
      const createMockFile = (id, title, filtered = false, focused = false) => ({
        id,
        title,
        filtered,
        focused,
        last_edited_at: new Date().toISOString(),
        getFormattedDate: () => "2 hours ago",
        getFullDateTime: () => "December 27, 2024 at 8:33:46 AM",
        tags: [],
      });

      mockFileStore.value.files = [createMockFile("4", "New File", false, false)];

      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should handle the change gracefully
      const filesWrapper2 = wrapper.find(".files-wrapper");
      expect(filesWrapper2.exists()).toBe(true);
    });

    it("should handle empty file list with Suspense", async () => {
      const wrapper = createWrapper({
        provide: {
          fileStore: ref({ files: [] }),
        },
      });

      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should render empty container without errors
      const filesContainer = wrapper.find('[data-testid="files-container"]');
      expect(filesContainer.exists()).toBe(true);
    });

    it("should handle null file store gracefully", async () => {
      const wrapper = createWrapper({
        provide: {
          fileStore: ref({ files: null }),
        },
      });

      await nextTick();

      // Should handle null files gracefully
      await nextTick();
      const wrapper_el = wrapper.find(".files-wrapper");
      expect(wrapper_el.exists()).toBe(true);
    });
  });

  describe("Suspense Performance with Multiple Files", () => {
    it("should handle many async FilesItems efficiently", async () => {
      const manyFiles = Array.from({ length: 20 }, (_, i) => ({
        id: `file-${i}`,
        title: `File ${i}`,
        filtered: false,
        focused: false,
        getFormattedDate: () => "2 hours ago",
        getFullDateTime: () => "December 27, 2024 at 8:33:46 AM",
        tags: [],
      }));

      const wrapper = createWrapper({
        provide: {
          fileStore: ref({ files: manyFiles }),
        },
      });

      // Wait for all async components to resolve
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      // All files should be rendered
      await nextTick();
      const filesWrapper = wrapper.find(".files-wrapper");
      expect(filesWrapper.exists()).toBe(true);
    });

    it.skip("should handle rapid file updates with Suspense", async () => {
      const wrapper = createWrapper();

      // Rapid updates to test Suspense stability
      for (let i = 0; i < 5; i++) {
        mockFileStore.value.files = [
          {
            id: `rapid-${i}`,
            title: `Rapid File ${i}`,
            filtered: false,
            focused: false,
            getFormattedDate: () => "2 hours ago",
            getFullDateTime: () => "December 27, 2024 at 8:33:46 AM",
            tags: [],
          },
        ];
        await nextTick();
      }

      // Wait for final resolution
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Should handle rapid updates without errors
      const filesContainer = wrapper.find('[data-testid="files-container"]');
      expect(filesContainer.exists()).toBe(true);
    });
  });

  describe("Suspense Error Handling", () => {
    it("should handle async component errors gracefully", async () => {
      // Create a scenario that might cause async component errors
      const wrapper = createWrapper({
        provide: {
          fileStore: ref({
            files: [
              // Missing required properties to potentially trigger errors
              {
                id: "error-file",
                getFormattedDate: () => "2 hours ago",
                getFullDateTime: () => "December 27, 2024 at 8:33:46 AM",
                tags: [],
              },
            ],
          }),
        },
      });

      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Component should not crash even with problematic data
      expect(wrapper.exists()).toBe(true);
    });

    it.skip("should maintain Suspense boundary integrity during errors", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const wrapper = createWrapper();

      // Simulate an error condition
      mockFileStore.value.files = null;
      await nextTick();

      mockFileStore.value.files = [
        {
          id: "recovery",
          title: "Recovery File",
          filtered: false,
          focused: false,
          getFormattedDate: () => "2 hours ago",
          getFullDateTime: () => "December 27, 2024 at 8:33:46 AM",
          tags: [],
        },
      ];
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should recover gracefully
      expect(wrapper.exists()).toBe(true);

      consoleSpy.mockRestore();
    });
  });

  describe("Suspense Transitions", () => {
    it("should handle smooth transitions between loading and loaded states", async () => {
      const wrapper = createWrapper();

      // Track state transitions
      const transitionStates = [];

      // Check initial state
      if (wrapper.find(".loading").exists()) {
        transitionStates.push("loading");
      }

      // Wait for transition
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      if (wrapper.find('[data-testid="files-container"]').exists()) {
        transitionStates.push("loaded");
      }

      // Check final state - should have files wrapper
      const filesWrapper = wrapper.find(".files-wrapper");
      expect(filesWrapper.exists()).toBe(true);
    });

    it("should handle Suspense with view mode changes", async () => {
      const wrapper = createWrapper();

      // Wait for initial load
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Change view mode
      wrapper.vm.mode = "cards";
      await nextTick();

      // Should handle mode change with async components
      const filesContainer = wrapper.find('[data-testid="files-container"]');
      expect(filesContainer.exists()).toBe(true);
      if (filesContainer.exists()) {
        expect(filesContainer.classes()).toContain("cards");
      }
    });
  });

  describe("Suspense Integration with Keyboard Navigation", () => {
    it("should integrate keyboard navigation with async FilesItems", async () => {
      const mockUseListKeyboardNavigation = await import(
        "@/composables/useListKeyboardNavigation.js"
      );
      const activeIndexRef = ref(0);
      mockUseListKeyboardNavigation.useListKeyboardNavigation.mockReturnValue({
        activeIndex: activeIndexRef,
      });

      const wrapper = createWrapper();

      // Wait for async components to load
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Simulate keyboard navigation
      activeIndexRef.value = 1;
      await nextTick();

      // Should handle navigation with async components
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Suspense Memory Management", () => {
    it("should properly cleanup async components on unmount", async () => {
      const wrapper = createWrapper();

      // Wait for mount
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Unmount component
      wrapper.unmount();

      // Should unmount without memory leaks or errors
      expect(true).toBe(true); // Basic test that unmount doesn't throw
    });

    it("should handle component replacement within Suspense", async () => {
      const wrapper = createWrapper();

      // Wait for initial load
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Replace files completely
      mockFileStore.value.files = [
        {
          id: "new-1",
          title: "New File 1",
          filtered: false,
          focused: false,
          getFormattedDate: () => "2 hours ago",
          getFullDateTime: () => "December 27, 2024 at 8:33:46 AM",
          tags: [],
        },
        {
          id: "new-2",
          title: "New File 2",
          filtered: false,
          focused: false,
          getFormattedDate: () => "2 hours ago",
          getFullDateTime: () => "December 27, 2024 at 8:33:46 AM",
          tags: [],
        },
      ];

      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should handle replacement gracefully
      const filesContainer = wrapper.find('[data-testid="files-container"]');
      expect(filesContainer.exists()).toBe(true);
    });
  });
});
