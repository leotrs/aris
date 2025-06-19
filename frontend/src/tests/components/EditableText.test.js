import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

describe("EditableText.vue", () => {
  let activateMock;
  let deactivateMock;

  beforeEach(() => {
    vi.resetModules();
    activateMock = vi.fn();
    deactivateMock = vi.fn();
    vi.doMock("@/composables/useKeyboardShortcuts.js", () => ({
      useKeyboardShortcuts: () => ({
        activate: activateMock,
        deactivate: deactivateMock,
      }),
    }));
  });

  it("renders the text and enters editing mode on click", async () => {
    const { default: EditableText } = await import("@/components/EditableText.vue");
    const wrapper = mount(EditableText, {
      props: { modelValue: "Hello World" },
    });

    const display = wrapper.get(".editable");
    expect(display.text()).toBe("Hello World");

    await display.trigger("click");
    await nextTick();

    const input = wrapper.get("input");
    expect(input.element.value).toBe("Hello World");
    expect(activateMock).toHaveBeenCalled();
  });

  it("starts editing on Enter and Space keydown events", async () => {
    const { default: EditableText } = await import("@/components/EditableText.vue");
    const wrapper = mount(EditableText, {
      props: { modelValue: "Key Test" },
    });
    const display = wrapper.get(".editable");

    await display.trigger("keydown.enter");
    await nextTick();
    expect(wrapper.find("input").exists()).toBe(true);

    // reset state
    wrapper.vm.cancelEditing();
    await nextTick();

    await display.trigger("keydown.space");
    await nextTick();
    expect(wrapper.find("input").exists()).toBe(true);
  });

  it("clears the input on start if clearOnStart is true", async () => {
    const { default: EditableText } = await import("@/components/EditableText.vue");
    const wrapper = mount(EditableText, {
      props: { modelValue: "DropMe", clearOnStart: true },
    });
    const display = wrapper.get(".editable");

    await display.trigger("click");
    await nextTick();

    const input = wrapper.get("input");
    expect(input.element.value).toBe("");
  });

  it("preserves the width if preserveWidth is true", async () => {
    const { default: EditableText } = await import("@/components/EditableText.vue");
    const wrapper = mount(EditableText, {
      props: { modelValue: "Wide Text", preserveWidth: true },
      attachTo: document.body,
    });
    const displayEl = wrapper.get(".editable").element;
    // simulate measured size
    Object.defineProperty(displayEl, "scrollWidth", { value: 120, configurable: true });
    Object.defineProperty(displayEl, "offsetWidth", { value: 80, configurable: true });

    const display = wrapper.get(".editable");
    await display.trigger("click");
    await nextTick();

    const input = wrapper.get("input");
    expect(input.element.style.width).toBe("120px");
    wrapper.unmount();
  });

  it("emits save only when the value has changed on blur", async () => {
    const { default: EditableText } = await import("@/components/EditableText.vue");
    const wrapper = mount(EditableText, {
      props: { modelValue: "SameValue" },
    });
    await wrapper.get(".editable").trigger("click");
    await nextTick();

    const input = wrapper.get("input");
    // blur without change should not emit save
    await input.trigger("blur");
    await nextTick();
    expect(wrapper.emitted("save")).toBeUndefined();

    // start editing again to change value
    await wrapper.get(".editable").trigger("click");
    await nextTick();
    const changed = wrapper.get("input");
    await changed.setValue("NewValue");
    await changed.trigger("blur");
    await nextTick();
    expect(wrapper.emitted("save")).toEqual([["NewValue"]]);
  });

  it("emits cancel when cancelEditing is called", async () => {
    const { default: EditableText } = await import("@/components/EditableText.vue");
    const wrapper = mount(EditableText, {
      props: { modelValue: "CancelMe" },
    });

    // start editing then cancel
    wrapper.vm.startEditing();
    await nextTick();
    wrapper.vm.cancelEditing();
    await nextTick();

    expect(wrapper.emitted("cancel")).toEqual([[]]);
    // text should revert to original
    expect(wrapper.get(".editable").text()).toBe("CancelMe");
  });
});
