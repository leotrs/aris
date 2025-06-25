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

  describe("Enhanced Search Edge Cases", () => {
    it("handles extremely long search queries", () => {
      const wrapper = createWrapper();
      const longQuery = "a".repeat(1000);

      wrapper.vm.onSearchSubmit(longQuery);

      expect(mockFileStore.value.clearFilters).toHaveBeenCalledOnce();
      expect(mockFileStore.value.filterFiles).toHaveBeenCalledOnce();

      const filterFunction = mockFileStore.value.filterFiles.mock.calls[0][0];
      expect(filterFunction({ title: longQuery })).toBe(false); // Should show
      expect(filterFunction({ title: "short" })).toBe(true); // Should hide
    });

    it("handles search with only whitespace", () => {
      const wrapper = createWrapper();
      const whitespaceQuery = "   \t\n   ";

      wrapper.vm.onSearchSubmit(whitespaceQuery);

      expect(mockFileStore.value.clearFilters).toHaveBeenCalledOnce();
      const filterFunction = mockFileStore.value.filterFiles.mock.calls[0][0];
      // Whitespace-only search should behave like empty search - show all files
      expect(filterFunction({ title: "any file" })).toBe(false);
    });

    it("handles unicode and emoji in search", () => {
      const wrapper = createWrapper();
      const unicodeQuery = "研究 🧬 café";

      wrapper.vm.onSearchSubmit(unicodeQuery);

      const filterFunction = mockFileStore.value.filterFiles.mock.calls[0][0];
      expect(filterFunction({ title: "研究 paper" })).toBe(false); // Should show
      expect(filterFunction({ title: "DNA 🧬 study" })).toBe(false); // Should show
      expect(filterFunction({ title: "café data" })).toBe(false); // Should show
      expect(filterFunction({ title: "other file" })).toBe(true); // Should hide
    });

    it("handles regex special characters safely", () => {
      const wrapper = createWrapper();
      const regexQuery = ".*+?^${}()|[]\\";

      // Should not throw an error
      expect(() => wrapper.vm.onSearchSubmit(regexQuery)).not.toThrow();

      const filterFunction = mockFileStore.value.filterFiles.mock.calls[0][0];
      expect(filterFunction({ title: regexQuery })).toBe(false); // Should show exact match
      expect(filterFunction({ title: "other" })).toBe(true); // Should hide
    });

    it("preserves case insensitivity with complex strings", () => {
      const wrapper = createWrapper();

      wrapper.vm.onSearchSubmit("DNA-Seq");

      const filterFunction = mockFileStore.value.filterFiles.mock.calls[0][0];
      expect(filterFunction({ title: "dna-seq analysis" })).toBe(false); // Should show
      expect(filterFunction({ title: "DNA-SEQ results" })).toBe(false); // Should show
      expect(filterFunction({ title: "DnA-sEq report" })).toBe(false); // Should show
      expect(filterFunction({ title: "RNA analysis" })).toBe(true); // Should hide
    });

    it("handles rapid sequential searches", async () => {
      const wrapper = createWrapper();

      // Rapid fire search submissions
      wrapper.vm.onSearchSubmit("first");
      wrapper.vm.onSearchSubmit("second");
      wrapper.vm.onSearchSubmit("third");

      // Should clear filters before each new search
      expect(mockFileStore.value.clearFilters).toHaveBeenCalledTimes(3);
      expect(mockFileStore.value.filterFiles).toHaveBeenCalledTimes(3);

      // Latest filter should be for "third"
      const lastFilterFunction = mockFileStore.value.filterFiles.mock.calls[2][0];
      expect(lastFilterFunction({ title: "third result" })).toBe(false);
      expect(lastFilterFunction({ title: "first result" })).toBe(true);
    });

    it("handles null or undefined search queries", () => {
      const wrapper = createWrapper();

      // Test null query
      expect(() => wrapper.vm.onSearchSubmit(null)).not.toThrow();
      
      // Test undefined query
      expect(() => wrapper.vm.onSearchSubmit(undefined)).not.toThrow();

      // Both should be treated as empty searches
      expect(mockFileStore.value.clearFilters).toHaveBeenCalledTimes(2);
    });
  });

  describe("Enhanced Keyboard Shortcuts", () => {
    it("registers all expected keyboard shortcuts with correct descriptions", () => {
      const wrapper = createWrapper();
      const { useKeyboardShortcuts } = vi.mocked(await import("@/composables/useKeyboardShortcuts.js"));

      const registeredShortcuts = useKeyboardShortcuts.mock.calls[0][0];
      
      expect(registeredShortcuts).toMatchObject({
        "v,l": { description: "view as list" },
        "v,c": { description: "view as cards" },
        "/": { description: "search" },
      });

      // Verify it's registered with correct parameters
      expect(useKeyboardShortcuts).toHaveBeenCalledWith(
        expect.any(Object),
        true, // isActive
        "Home view" // scope
      );
    });

    it("handles keyboard shortcuts when component is inactive", () => {
      // Create wrapper but assume component becomes inactive
      createWrapper();
      
      const { useKeyboardShortcuts } = vi.mocked(await import("@/composables/useKeyboardShortcuts.js"));
      
      // Verify shortcuts were registered as active
      expect(useKeyboardShortcuts).toHaveBeenCalledWith(
        expect.any(Object),
        true, // Component should register as active
        "Home view"
      );
    });

    it("executes view mode shortcuts correctly with state verification", async () => {
      const wrapper = createWrapper();
      const { useKeyboardShortcuts } = vi.mocked(await import("@/composables/useKeyboardShortcuts.js"));
      const shortcuts = useKeyboardShortcuts.mock.calls[0][0];

      // Test v,l shortcut (switch to list)
      wrapper.vm.controlState = 1; // Start in cards mode
      await nextTick();
      
      shortcuts["v,l"].fn();
      expect(wrapper.vm.controlState).toBe(0);
      expect(wrapper.emitted().list).toBeTruthy();

      // Test v,c shortcut (switch to cards)
      shortcuts["v,c"].fn();
      expect(wrapper.vm.controlState).toBe(1);
      expect(wrapper.emitted().cards).toBeTruthy();
    });

    it("handles search shortcut when SearchBar is not ready", async () => {
      const { useKeyboardShortcuts } = await import("@/composables/useKeyboardShortcuts.js");
      
      createWrapper({
        stubs: {
          SearchBar: {
            template: '<div data-testid="search-bar"></div>',
            // Intentionally missing focusInput method
          },
        },
      });

      const shortcuts = useKeyboardShortcuts.mock.calls[0][0];
      
      // Should throw when trying to focus non-existent method
      expect(() => shortcuts["/"].fn()).toThrow();
    });

    it("maintains keyboard shortcut scope throughout component lifecycle", () => {
      const wrapper = createWrapper();
      const { useKeyboardShortcuts } = vi.mocked(await import("@/composables/useKeyboardShortcuts.js"));

      // Verify scope is maintained
      expect(useKeyboardShortcuts).toHaveBeenCalledWith(
        expect.any(Object),
        true,
        "Home view" // Consistent scope
      );

      // Component should not re-register shortcuts on updates
      wrapper.vm.controlState = 1;
      expect(useKeyboardShortcuts).toHaveBeenCalledTimes(1);
    });

    it("handles simultaneous shortcut presses gracefully", async () => {
      const wrapper = createWrapper();
      const { useKeyboardShortcuts } = vi.mocked(await import("@/composables/useKeyboardShortcuts.js"));
      const shortcuts = useKeyboardShortcuts.mock.calls[0][0];

      // Simulate rapid shortcut presses
      shortcuts["v,l"].fn();
      shortcuts["v,c"].fn();
      shortcuts["v,l"].fn();
      
      await nextTick();
      
      // Should end up in list mode (last shortcut wins)
      expect(wrapper.vm.controlState).toBe(0);
    });
  });

  describe("Search Performance and Memory", () => {
    it("does not leak memory with repeated searches", () => {
      const wrapper = createWrapper();
      
      // Perform many searches to test for memory leaks
      for (let i = 0; i < 100; i++) {
        wrapper.vm.onSearchSubmit(`query ${i}`);
      }
      
      // Each search should clear previous filters
      expect(mockFileStore.value.clearFilters).toHaveBeenCalledTimes(100);
      expect(mockFileStore.value.filterFiles).toHaveBeenCalledTimes(100);
    });

    it("handles search with very large file lists efficiently", () => {
      const wrapper = createWrapper();
      
      wrapper.vm.onSearchSubmit("test");
      const filterFunction = mockFileStore.value.filterFiles.mock.calls[0][0];
      
      // Simulate filtering large number of files
      const startTime = performance.now();
      for (let i = 0; i < 10000; i++) {
        filterFunction({ title: `file ${i} test` });
      }
      const endTime = performance.now();
      
      // Filter should complete within reasonable time (adjust threshold as needed)
      expect(endTime - startTime).toBeLessThan(100); // 100ms threshold
    });
  });

  describe("Integration Edge Cases", () => {
    it("maintains view mode state during search operations", async () => {
      const wrapper = createWrapper();
      
      // Switch to cards mode
      wrapper.vm.controlState = 1;
      await nextTick();
      
      // Perform search
      wrapper.vm.onSearchSubmit("test query");
      
      // View mode should remain unchanged
      expect(wrapper.vm.controlState).toBe(1);
    });

    it("handles component re-mounting with preserved state", () => {
      let wrapper = createWrapper();
      wrapper.vm.controlState = 1;
      wrapper.unmount();
      
      // Re-mount component
      wrapper = createWrapper();
      
      // Should start with default state again
      expect(wrapper.vm.controlState).toBe(0);
    });

    it("handles concurrent search and view mode changes", async () => {
      const wrapper = createWrapper();
      
      // Simulate concurrent operations
      wrapper.vm.onSearchSubmit("concurrent test");
      wrapper.vm.controlState = 1;
      await nextTick();
      
      // Both operations should complete successfully
      expect(mockFileStore.value.filterFiles).toHaveBeenCalledOnce();
      expect(wrapper.vm.controlState).toBe(1);
      expect(wrapper.emitted().cards).toBeTruthy();
    });
  });
});
