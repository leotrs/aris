import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import SelectBox from "@/components/SelectBox.vue";

describe("SelectBox.vue", () => {
  const TeleportStub = { props: ["to"], template: "<div><slot/></div>" };
  const ContextMenuStub = {
    props: ["text", "icon"],
    template:
      '<div class="cm-wrapper"><button class="cm-btn" :disabled="$attrs.disabled">{{ text }}</button><div class="cm-menu"><slot/></div></div>',
  };
  const itemStub = {
    props: ["caption"],
    template: '<button class="item"><span class="cmi-caption">{{ caption }}</span></button>',
  };
  it("renders current label and trigger button in row direction with options and attributes", async () => {
    const wrapper = mount(SelectBox, {
      props: {
        modelValue: "b",
        direction: "row",
        options: [
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ],
      },
      attrs: { disabled: true },
      global: {
        stubs: { Teleport: TeleportStub, ContextMenu: ContextMenuStub, ContextMenuItem: itemStub },
      },
    });
    const container = wrapper.get(".select-box");
    expect(container.classes()).toContain("row");
    const currentLabel = wrapper.get(".current-label");
    expect(currentLabel.text()).toBe("Option B");
    await nextTick();
    const trigger = wrapper.get(".cm-btn");
    expect(trigger.attributes("disabled")).toBeDefined();

    await trigger.trigger("click");
    await nextTick();
    const items = wrapper.findAll(".cm-menu .item .cmi-caption");
    expect(items).toHaveLength(2);
    expect(items[0].text()).toBe("Option A");
    expect(items[1].text()).toBe("Option B");
  });

  it("renders current label in column direction and shows one option", async () => {
    const wrapper = mount(SelectBox, {
      props: {
        modelValue: "x",
        direction: "column",
        options: [{ value: "x", label: "X" }],
      },
      global: {
        stubs: { Teleport: TeleportStub, ContextMenu: ContextMenuStub, ContextMenuItem: itemStub },
      },
    });
    const container = wrapper.get(".select-box");
    expect(container.classes()).toContain("column");
    const currentLabel = wrapper.get(".current-label");
    expect(currentLabel.text()).toBe("X");
    await nextTick();

    const trigger = wrapper.get(".cm-btn");
    await trigger.trigger("click");
    await nextTick();
    const items = wrapper.findAll(".cm-menu .item .cmi-caption");
    expect(items).toHaveLength(1);
    expect(items[0].text()).toBe("X");
  });

  it("emits update:modelValue when menu item clicked", async () => {
    const wrapper = mount(SelectBox, {
      props: {
        modelValue: "init",
        options: [
          { value: "init", label: "Initial" },
          { value: "new", label: "New" },
        ],
      },
      global: {
        stubs: { Teleport: TeleportStub, ContextMenu: ContextMenuStub, ContextMenuItem: itemStub },
      },
    });
    const trigger = wrapper.get(".cm-btn");
    await trigger.trigger("click");
    await nextTick();
    const items = wrapper.findAll(".cm-menu .item");
    await items[1].trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["new"]);
  });

  it("supports primitive string options", async () => {
    const wrapper = mount(SelectBox, {
      props: { modelValue: "foo", options: ["foo", "bar"] },
      global: {
        stubs: { Teleport: TeleportStub, ContextMenu: ContextMenuStub, ContextMenuItem: itemStub },
      },
    });
    await nextTick();
    const currentLabel = wrapper.get(".current-label");
    expect(currentLabel.text()).toBe("foo");

    const trigger = wrapper.get(".cm-btn");
    await trigger.trigger("click");
    await nextTick();
    const items = wrapper.findAll(".cm-menu .item .cmi-caption");
    expect(items).toHaveLength(2);
    expect(items[0].text()).toBe("foo");
    expect(items[1].text()).toBe("bar");
  });
});
