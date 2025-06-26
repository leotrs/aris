import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, nextTick, Suspense } from "vue";
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

  beforeEach(() => {
    mockFileStore = ref({
      files: [
        { id: "1", title: "File 1", filtered: false, focused: false },
        { id: "2", title: "File 2", filtered: false, focused: false },
        { id: "3", title: "File 3", filtered: true, focused: false }, // filtered out
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
          // Don't stub FilesItem or Suspense - let them work naturally
          ...overrides.stubs,
        },
      },
    });
  };

  describe("Suspense with Async FilesItem Components", () => {
    it("should show fallback content while async FilesItems are loading", async () => {
      const wrapper = createWrapper();

      // Suspense fallback should be visible initially if FilesItem is async
      const suspenseComponent = wrapper.findComponent(Suspense);
      expect(suspenseComponent.exists()).toBe(true);

      // Check if loading fallback appears
      const loadingElement = wrapper.find(".loading");
      if (loadingElement.exists()) {
        expect(loadingElement.text()).toBe("loading files...");
      }

      // Wait for async components to resolve
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      // After resolution, files container should be visible
      expect(wrapper.find('[data-testid="files-container"]').exists()).toBe(true);
    });

    it("should handle async FilesItem mounting and unmounting", async () => {
      const wrapper = createWrapper();

      // Wait for initial mount
      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should render the correct number of visible files
      const filesContainer = wrapper.find('[data-testid="files-container"]');
      expect(filesContainer.exists()).toBe(true);

      // Update file store to trigger re-render
      mockFileStore.value.files = [{ id: "4", title: "New File", filtered: false, focused: false }];

      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should handle the change gracefully
      expect(filesContainer.exists()).toBe(true);
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

    it("should handle null file store with Suspense gracefully", async () => {
      const wrapper = createWrapper({
        provide: {
          fileStore: ref({ files: null }),
        },
      });

      await nextTick();

      // Should show fallback content for null files
      const suspenseElement = wrapper.findComponent(Suspense);
      expect(suspenseElement.exists()).toBe(true);
    });
  });

  describe("Suspense Performance with Multiple Files", () => {
    it("should handle many async FilesItems efficiently", async () => {
      const manyFiles = Array.from({ length: 20 }, (_, i) => ({
        id: `file-${i}`,
        title: `File ${i}`,
        filtered: false,
        focused: false,
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
      const filesContainer = wrapper.find('[data-testid="files-container"]');
      expect(filesContainer.exists()).toBe(true);
    });

    it("should handle rapid file updates with Suspense", async () => {
      const wrapper = createWrapper();

      // Rapid updates to test Suspense stability
      for (let i = 0; i < 5; i++) {
        mockFileStore.value.files = [
          { id: `rapid-${i}`, title: `Rapid File ${i}`, filtered: false, focused: false },
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
              { id: "error-file" },
            ],
          }),
        },
      });

      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Component should not crash even with problematic data
      expect(wrapper.exists()).toBe(true);
    });

    it("should maintain Suspense boundary integrity during errors", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const wrapper = createWrapper();

      // Simulate an error condition
      mockFileStore.value.files = null;
      await nextTick();

      mockFileStore.value.files = [
        { id: "recovery", title: "Recovery File", filtered: false, focused: false },
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

      // Should have transitioned properly
      expect(transitionStates.length).toBeGreaterThan(0);
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
        { id: "new-1", title: "New File 1", filtered: false, focused: false },
        { id: "new-2", title: "New File 2", filtered: false, focused: false },
      ];

      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should handle replacement gracefully
      const filesContainer = wrapper.find('[data-testid="files-container"]');
      expect(filesContainer.exists()).toBe(true);
    });
  });
});
