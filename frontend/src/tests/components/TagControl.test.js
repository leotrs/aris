import { describe, it, expect, beforeEach, vi } from "vitest";
import { defineComponent, h, ref } from "vue";
import { mount } from "@vue/test-utils";
import TagControl from "@/components/TagControl.vue";

describe("TagControl.vue", () => {
  const tag = { id: 1, name: "Tag1", color: "red" };
  let updateTagMock;
  let startEditingMock;

  const TagStub = defineComponent({
    name: "Tag",
    props: ["tag", "active", "editable"],
    emits: ["click", "rename"],
    setup(props, { expose, emit, attrs }) {
      startEditingMock = vi.fn();
      expose({ startEditing: startEditingMock });
      return () => h("div", { class: attrs.class, onClick: () => emit("click") }, props.tag.name);
    },
  });

  const ColorPickerStub = defineComponent({
    name: "ColorPicker",
    props: ["colors"],
    emits: ["change"],
    setup(props, { emit }) {
      return () => h("div", { onClick: () => emit("change", "blue") });
    },
  });

  const ContextMenuStub = defineComponent({
    name: "ContextMenu",
    props: ["placement"],
    setup(_, { slots }) {
      return () => h("div", slots.default && slots.default());
    },
  });

  const ContextMenuItemStub = defineComponent({
    name: "ContextMenuItem",
    props: ["icon", "caption"],
    emits: ["click"],
    setup(props, { emit, attrs }) {
      return () => h("button", { class: attrs.class, onClick: () => emit("click") }, props.caption);
    },
  });

  beforeEach(() => {
    updateTagMock = vi.fn();
  });

  function mountControl() {
    const fileStore = ref({ updateTag: updateTagMock });
    return mount(TagControl, {
      props: { tag },
      global: {
        provide: { fileStore },
        stubs: {
          Tag: TagStub,
          ContextMenu: ContextMenuStub,
          ColorPicker: ColorPickerStub,
          ContextMenuItem: ContextMenuItemStub,
        },
      },
    });
  }

  it("toggles active state on Tag click", async () => {
    const wrapper = mountControl();
    const tagComp = wrapper.getComponent(TagStub);
    expect(tagComp.props("active")).toBe(false);
    // simulate component click with dummy event to satisfy .stop modifier
    await tagComp.vm.$emit("click", { stopPropagation: () => {} });
    await wrapper.vm.$nextTick();
    expect(wrapper.getComponent(TagStub).props("active")).toBe(true);
  });

  it("calls updateTag on rename event from Tag", async () => {
    const wrapper = mountControl();
    await wrapper.getComponent(TagStub).vm.$emit("rename", "NewName");
    expect(updateTagMock).toHaveBeenCalledWith(tag, { ...tag, name: "NewName" });
  });

  it("updates tag color via ColorPicker change", async () => {
    const wrapper = mountControl();
    const picker = wrapper.getComponent(ColorPickerStub);
    expect(picker.props("colors")).toMatchObject({
      red: "var(--red-400)",
      green: "var(--green-400)",
      purple: "var(--purple-400)",
      orange: "var(--orange-400)",
    });
    await picker.trigger("click");
    expect(updateTagMock).toHaveBeenCalledWith(tag, { ...tag, color: "blue" });
  });

  it("invokes startEditing on rename menu item click", async () => {
    const wrapper = mountControl();
    const renameItem = wrapper
      .findAllComponents(ContextMenuItemStub)
      .find((w) => w.props("caption") === "Rename");
    expect(renameItem).toBeTruthy();
    await renameItem.trigger("click");
    expect(startEditingMock).toHaveBeenCalled();
  });

  it("deletes tag on delete menu item click", async () => {
    const wrapper = mountControl();
    const deleteItem = wrapper
      .findAllComponents(ContextMenuItemStub)
      .find((w) => w.props("caption") === "Delete");
    expect(deleteItem).toBeTruthy();
    await deleteItem.trigger("click");
    expect(updateTagMock).toHaveBeenCalledWith(tag, null);
  });
});
