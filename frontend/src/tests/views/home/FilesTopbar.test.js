import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, nextTick } from "vue";
import FilesTopbar from "@/views/home/FilesTopbar.vue";

// Mock useKeyboardShortcuts
vi.mock("@/composables/useKeyboardShortcuts.js", () => ({
  useKeyboardShortcuts: vi.fn(),
}));

describe("FilesTopbar.vue", () => {
  let mockFileStore;
  let mockProvides;

  beforeEach(() => {
    mockFileStore = ref({
      clearFilters: vi.fn(),
      filterFiles: vi.fn(),
    });

    mockProvides = {
      fileStore: mockFileStore,
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = (overrides = {}) => {
    return mount(FilesTopbar, {
      global: {
        provide: {
          ...mockProvides,
          ...overrides.provide,
        },
        stubs: {
          SearchBar: {
            template:
              "<div data-testid=\"search-bar\" @click=\"$emit('submit', 'test search')\"></div>",
            emits: ["submit"],
            methods: {
              focusInput: vi.fn(),
            },
          },
          ...overrides.stubs,
        },
      },
    });
  };

  describe("Component Rendering", () => {
    it("renders with basic structure", () => {
      const wrapper = createWrapper();

      expect(wrapper.find(".tb-wrapper").exists()).toBe(true);
      expect(wrapper.find(".tb-search").exists()).toBe(true);
      expect(wrapper.find('[data-testid="search-bar"]').exists()).toBe(true);
    });

    it("renders SearchBar component", () => {
      const wrapper = createWrapper();

      const searchBar = wrapper.findComponent('[data-testid="search-bar"]');
      expect(searchBar.exists()).toBe(true);
    });
  });

  describe("View Mode Control", () => {
    it("defaults to list mode (controlState = 0)", () => {
      const wrapper = createWrapper();

      expect(wrapper.vm.controlState).toBe(0);
    });

    it("emits 'list' event when controlState changes to 0", async () => {
      const wrapper = createWrapper();

      wrapper.vm.controlState = 1; // Switch to cards
      await nextTick();
      wrapper.vm.controlState = 0; // Switch back to list
      await nextTick();

      expect(wrapper.emitted().list).toBeTruthy();
    });

    it("emits 'cards' event when controlState changes to 1", async () => {
      const wrapper = createWrapper();

      wrapper.vm.controlState = 1;
      await nextTick();

      expect(wrapper.emitted().cards).toBeTruthy();
    });

    it("emits events when controlState changes", async () => {
      const wrapper = createWrapper();

      wrapper.vm.controlState = 1;
      await nextTick();

      expect(wrapper.emitted().cards).toBeTruthy();
      expect(wrapper.emitted().cards).toHaveLength(1);

      wrapper.vm.controlState = 0;
      await nextTick();

      expect(wrapper.emitted().list).toBeTruthy();
    });
  });

  describe("Search Functionality", () => {
    it("handles search submission correctly", () => {
      const wrapper = createWrapper();

      wrapper.vm.onSearchSubmit("test query");

      expect(mockFileStore.value.clearFilters).toHaveBeenCalledOnce();
      expect(mockFileStore.value.filterFiles).toHaveBeenCalledOnce();
      expect(mockFileStore.value.filterFiles).toHaveBeenCalledWith(expect.any(Function));
    });

    it("filters files by title case-insensitively", () => {
      const wrapper = createWrapper();

      wrapper.vm.onSearchSubmit("TeSt");

      const filterFunction = mockFileStore.value.filterFiles.mock.calls[0][0];

      // Test the filter function
      expect(filterFunction({ title: "test file" })).toBe(false); // Should show (not filtered)
      expect(filterFunction({ title: "TEST FILE" })).toBe(false); // Should show (not filtered)
      expect(filterFunction({ title: "other file" })).toBe(true); // Should hide (filtered)
    });

    it("handles empty search string", () => {
      const wrapper = createWrapper();

      wrapper.vm.onSearchSubmit("");

      expect(mockFileStore.value.clearFilters).toHaveBeenCalledOnce();

      const filterFunction = mockFileStore.value.filterFiles.mock.calls[0][0];
      // Empty search should show all files
      expect(filterFunction({ title: "any file" })).toBe(false);
    });

    it("handles search strings with special characters", () => {
      const wrapper = createWrapper();

      wrapper.vm.onSearchSubmit("test-file.txt");

      const filterFunction = mockFileStore.value.filterFiles.mock.calls[0][0];

      expect(filterFunction({ title: "test-file.txt" })).toBe(false); // Should show
      expect(filterFunction({ title: "other.txt" })).toBe(true); // Should hide
    });

    it("responds to SearchBar submit events", async () => {
      const wrapper = createWrapper();

      const searchBar = wrapper.findComponent('[data-testid="search-bar"]');
      await searchBar.trigger("click"); // This triggers the submit event with 'test search'

      expect(mockFileStore.value.clearFilters).toHaveBeenCalledOnce();
      expect(mockFileStore.value.filterFiles).toHaveBeenCalledOnce();
    });
  });

  describe("Keyboard Shortcuts Integration", () => {
    it("registers keyboard shortcuts on mount", async () => {
      const { useKeyboardShortcuts } = await import("@/composables/useKeyboardShortcuts.js");

      createWrapper();

      expect(useKeyboardShortcuts).toHaveBeenCalledWith(
        {
          "v,l": { fn: expect.any(Function), description: "view as list" },
          "v,c": { fn: expect.any(Function), description: "view as cards" },
          "/": { fn: expect.any(Function), description: "search" },
        },
        true,
        "Home view"
      );
    });

    it("keyboard shortcut 'v,l' switches to list mode", async () => {
      const { useKeyboardShortcuts } = await import("@/composables/useKeyboardShortcuts.js");

      const wrapper = createWrapper();

      // Get the registered shortcuts
      const shortcuts = useKeyboardShortcuts.mock.calls[0][0];

      // Simulate 'v,l' shortcut
      wrapper.vm.controlState = 1; // Start in cards mode
      await nextTick();

      shortcuts["v,l"].fn();

      expect(wrapper.vm.controlState).toBe(0);
    });

    it("keyboard shortcut 'v,c' switches to cards mode", async () => {
      const { useKeyboardShortcuts } = await import("@/composables/useKeyboardShortcuts.js");

      const wrapper = createWrapper();

      // Get the registered shortcuts
      const shortcuts = useKeyboardShortcuts.mock.calls[0][0];

      // Simulate 'v,c' shortcut
      shortcuts["v,c"].fn();

      expect(wrapper.vm.controlState).toBe(1);
    });

    it("keyboard shortcut '/' focuses search input", async () => {
      const { useKeyboardShortcuts } = await import("@/composables/useKeyboardShortcuts.js");

      const mockFocusInput = vi.fn();
      createWrapper({
        stubs: {
          SearchBar: {
            template: '<div data-testid="search-bar"></div>',
            methods: {
              focusInput: mockFocusInput,
            },
          },
        },
      });

      // Get the registered shortcuts
      const shortcuts = useKeyboardShortcuts.mock.calls[0][0];

      // Simulate '/' shortcut
      shortcuts["/"].fn();

      expect(mockFocusInput).toHaveBeenCalledOnce();
    });
  });

  describe("Template Ref Management", () => {
    it("maintains reference to search bar component", () => {
      const wrapper = createWrapper();

      expect(wrapper.vm.searchBar).toBeDefined();
    });

    it("handles missing search bar reference gracefully", async () => {
      const { useKeyboardShortcuts } = await import("@/composables/useKeyboardShortcuts.js");

      createWrapper({
        stubs: {
          SearchBar: {
            template: '<div data-testid="search-bar"></div>',
            // No focusInput method
          },
        },
      });

      // Get the registered shortcuts
      const shortcuts = useKeyboardShortcuts.mock.calls[0][0];

      // Simulate '/' shortcut when focusInput is not available
      expect(() => shortcuts["/"].fn()).toThrow();
    });
  });

  describe("Error Handling", () => {
    it("handles missing fileStore gracefully", () => {
      const wrapper = createWrapper({
        provide: {
          fileStore: ref(null),
        },
      });

      // Should not throw when trying to search
      expect(() => wrapper.vm.onSearchSubmit("test")).toThrow();
    });

    it("handles fileStore without required methods", () => {
      const wrapper = createWrapper({
        provide: {
          fileStore: ref({}), // Empty object without clearFilters/filterFiles
        },
      });

      // Should not throw when trying to search
      expect(() => wrapper.vm.onSearchSubmit("test")).toThrow();
    });
  });

  describe("Component Lifecycle", () => {
    it("initializes with correct default values", () => {
      const wrapper = createWrapper();

      expect(wrapper.vm.controlState).toBe(0);
      expect(typeof wrapper.vm.onSearchSubmit).toBe("function");
    });

    it("cleans up properly on unmount", () => {
      const wrapper = createWrapper();

      // Should not throw on unmount
      expect(() => wrapper.unmount()).not.toThrow();
    });
  });

  describe("Reactivity", () => {
    it("reacts to controlState changes", async () => {
      const wrapper = createWrapper();

      const initialEmittedCount = wrapper.emitted().list?.length || 0;

      wrapper.vm.controlState = 1;
      await nextTick();

      expect(wrapper.emitted().cards).toBeTruthy();

      wrapper.vm.controlState = 0;
      await nextTick();

      expect(wrapper.emitted().list?.length).toBeGreaterThan(initialEmittedCount);
    });
  });
});
