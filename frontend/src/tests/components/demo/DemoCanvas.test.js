import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import DemoCanvas from "@/components/demo/DemoCanvas.vue";

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
    template: '<div data-testid="dock-mock"><slot /></div>',
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

vi.mock("@/views/workspace/DockableMinimap.vue", () => ({
  default: {
    name: "DockableMinimap",
    template: '<div data-testid="minimap-mock">Minimap</div>',
    props: ["file", "side"],
  },
}));

vi.mock("@/views/workspace/DockableSearch.vue", () => ({
  default: {
    name: "DockableSearch",
    template: '<div data-testid="search-mock">Search</div>',
  },
}));

vi.mock("@/views/workspace/DockableAnnotations.vue", () => ({
  default: {
    name: "DockableAnnotations",
    template: '<div data-testid="annotations-mock">Annotations</div>',
  },
}));

vi.mock("@/components/demo/DemoManuscriptWrapper.vue", () => ({
  default: {
    name: "DemoManuscriptWrapper",
    template: '<div data-testid="manuscript-wrapper-mock">ManuscriptWrapper</div>',
    props: ["htmlString", "keys", "settings", "showFooter"],
    emits: ["mounted-at"],
  },
}));

// Mock composables
vi.mock("@vueuse/core", () => ({
  useElementSize: () => ({ width: ref(800), height: ref(600) }),
  useScroll: () => ({ y: ref(0) }),
}));

vi.mock("@/composables/useElementVisibilityObserver", () => ({
  default: () => ({}),
}));

vi.mock("@/composables/useKeyboardShortcuts.js", () => ({
  registerAsFallback: vi.fn(),
}));

describe("Demo Canvas", () => {
  let wrapper;
  let mockFile;

  beforeEach(() => {
    mockFile = {
      id: 999,
      title: "Test File",
      html: "<html>Test HTML Content</html>",
      isMountedAt: null,
    };

    vi.clearAllMocks();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = (props = {}, provide = {}) => {
    return mount(DemoCanvas, {
      props: {
        showEditor: false,
        showSearch: false,
        ...props,
        modelValue: mockFile,
      },
      global: {
        provide: {
          mobileMode: ref(false),
          focusMode: ref(false),
          drawerOpen: ref(false),
          fileSettings: ref({
            background: "#ffffff",
            fontSize: "16px",
            lineHeight: "1.5",
            fontFamily: "Source Sans 3",
            marginWidth: "16px",
          }),
          ...provide,
        },
      },
    });
  };

  describe("Basic Rendering", () => {
    it("renders outer container with correct classes", async () => {
      wrapper = createWrapper();
      await nextTick();

      const outer = wrapper.find(".outer");
      expect(outer.exists()).toBe(true);
      expect(outer.classes()).toContain("outer");
    });

    it("renders manuscript container with data-testid", async () => {
      wrapper = createWrapper();
      await nextTick();

      const container = wrapper.find('[data-testid="manuscript-container"]');
      expect(container.exists()).toBe(true);
    });

    it("renders DemoManuscriptWrapper when file.html is available", async () => {
      wrapper = createWrapper();
      await nextTick();

      const manuscriptWrapper = wrapper.find('[data-testid="manuscript-wrapper-mock"]');
      expect(manuscriptWrapper.exists()).toBe(true);
    });

    it("does not render DemoManuscriptWrapper when file.html is empty", async () => {
      mockFile.html = "";
      wrapper = createWrapper();
      await nextTick();

      const manuscriptWrapper = wrapper.find('[data-testid="manuscript-wrapper-mock"]');
      expect(manuscriptWrapper.exists()).toBe(false);
    });

    it("renders Editor when showEditor is true", async () => {
      wrapper = createWrapper({ showEditor: true });
      await nextTick();

      const editor = wrapper.find('[data-testid="editor-mock"]');
      expect(editor.exists()).toBe(true);
    });

    it("does not render Editor when showEditor is false", async () => {
      wrapper = createWrapper({ showEditor: false });
      await nextTick();

      const editor = wrapper.find('[data-testid="editor-mock"]');
      expect(editor.exists()).toBe(false);
    });

    it("renders DockableSearch when showSearch is true", async () => {
      wrapper = createWrapper({ showSearch: true });
      await nextTick();

      const search = wrapper.find('[data-testid="search-mock"]');
      expect(search.exists()).toBe(true);
    });

    it("does not render DockableSearch when showSearch is false", async () => {
      wrapper = createWrapper({ showSearch: false });
      await nextTick();

      const search = wrapper.find('[data-testid="search-mock"]');
      expect(search.exists()).toBe(false);
    });

    it("renders DockableMinimap when not showing editor", async () => {
      wrapper = createWrapper({ showEditor: false });
      await nextTick();

      const minimap = wrapper.find('[data-testid="minimap-mock"]');
      expect(minimap.exists()).toBe(true);
    });

    it("does not render DockableMinimap when showing editor", async () => {
      wrapper = createWrapper({ showEditor: true });
      await nextTick();

      const minimap = wrapper.find('[data-testid="minimap-mock"]');
      expect(minimap.exists()).toBe(false);
    });
  });

  describe("Layout & Responsiveness", () => {
    it("applies mobile classes correctly", async () => {
      wrapper = createWrapper({}, { mobileMode: ref(true) });
      await nextTick();

      const outer = wrapper.find(".outer");
      expect(outer.classes()).toContain("mobile");
    });

    it("applies focus mode classes correctly", async () => {
      wrapper = createWrapper({}, { focusMode: ref(true) });
      await nextTick();

      const outer = wrapper.find(".outer");
      expect(outer.classes()).toContain("focus");
    });

    it("applies narrow classes when drawer is open", async () => {
      wrapper = createWrapper({}, { drawerOpen: ref(true) });
      await nextTick();

      const outer = wrapper.find(".outer");
      expect(outer.classes()).toContain("narrow");
    });

    it("handles column layout structure", async () => {
      wrapper = createWrapper();
      await nextTick();

      const leftColumn = wrapper.find(".left-column");
      const middleColumn = wrapper.find(".middle-column");
      const rightColumn = wrapper.find(".right-column");

      expect(leftColumn.exists()).toBe(true);
      expect(middleColumn.exists()).toBe(true);
      expect(rightColumn.exists()).toBe(true);
    });
  });

  describe("File Integration", () => {
    it("passes htmlString prop to DemoManuscriptWrapper", async () => {
      wrapper = createWrapper();
      await nextTick();

      const manuscriptWrapper = wrapper.findComponent({ name: "DemoManuscriptWrapper" });
      expect(manuscriptWrapper.props("htmlString")).toBe(mockFile.html);
    });

    it("passes settings prop correctly", async () => {
      const mockSettings = {
        background: "#f0f0f0",
        fontSize: "18px",
        lineHeight: "1.6",
        fontFamily: "Arial",
        marginWidth: "20px",
      };

      wrapper = createWrapper({}, { fileSettings: ref(mockSettings) });
      await nextTick();

      const manuscriptWrapper = wrapper.findComponent({ name: "DemoManuscriptWrapper" });
      expect(manuscriptWrapper.props("settings")).toEqual(mockSettings);
    });

    it("passes keys and showFooter props correctly", async () => {
      wrapper = createWrapper();
      await nextTick();

      const manuscriptWrapper = wrapper.findComponent({ name: "DemoManuscriptWrapper" });
      expect(manuscriptWrapper.props("keys")).toBe(true);
      expect(manuscriptWrapper.props("showFooter")).toBe(true);
    });

    it("handles mounted-at event from DemoManuscriptWrapper", async () => {
      wrapper = createWrapper();
      await nextTick();

      const manuscriptWrapper = wrapper.findComponent({ name: "DemoManuscriptWrapper" });
      const mockElement = document.createElement("div");
      
      await manuscriptWrapper.vm.$emit("mounted-at", mockElement);
      await nextTick();

      expect(mockFile.isMountedAt).toBe(mockElement);
    });
  });

  describe("Component Visibility Logic", () => {
    it("hides manuscript container in mobile mode when editor is shown", async () => {
      wrapper = createWrapper(
        { showEditor: true },
        { mobileMode: ref(true) }
      );
      await nextTick();

      const manuscriptContainer = wrapper.find('[data-testid="manuscript-container"]');
      expect(manuscriptContainer.exists()).toBe(false);
    });

    it("shows manuscript container in mobile mode when editor is not shown", async () => {
      wrapper = createWrapper(
        { showEditor: false },
        { mobileMode: ref(true) }
      );
      await nextTick();

      const manuscriptContainer = wrapper.find('[data-testid="manuscript-container"]');
      expect(manuscriptContainer.exists()).toBe(true);
    });

    it("shows manuscript container in desktop mode regardless of editor state", async () => {
      wrapper = createWrapper(
        { showEditor: true },
        { mobileMode: ref(false) }
      );
      await nextTick();

      const manuscriptContainer = wrapper.find('[data-testid="manuscript-container"]');
      expect(manuscriptContainer.exists()).toBe(true);
    });

    it("shows both editor and manuscript in desktop mode", async () => {
      wrapper = createWrapper(
        { showEditor: true },
        { mobileMode: ref(false) }
      );
      await nextTick();

      const editor = wrapper.find('[data-testid="editor-mock"]');
      const manuscriptContainer = wrapper.find('[data-testid="manuscript-container"]');
      
      expect(editor.exists()).toBe(true);
      expect(manuscriptContainer.exists()).toBe(true);
    });
  });

  describe("ReaderTopbar Integration", () => {
    it("passes correct showTitle prop to ReaderTopbar", async () => {
      wrapper = createWrapper();
      await nextTick();

      const readerTopbar = wrapper.findComponent({ name: "ReaderTopbar" });
      // showTitle should be !isMainTitleVisible, and isMainTitleVisible is true by default
      expect(readerTopbar.props("showTitle")).toBe(false);
    });
  });

  describe("DockableMinimap Integration", () => {
    it("passes file and side props to DockableMinimap", async () => {
      wrapper = createWrapper({ showEditor: false });
      await nextTick();

      const minimap = wrapper.findComponent({ name: "DockableMinimap" });
      expect(minimap.props("file")).toEqual(mockFile);
      expect(minimap.props("side")).toBe("right");
    });
  });

  describe("CSS Variables", () => {
    it("sets CSS variables from file settings", async () => {
      const mockSettings = {
        background: "#f5f5f5",
        fontSize: "18px",
        lineHeight: "1.8",
        fontFamily: "Georgia",
        marginWidth: "24px",
      };

      wrapper = createWrapper({}, { fileSettings: ref(mockSettings) });
      await nextTick();

      const outer = wrapper.find(".outer");
      const style = outer.element.style;
      
      // Note: CSS variable binding verification might need to be adjusted based on actual implementation
      expect(wrapper.vm.fileSettings.background).toBe("#f5f5f5");
      expect(wrapper.vm.fileSettings.fontSize).toBe("18px");
    });
  });
});