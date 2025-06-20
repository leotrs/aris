import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import WorkspaceView from "@/views/workspace/View.vue";
import { File } from "@/models/File.js";
import * as KSMod from "@/composables/useKeyboardShortcuts.js";

const pushMock = vi.fn();
vi.mock("vue-router", () => ({
  useRoute: () => ({ params: { file_id: "42" } }),
  useRouter: () => ({ push: pushMock }),
}));

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("WorkspaceView", () => {
  let getSettingsSpy;
  let useKSSpy;
  let fileStore;
  const api = { post: vi.fn() };

  beforeEach(() => {
    getSettingsSpy = vi.spyOn(File, "getSettings").mockResolvedValue({ theme: "dark" });
    useKSSpy = vi.spyOn(KSMod, "useKeyboardShortcuts").mockImplementation(() => {});
    fileStore = { value: { files: [{ id: "42", content: "abc" }] } };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders Sidebar and Canvas with correct initial props and classes", () => {
    const wrapper = mount(WorkspaceView, {
      global: {
        provide: { fileStore, api, mobileMode: false },
        stubs: {
          Sidebar: { name: "Sidebar", template: "<div />" },
          Canvas: {
            name: "Canvas",
            props: ["modelValue", "showEditor", "showSearch"],
            template: '<div class="canvas-stub" />',
          },
          Button: { name: "Button", template: "<button />" },
        },
      },
    });
    const view = wrapper.find(".view");
    expect(view.exists()).toBe(true);
    expect(view.classes()).not.toContain("mobile");
    expect(view.classes()).not.toContain("focus");

    const sidebar = wrapper.findComponent({ name: "Sidebar" });
    expect(sidebar.exists()).toBe(true);

    const canvas = wrapper.findComponent({ name: "Canvas" });
    expect(canvas.exists()).toBe(true);
    expect(canvas.props("modelValue")).toEqual(wrapper.vm.file);
    expect(canvas.props("showEditor")).toBe(false);
    expect(canvas.props("showSearch")).toBe(false);
  });

  it("fetches file settings on mount and updates fileSettings", async () => {
    const wrapper = mount(WorkspaceView, {
      global: {
        provide: { fileStore, api, mobileMode: false },
        stubs: { Sidebar: true, Canvas: true, Button: true },
      },
    });
    await nextTick();
    await flushPromises();
    expect(getSettingsSpy).toHaveBeenCalledWith(wrapper.vm.file, api);
    expect(wrapper.vm.fileSettings).toEqual({ theme: "dark" });
  });

  it("toggles showEditor and showSearch when Sidebar emits events", async () => {
    const wrapper = mount(WorkspaceView, {
      global: {
        provide: { fileStore, api, mobileMode: false },
        stubs: {
          Sidebar: {
            name: "Sidebar",
            template: "<div />",
            emits: ["show-component", "hide-component"],
          },
          Canvas: { name: "Canvas", template: "<div />", props: ["showEditor", "showSearch"] },
          Button: true,
        },
      },
    });
    expect(wrapper.vm.showEditor).toBe(false);
    wrapper.findComponent({ name: "Sidebar" }).vm.$emit("show-component", "DockableEditor");
    await nextTick();
    expect(wrapper.vm.showEditor).toBe(true);

    wrapper.findComponent({ name: "Sidebar" }).vm.$emit("hide-component", "DockableEditor");
    await nextTick();
    expect(wrapper.vm.showEditor).toBe(false);

    expect(wrapper.vm.showSearch).toBe(false);
    wrapper.findComponent({ name: "Sidebar" }).vm.$emit("show-component", "DockableSearch");
    await nextTick();
    expect(wrapper.vm.showSearch).toBe(true);
  });

  it("computes sidebarWidth based on drawerOpen", async () => {
    const wrapper = mount(WorkspaceView, {
      global: {
        provide: { fileStore, api, mobileMode: false },
        stubs: { Sidebar: true, Canvas: true, Button: true },
      },
    });
    expect(wrapper.vm.drawerOpen).toBe(false);
    expect(wrapper.vm.sidebarWidth).toBe("64px");
    wrapper.vm.drawerOpen = true;
    await nextTick();
    expect(wrapper.vm.sidebarWidth).toBe("360px");
  });

  it("registers keyboard shortcuts for goHome and toggle focusMode", () => {
    mount(WorkspaceView, {
      global: {
        provide: { fileStore, api, mobileMode: false },
        stubs: { Sidebar: true, Canvas: true, Button: true },
      },
    });
    expect(useKSSpy).toHaveBeenCalledWith({
      "g,h": expect.any(Function),
      c: expect.any(Function),
    });
  });

  it("invokes goHome and toggle focusMode via shortcuts", () => {
    let shortcutsConfig;
    useKSSpy.mockImplementation((config) => {
      shortcutsConfig = config;
    });
    const wrapper = mount(WorkspaceView, {
      global: {
        provide: { fileStore, api, mobileMode: true },
        stubs: {
          Sidebar: true,
          Canvas: true,
          Button: { name: "Button", template: "<button @click=\"$emit('click')\" />" },
        },
      },
    });
    shortcutsConfig["g,h"]();
    expect(pushMock).toHaveBeenCalledWith("/");
    expect(wrapper.vm.focusMode).toBe(false);
    shortcutsConfig.c();
    expect(wrapper.vm.focusMode).toBe(true);
  });

  it("handles mobileMode: root gets mobile class", async () => {
    const wrapper = mount(WorkspaceView, {
      global: {
        provide: { fileStore, api, mobileMode: true },
        stubs: {
          Sidebar: true,
          Canvas: true,
          Button: { name: "Button", template: "<button @click=\"$emit('click')\" />" },
        },
      },
    });
    const view = wrapper.find(".view");
    expect(view.classes()).toContain("mobile");
  });

  it("does not render mobile Button when mobileMode is false", () => {
    const wrapper = mount(WorkspaceView, {
      global: {
        provide: { fileStore, api, mobileMode: false },
        stubs: { Sidebar: true, Canvas: true, Button: true },
      },
    });
    expect(wrapper.findComponent({ name: "Button" }).exists()).toBe(false);
  });

  it("redirects to 404 when file not found", () => {
    pushMock.mockClear();
    const emptyStore = { value: { files: [] } };
    mount(WorkspaceView, {
      global: {
        provide: { fileStore: emptyStore, api, mobileMode: false },
        stubs: { Sidebar: true, Canvas: true, Button: true },
      },
    });
    expect(pushMock).toHaveBeenCalledWith({ name: "NotFound" });
  });
});
