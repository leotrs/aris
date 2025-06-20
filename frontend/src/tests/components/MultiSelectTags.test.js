import { describe, it, expect, beforeEach, vi } from "vitest";
import { defineComponent, h, ref, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import MultiSelectTags from "@/components/MultiSelectTags.vue";

describe("MultiSelectTags.vue", () => {
  let fileStore;
  const tagsList = [
    { id: 1, name: "Tag1", color: "red" },
    { id: 2, name: "Tag2", color: "green" },
  ];

  beforeEach(() => {
    fileStore = ref({
      tags: tagsList,
      toggleFileTag: vi.fn(),
      createTag: vi.fn(),
    });
  });

  const ContextMenuStub = defineComponent({
    name: "ContextMenu",
    props: ["icon", "placement", "buttonSize"],
    setup(_, { slots }) {
      return () => h("div", slots.default && slots.default());
    },
  });

  const TagControlStub = defineComponent({
    name: "TagControl",
    props: ["modelValue", "tag"],
    emits: ["update:modelValue"],
    setup(props, { emit, attrs }) {
      return () =>
        h(
          "div",
          { class: attrs.class, onClick: () => emit("update:modelValue", !props.modelValue) },
          props.tag.name
        );
    },
  });

  const SeparatorStub = defineComponent({
    name: "Separator",
    setup() {
      return () => h("hr");
    },
  });

  const TagStub = defineComponent({
    name: "Tag",
    props: ["tag", "active", "editable", "editOnClick", "clearOnStartRenaming"],
    emits: ["rename"],
    setup(props, { emit, attrs }) {
      return () =>
        h("div", { class: attrs.class, onClick: () => emit("rename", "NewTag") }, props.tag.name);
    },
  });

  function mountMulti(tagsProp = [], fileProp = { id: 123 }) {
    return mount(MultiSelectTags, {
      props: { tags: tagsProp, file: fileProp },
      global: {
        provide: { fileStore },
        stubs: {
          ContextMenu: ContextMenuStub,
          TagControl: TagControlStub,
          Separator: SeparatorStub,
          Tag: TagStub,
        },
      },
    });
  }

  it("renders ContextMenu and TagControl items for each store tag", () => {
    const wrapper = mountMulti();
    const cm = wrapper.getComponent(ContextMenuStub);
    expect(cm.props()).toMatchObject({ icon: "Tag", placement: "bottom-end", buttonSize: "sm" });
    const controls = wrapper.findAllComponents(TagControlStub);
    expect(controls).toHaveLength(tagsList.length);
    controls.forEach((ctrl, i) => {
      expect(ctrl.props()).toMatchObject({ modelValue: false, tag: tagsList[i] });
    });
  });

  it("updates internal selection state via v-model when TagControl emits update", async () => {
    const wrapper = mount(MultiSelectTags, {
      props: { tags: [], file: { id: 123 } },
      global: {
        provide: { fileStore },
        stubs: {
          ContextMenu: ContextMenuStub,
          TagControl: TagControlStub,
          Separator: SeparatorStub,
          Tag: TagStub,
        },
      },
    });
    // wait for initial sync to complete
    await nextTick();
    await nextTick();
    expect(wrapper.vm.state.tagIsAssigned).toEqual([false, false]);
    const controls = wrapper.findAllComponents(TagControlStub);
    // toggle the first tag control
    await controls[0].trigger("click");
    await nextTick();
    expect(wrapper.vm.state.tagIsAssigned[0]).toBe(true);
    // toggle back off
    await controls[0].trigger("click");
    await nextTick();
    expect(wrapper.vm.state.tagIsAssigned[0]).toBe(false);
  });

  it("creates a new tag on rename event on new-tag placeholder", async () => {
    const wrapper = mountMulti();
    // find the Tag stub for the new-tag placeholder (id === null)
    const newTagStub = wrapper.findAllComponents(TagStub).find((w) => w.props("tag").id === null);
    await nextTick();
    await newTagStub.trigger("click");
    await nextTick();
    expect(fileStore.value.createTag).toHaveBeenCalledWith("NewTag");
  });

  it("does not resynchronize in filter context after initial load", async () => {
    const wrapper = mount(MultiSelectTags, {
      props: { tags: ["initial"] },
      global: {
        provide: { fileStore },
        stubs: {
          ContextMenu: ContextMenuStub,
          TagControl: TagControlStub,
          Separator: SeparatorStub,
          Tag: TagStub,
        },
      },
    });
    const before = [...wrapper.vm.state.tagIsAssigned];
    fileStore.value.tags = [];
    await nextTick();
    expect(wrapper.vm.state.tagIsAssigned).toEqual(before);
  });
});
