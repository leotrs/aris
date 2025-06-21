import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

describe("Tooltip.vue", () => {
  let useFloatingStub, offsetStub, flipStub, shiftStub, autoUpdateStub;

  beforeEach(() => {
    vi.resetModules();
    useFloatingStub = vi.fn(() => ({ floatingStyles: { left: "10px", top: "20px" } }));
    offsetStub = vi.fn(() => "offset-token");
    flipStub = vi.fn(() => "flip-token");
    shiftStub = vi.fn(() => "shift-token");
    autoUpdateStub = Symbol("autoUpdate");
    vi.doMock("@floating-ui/vue", () => ({
      useFloating: useFloatingStub,
      offset: offsetStub,
      flip: flipStub,
      shift: shiftStub,
      autoUpdate: autoUpdateStub,
    }));
  });

  it("initializes floating UI with correct options", async () => {
    const { default: Tooltip } = await import("@/components/base/Tooltip.vue");
    const anchor = document.createElement("div");
    anchor.matches = vi.fn(() => false);
    mount(Tooltip, {
      props: { anchor, content: "Hello", placement: "top" },
      global: { stubs: { Teleport: { template: "<div><slot/></div>" } } },
    });
    expect(offsetStub).toHaveBeenCalledWith(4);
    expect(flipStub).toHaveBeenCalled();
    expect(shiftStub).toHaveBeenCalled();
    expect(useFloatingStub).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
      middleware: ["offset-token", "flip-token", "shift-token"],
      placement: "top",
      strategy: "fixed",
      whileElementsMounted: autoUpdateStub,
    });
  });

  it("renders default slot over content prop", async () => {
    const { default: Tooltip } = await import("@/components/base/Tooltip.vue");
    const anchor = document.createElement("div");
    anchor.matches = vi.fn(() => false);
    const wrapper = mount(Tooltip, {
      props: { anchor, content: "Prop content" },
      slots: { default: "Slot content" },
      global: { stubs: { Teleport: { template: "<div><slot/></div>" } } },
    });
    await nextTick();
    expect(wrapper.text()).toContain("Slot content");
    expect(wrapper.text()).not.toContain("Prop content");
  });

  it("registers hover event listeners on anchor", async () => {
    const { default: Tooltip } = await import("@/components/base/Tooltip.vue");
    const anchor = document.createElement("div");
    anchor.matches = vi.fn(() => false);
    anchor.addEventListener = vi.fn();
    anchor.removeEventListener = vi.fn();
    mount(Tooltip, {
      props: { anchor, content: "Info" },
      global: { stubs: { Teleport: { template: "<div><slot/></div>" } } },
    });
    expect(anchor.addEventListener).toHaveBeenCalledWith("mouseenter", expect.any(Function));
    expect(anchor.addEventListener).toHaveBeenCalledWith("mouseleave", expect.any(Function));
  });

  it("shows tooltip initially if anchor matches :hover", async () => {
    const { default: Tooltip } = await import("@/components/base/Tooltip.vue");
    const anchor = document.createElement("div");
    anchor.matches = vi.fn(() => true);
    const wrapper = mount(Tooltip, {
      props: { anchor, content: "Init" },
      global: { stubs: { Teleport: { template: "<div><slot/></div>" } } },
    });
    await nextTick();
    const tip = wrapper.get("div.tooltip");
    expect(tip.element.style.opacity).toBe("1");
    expect(tip.element.style.visibility).toBe("visible");
  });

  it("does not render when anchor is null", async () => {
    const { default: Tooltip } = await import("@/components/base/Tooltip.vue");
    const wrapper = mount(Tooltip, {
      props: { anchor: null },
      global: { stubs: { Teleport: { template: "<div><slot/></div>" } } },
    });
    expect(wrapper.find("div.tooltip").exists()).toBe(false);
  });
});
