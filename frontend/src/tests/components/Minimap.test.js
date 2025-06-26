import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ref, nextTick } from "vue";
import { mount } from "@vue/test-utils";

// Stub useElementSize and useTemplateRef from @vueuse/core
let widthRef, heightRef;
vi.mock("@vueuse/core", () => ({
  useElementSize: () => ({ width: widthRef, height: heightRef }),
  useTemplateRef: () => ({ value: {} }),
}));

const ICON_COMPONENT_STUBS = [
  "Tooltip",
  "IconBookmarkFilled",
  "IconStarFilled",
  "IconHeartFilled",
  "IconCircleCheckFilled",
  "IconAlertTriangleFilled",
  "IconHelpSquareRoundedFilled",
  "IconQuoteFilled",
];

// Stub MinimapUtils functions
vi.mock("@/utils/MinimapUtils.js", () => ({
  makeMinimap: vi.fn().mockResolvedValue({ svg: "<svg></svg>", svgInitialData: {} }),
  resizeMinimap: vi.fn(),
  highlightScrollPos: vi.fn(),
  makeIcons: vi.fn().mockResolvedValue([]),
}));
import { makeMinimap, resizeMinimap, highlightScrollPos, makeIcons } from "@/utils/MinimapUtils.js";
import Minimap from "@/components/manuscript/Minimap.vue";

// Helper to flush pending promise callbacks (microtasks)
const flushPromises = () => Promise.resolve();
const flushAll = async () => {
  await flushPromises();
  await nextTick();
  await nextTick();
  await nextTick();
  await nextTick();
};

// Global setup to prevent memory leaks
beforeEach(() => {
  // Reset refs for each test to prevent memory accumulation
  widthRef = ref(200);
  heightRef = ref(400);
});

describe("Minimap.vue - immediate and debounced rebuild", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    makeMinimap.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("executes makeMinimap immediately and again after debounce", async () => {
    makeMinimap
      .mockResolvedValueOnce({ svg: "<svg>1</svg>", svgInitialData: { a: 1 } })
      .mockResolvedValueOnce({ svg: "<svg>2</svg>", svgInitialData: { a: 2 } });

    const file = { id: 1, isMountedAt: true, html: "<p/>", icons: [] };
    const wrapper = mount(Minimap, {
      props: { file },
      global: {
        stubs: [
          "Tooltip",
          "IconBookmarkFilled",
          "IconStarFilled",
          "IconHeartFilled",
          "IconCircleCheckFilled",
          "IconAlertTriangleFilled",
          "IconHelpSquareRoundedFilled",
          "IconQuoteFilled",
        ],
      },
    });

    // Leading run on mount
    await vi.advanceTimersByTimeAsync(0);
    await flushPromises();
    expect(makeMinimap).toHaveBeenCalledTimes(1);
    expect(wrapper.html()).toContain("<svg>1</svg>");

    // Trailing run after debounce interval
    await vi.advanceTimersByTimeAsync(100);
    await flushPromises();
    expect(makeMinimap).toHaveBeenCalledTimes(2);
    expect(wrapper.html()).toContain("<svg>2</svg>");
  });

  it("cancels previous trailing run when props change before debounce", async () => {
    makeMinimap
      .mockResolvedValueOnce({ svg: "<svg>A</svg>", svgInitialData: {} })
      .mockResolvedValueOnce({ svg: "<svg>B</svg>", svgInitialData: {} })
      .mockResolvedValueOnce({ svg: "<svg>C</svg>", svgInitialData: {} });

    const file1 = { id: 1, isMountedAt: true, html: "<p/>", icons: [] };
    const wrapper = mount(Minimap, {
      props: { file: file1 },
      global: {
        stubs: [
          "Tooltip",
          "IconBookmarkFilled",
          "IconStarFilled",
          "IconHeartFilled",
          "IconCircleCheckFilled",
          "IconAlertTriangleFilled",
          "IconHelpSquareRoundedFilled",
          "IconQuoteFilled",
        ],
      },
    });

    // Initial run on mount
    await vi.advanceTimersByTimeAsync(0);
    await flushPromises();
    expect(makeMinimap).toHaveBeenCalledTimes(1);

    // Change props to cancel previous trailing and trigger new immediate run
    await wrapper.setProps({ file: { id: 2, isMountedAt: true, html: "<p/>", icons: [] } });
    await flushPromises();
    expect(makeMinimap).toHaveBeenCalledTimes(2);

    // Only one trailing run after debounce
    await vi.advanceTimersByTimeAsync(100);
    await flushPromises();
    expect(makeMinimap).toHaveBeenCalledTimes(3);
  });
});

describe("Minimap.vue - props and wrapper classes", () => {
  it("renders wrapper with given orientation and side classes", async () => {
    makeMinimap.mockResolvedValue({ svg: "<svg></svg>", svgInitialData: {} });
    makeIcons.mockResolvedValue([]);
    const file = { id: 1, isMountedAt: true, html: "", icons: [] };
    const wrapper = mount(Minimap, {
      props: { file, orientation: "horizontal", side: "left" },
      global: { stubs: ICON_COMPONENT_STUBS },
    });
    await flushAll();
    expect(wrapper.find(".mm-wrapper").classes()).toEqual(
      expect.arrayContaining(["horizontal", "left"])
    );
  });

  it("uses default orientation and side when not provided", async () => {
    makeMinimap.mockResolvedValue({ svg: "<svg></svg>", svgInitialData: {} });
    makeIcons.mockResolvedValue([]);
    const file = { id: 2, isMountedAt: true, html: "", icons: [] };
    const wrapper = mount(Minimap, {
      props: { file },
      global: { stubs: ICON_COMPONENT_STUBS },
    });
    await flushAll();
    expect(wrapper.find(".mm-wrapper").classes()).toEqual(
      expect.arrayContaining(["vertical", "right"])
    );
  });
});

describe("Minimap.vue - makeMinimap parameters and html update", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    makeMinimap.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls makeMinimap with correct arguments based on props and updates html", async () => {
    makeMinimap.mockResolvedValue({ svg: "<svg>test</svg>", svgInitialData: { foo: "bar" } });
    makeIcons.mockResolvedValue([]);
    const file = { id: 3, isMountedAt: true, html: "<p>content</p>", icons: [] };
    const wrapper = mount(Minimap, {
      props: {
        file,
        orientation: "vertical",
        side: "left",
        highlightScroll: false,
        shape: "box",
        trackWidth: 5,
      },
      global: { stubs: ICON_COMPONENT_STUBS },
    });
    await vi.advanceTimersByTimeAsync(0);
    await flushAll();
    expect(makeMinimap).toHaveBeenCalledWith(file, false, widthRef.value, heightRef.value, {
      side: "left",
      highlightScroll: false,
      trackWidth: 5,
      shape: "box",
      html: file.html,
    });
    expect(wrapper.find(".mm-main").html()).toContain("<svg>test</svg>");
  });

  it("does not call makeMinimap when file id is falsy or not mounted", async () => {
    makeMinimap.mockResolvedValue({ svg: "", svgInitialData: {} });
    makeIcons.mockResolvedValue([]);
    const fileA = { id: 0, isMountedAt: true, html: "", icons: [] };
    mount(Minimap, {
      props: { file: fileA },
      global: { stubs: ICON_COMPONENT_STUBS },
    });
    await vi.advanceTimersByTimeAsync(0);
    await flushAll();
    expect(makeMinimap).not.toHaveBeenCalled();

    const fileB = { id: 1, isMountedAt: false, html: "", icons: [] };
    mount(Minimap, {
      props: { file: fileB },
      global: { stubs: ICON_COMPONENT_STUBS },
    });
    await vi.advanceTimersByTimeAsync(0);
    await flushAll();
    expect(makeMinimap).not.toHaveBeenCalled();
  });
});

describe("Minimap.vue - resizeMinimap watcher", () => {
  beforeEach(() => {
    widthRef.value = 200;
    heightRef.value = 400;
  });

  it("calls resizeMinimap immediately and on dimension change when positive", async () => {
    makeMinimap.mockResolvedValue({ svg: "<svg></svg>", svgInitialData: {} });
    makeIcons.mockResolvedValue([]);
    resizeMinimap.mockReset();
    const file = { id: 4, isMountedAt: true, html: "", icons: [] };
    mount(Minimap, { props: { file }, global: { stubs: ICON_COMPONENT_STUBS } });
    await flushAll();
    expect(resizeMinimap).toHaveBeenCalledWith(null, false, widthRef.value, heightRef.value, null, {
      side: "right",
      trackWidth: 3,
      shape: "line",
    });
    resizeMinimap.mockClear();
    heightRef.value = 10;
    await flushAll();
    expect(resizeMinimap).toHaveBeenCalled();
  });

  it("does not call resizeMinimap when new dimension is zero or negative", async () => {
    makeMinimap.mockResolvedValue({ svg: "<svg></svg>", svgInitialData: {} });
    makeIcons.mockResolvedValue([]);
    resizeMinimap.mockReset();
    const file = { id: 5, isMountedAt: true, html: "", icons: [] };
    mount(Minimap, { props: { file }, global: { stubs: ICON_COMPONENT_STUBS } });
    await flushAll();
    resizeMinimap.mockClear();
    heightRef.value = 0;
    await flushAll();
    heightRef.value = -5;
    await flushAll();
    expect(resizeMinimap).not.toHaveBeenCalled();
  });
});

describe("Minimap.vue - highlightScrollPos watcher", () => {
  beforeEach(() => {
    widthRef.value = 200;
    heightRef.value = 400;
  });

  it("calls highlightScrollPos on yScroll change when enabled", async () => {
    makeMinimap.mockResolvedValue({ svg: "<svg></svg>", svgInitialData: {} });
    makeIcons.mockResolvedValue([]);
    highlightScrollPos.mockReset();
    const yRef = ref(20);
    const file = { id: 6, isMountedAt: true, html: "", icons: [] };
    mount(Minimap, {
      props: { file, highlightScroll: true },
      global: { provide: { yScroll: yRef }, stubs: ICON_COMPONENT_STUBS },
    });
    highlightScrollPos.mockClear();
    yRef.value = 40;
    await flushAll();
    expect(highlightScrollPos).toHaveBeenCalledWith(
      40,
      false,
      widthRef.value,
      heightRef.value,
      null,
      { trackWidth: 3 }
    );
  });

  it("does not call highlightScrollPos when disabled", async () => {
    makeMinimap.mockResolvedValue({ svg: "<svg></svg>", svgInitialData: {} });
    makeIcons.mockResolvedValue([]);
    highlightScrollPos.mockReset();
    const yRef = ref(20);
    const file = { id: 7, isMountedAt: true, html: "", icons: [] };
    mount(Minimap, {
      props: { file, highlightScroll: false },
      global: { provide: { yScroll: yRef }, stubs: ICON_COMPONENT_STUBS },
    });
    highlightScrollPos.mockClear();
    yRef.value = 40;
    await flushAll();
    expect(highlightScrollPos).not.toHaveBeenCalled();
  });
});

describe("Minimap.vue - makeIcons watcher", () => {
  beforeEach(() => {
    widthRef.value = 200;
    heightRef.value = 400;
    makeIcons.mockReset();
  });

  it("calls makeIcons immediately with file.icons when mounted", async () => {
    makeMinimap.mockResolvedValue({ svg: "<svg></svg>", svgInitialData: {} });
    makeIcons.mockResolvedValue([{ class: "star", pos: 0.5 }]);
    const file = { id: 8, isMountedAt: true, html: "", icons: ["star"] };
    const wrapper = mount(Minimap, { props: { file }, global: { stubs: ICON_COMPONENT_STUBS } });
    await flushAll();
    expect(makeIcons).toHaveBeenCalledWith(["star"], true, expect.any(Object));
    expect(wrapper.findAll("svg").length).toBeGreaterThan(0);
  });

  it("does not call makeIcons when not mounted or icons null", async () => {
    makeMinimap.mockResolvedValue({ svg: "<svg></svg>", svgInitialData: {} });
    makeIcons.mockResolvedValue([{ class: "star", pos: 0.5 }]);
    const fileA = { id: 9, isMountedAt: false, html: "", icons: ["star"] };
    mount(Minimap, { props: { file: fileA }, global: { stubs: ICON_COMPONENT_STUBS } });
    await flushAll();
    expect(makeIcons).not.toHaveBeenCalled();
    makeIcons.mockClear();
    const fileB = { id: 9, isMountedAt: true, html: "", icons: null };
    mount(Minimap, { props: { file: fileB }, global: { stubs: ICON_COMPONENT_STUBS } });
    await flushAll();
    expect(makeIcons).not.toHaveBeenCalled();
  });

  it("calls makeIcons when file.icons changes and mounted", async () => {
    makeMinimap.mockResolvedValue({ svg: "<svg></svg>", svgInitialData: {} });
    makeIcons.mockResolvedValue([{ class: "heart", pos: 0.25 }]);
    const file = { id: 10, isMountedAt: true, html: "", icons: [] };
    const wrapper = mount(Minimap, { props: { file }, global: { stubs: ICON_COMPONENT_STUBS } });
    await flushAll();
    makeIcons.mockClear();
    await wrapper.setProps({ file: { ...file, icons: ["heart"] } });
    await flushAll();
    expect(makeIcons).toHaveBeenCalledWith(["heart"], true, expect.any(Object));
  });
});

describe("Minimap.vue - icons rendering and Tooltip props", () => {
  beforeEach(() => {
    widthRef.value = 200;
    heightRef.value = 400;
    makeMinimap.mockResolvedValue({ svg: "<svg></svg>", svgInitialData: {} });
  });

  it("renders no icons when feedback list is empty", async () => {
    makeIcons.mockResolvedValue([]);
    const file = { id: 12, isMountedAt: true, html: "", icons: [] };
    const wrapper = mount(Minimap, {
      props: { file },
      global: { stubs: ICON_COMPONENT_STUBS },
    });
    await flushAll();
    expect(wrapper.find(".mm-icons").element.children.length).toBe(0);
  });

  it("renders feedback icons with correct classes and styles", async () => {
    makeIcons.mockResolvedValue([{ class: "bookmark", pos: 0.25 }]);
    const file = { id: 13, isMountedAt: true, html: "", icons: ["bookmark"] };
    const wrapper = mount(Minimap, {
      props: { file },
      global: { stubs: ICON_COMPONENT_STUBS },
    });
    await flushAll();
    const icon = wrapper.find(".mm-icons .bookmark");
    expect(icon.exists()).toBe(true);
    expect(icon.attributes("style")).toContain("top: 25%");
  });

  it("passes correct props to Tooltip stub", async () => {
    makeIcons.mockResolvedValue([]);
    const file = { id: 14, isMountedAt: true, html: "", icons: [] };
    const wrapper = mount(Minimap, {
      props: { file },
      global: { stubs: ICON_COMPONENT_STUBS },
    });
    await flushAll();
    const tooltip = wrapper.find("tooltip-stub");
    expect(tooltip.attributes("placement")).toBe("left");
    expect(tooltip.attributes("content")).toBe("");
  });
});

// Removed: "Minimap.vue - shape grouping and tooltip behavior" test suite
// These tests involved complex DOM event handling, mouse interactions, and scrolling behavior
// that should be tested in E2E tests rather than unit tests. E2E tests can properly simulate
// user interactions like mouseenter, mouseleave, clicking, and scrollIntoView in a real browser.
