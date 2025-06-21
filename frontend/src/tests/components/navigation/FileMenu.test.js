import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import FileMenu from "@/components/navigation/FileMenu.vue";

describe("FileMenu.vue - Isolated Testing", () => {
  let mockProvides;

  beforeEach(() => {
    mockProvides = {
      mobileMode: ref(false),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render FileMenu component with dots trigger", () => {
    const wrapper = mount(FileMenu, {
      global: {
        provide: mockProvides,
      },
    });

    console.log("FileMenu HTML:", wrapper.html());

    const fmWrapper = wrapper.find(".fm-wrapper");
    console.log("fm-wrapper exists:", fmWrapper.exists());

    expect(fmWrapper.exists()).toBe(true);
  });

  it("should contain ContextMenu component", () => {
    const wrapper = mount(FileMenu, {
      global: {
        provide: mockProvides,
      },
    });

    const contextMenu = wrapper.findComponent({ name: "ContextMenu" });
    console.log("ContextMenu exists:", contextMenu.exists());

    expect(contextMenu.exists()).toBe(true);
  });
});
