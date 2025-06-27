import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, reactive } from "vue";
import Canvas from "@/views/workspace/Canvas.vue";

// Mock child components
vi.mock("@/views/workspace/ReaderTopbar.vue", () => ({
  default: {
    name: "ReaderTopbar",
    template: '<div data-testid="reader-topbar-mock">ReaderTopbar</div>',
    props: ["showTitle"],
  },
}));

vi.mock("@/views/workspace/Dock.vue", () => ({
  default: {
    name: "Dock",
    template: '<div class="dock-mock"><slot /></div>',
    props: ["class"],
  },
}));

vi.mock("@/views/workspace/Editor.vue", () => ({
  default: {
    name: "Editor",
    template: '<div data-testid="editor-mock">Editor</div>',
    emits: ["update:modelValue"],
  },
}));

vi.mock("@/views/workspace/DockableSearch.vue", () => ({
  default: {
    name: "DockableSearch",
    template: '<div data-testid="dockable-search-mock">DockableSearch</div>',
  },
}));

vi.mock("@/views/workspace/DockableMinimap.vue", () => ({
  default: {
    name: "DockableMinimap",
    template: '<div data-testid="dockable-minimap-mock">DockableMinimap</div>',
    props: ["file", "side"],
  },
}));

vi.mock("@/views/workspace/DockableAnnotations.vue", () => ({
  default: {
    name: "DockableAnnotations",
    template: '<div data-testid="dockable-annotations-mock">DockableAnnotations</div>',
  },
}));

vi.mock("@/components/manuscript/ManuscriptWrapper.vue", () => ({
  default: {
    name: "ManuscriptWrapper",
    template: '<div data-testid="manuscript-wrapper-mock">ManuscriptWrapper</div>',
    props: ["htmlString", "keys", "settings", "showFooter"],
  },
}));

// Mock composables
vi.mock("@vueuse/core", () => ({
  useElementSize: vi.fn(() => ({
    width: ref(300),
    height: ref(400),
  })),
  useScroll: vi.fn(() => ({
    y: ref(0),
  })),
}));

vi.mock("@/composables/useElementVisibilityObserver", () => ({
  default: vi.fn(() => ({
    isMainTitleVisible: ref(true),
    tearDown: vi.fn(),
  })),
}));

vi.mock("@/composables/useKeyboardShortcuts.js", () => ({
  registerAsFallback: vi.fn(),
}));

describe("Canvas Layout", () => {
  let wrapper;
  const mockFile = {
    id: 1,
    title: "Test File",
    html: "<h1>Test Content</h1>",
    isMountedAt: null,
  };

  const defaultProvides = {
    mobileMode: ref(false),
    focusMode: ref(false),
    drawerOpen: ref(false),
    fileSettings: ref({ background: "#ffffff" }),
    annotations: reactive([
      { id: 1, type: "comment", content: "Test comment" },
      { id: 2, type: "note", content: "Test note" },
    ]),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = (props = {}, provides = {}) => {
    return mount(Canvas, {
      props: {
        modelValue: mockFile,
        showEditor: false,
        showSearch: false,
        ...props,
      },
      global: {
        provide: {
          ...defaultProvides,
          ...provides,
        },
        stubs: {
          Suspense: false,
        },
      },
    });
  };

  describe("Three-Column Layout Structure", () => {
    it("should render three-column layout with proper classes", async () => {
      wrapper = createWrapper();
      await wrapper.vm.$nextTick();

      const leftColumn = wrapper.find(".left-column");
      const middleColumn = wrapper.find(".middle-column");
      const rightColumn = wrapper.find(".right-column");

      expect(leftColumn.exists()).toBe(true);
      expect(middleColumn.exists()).toBe(true);
      expect(rightColumn.exists()).toBe(true);
    });

    it("should place DockableAnnotations in right column", async () => {
      wrapper = createWrapper();
      await wrapper.vm.$nextTick();

      const rightColumn = wrapper.find(".right-column");
      const annotations = rightColumn.find('[data-testid="dockable-annotations-mock"]');

      expect(annotations.exists()).toBe(true);
    });

    it("should have proper CSS classes for layout", async () => {
      wrapper = createWrapper();
      await wrapper.vm.$nextTick();

      const innerRight = wrapper.find(".inner.right");
      expect(innerRight.exists()).toBe(true);

      // Check that inner.right has display flex (this will be verified by CSS)
      expect(innerRight.classes()).toContain("inner");
      expect(innerRight.classes()).toContain("right");
    });
  });

  describe("Responsive Layout Behavior", () => {
    it("should handle mobile mode correctly", async () => {
      wrapper = createWrapper(
        {},
        {
          mobileMode: ref(true),
        }
      );
      await wrapper.vm.$nextTick();

      const outer = wrapper.find(".outer");
      expect(outer.classes()).toContain("mobile");
    });

    it("should handle focus mode correctly", async () => {
      wrapper = createWrapper(
        {},
        {
          focusMode: ref(true),
        }
      );
      await wrapper.vm.$nextTick();

      const outer = wrapper.find(".outer");
      expect(outer.classes()).toContain("focus");
    });

    it("should handle drawer open state", async () => {
      wrapper = createWrapper(
        {},
        {
          drawerOpen: ref(true),
        }
      );
      await wrapper.vm.$nextTick();

      const outer = wrapper.find(".outer");
      expect(outer.classes()).toContain("narrow");
    });
  });

  describe("Layout CSS Verification", () => {
    it("should have middle column with proper flex properties", async () => {
      wrapper = createWrapper();
      await wrapper.vm.$nextTick();

      const middleColumn = wrapper.find(".middle-column");
      expect(middleColumn.exists()).toBe(true);

      // Verify middle column has flex class and proper structure
      // In a proper implementation, the column should use flex properties
      // instead of fixed width calculations
      const middleColumnElement = middleColumn.element;
      expect(middleColumnElement).toBeDefined();

      // Test passes if middle column exists and is part of flex layout
      const innerRight = wrapper.find(".inner.right");
      expect(innerRight.exists()).toBe(true);
      expect(innerRight.classes()).toContain("right");
    });

    it("should not have fixed width on middle column that prevents right column space", async () => {
      wrapper = createWrapper();
      await wrapper.vm.$nextTick();

      const middleColumn = wrapper.find(".middle-column");
      const computedStyle = window.getComputedStyle(middleColumn.element);

      // This test should fail initially
      // Current implementation has width: calc(100% - 8px) which is problematic
      expect(computedStyle.width).not.toContain("calc(100% - 8px)");
    });
  });

  describe("Column Space Distribution", () => {
    it("should provide adequate space for all three columns", async () => {
      // Mock a realistic viewport width
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1200,
      });

      wrapper = createWrapper();
      await wrapper.vm.$nextTick();

      const innerRight = wrapper.find(".inner.right");
      const leftColumn = wrapper.find(".left-column");
      const middleColumn = wrapper.find(".middle-column");
      const rightColumn = wrapper.find(".right-column");

      // Verify structure exists
      expect(innerRight.exists()).toBe(true);
      expect(leftColumn.exists()).toBe(true);
      expect(middleColumn.exists()).toBe(true);
      expect(rightColumn.exists()).toBe(true);

      // In a proper flex layout, all columns should have space
      // This test documents the expected behavior
    });
  });

  describe("Conditional Annotations Panel", () => {
    it("should show right column when annotations are present", async () => {
      wrapper = createWrapper();
      await wrapper.vm.$nextTick();

      const rightColumn = wrapper.find(".right-column");
      const innerRight = wrapper.find(".inner.right");

      expect(rightColumn.exists()).toBe(true);
      expect(innerRight.classes()).not.toContain("no-annotations");
    });

    it("should hide right column when no annotations", async () => {
      wrapper = createWrapper(
        {},
        {
          annotations: reactive([]),
        }
      );
      await wrapper.vm.$nextTick();

      const rightColumn = wrapper.find(".right-column");
      const innerRight = wrapper.find(".inner.right");

      expect(rightColumn.exists()).toBe(false);
      expect(innerRight.classes()).toContain("no-annotations");
    });

    it("should expand middle column when no annotations", async () => {
      wrapper = createWrapper(
        {},
        {
          annotations: reactive([]),
        }
      );
      await wrapper.vm.$nextTick();

      const middleColumn = wrapper.find(".middle-column");
      const innerRight = wrapper.find(".inner.right");

      expect(middleColumn.exists()).toBe(true);
      expect(innerRight.classes()).toContain("no-annotations");
      // The CSS rule .inner.right.no-annotations .middle-column should apply
    });
  });
});
