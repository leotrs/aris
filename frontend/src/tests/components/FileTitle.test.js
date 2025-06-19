import { describe, it, expect, beforeEach, vi } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";

describe("FileTitle.vue", () => {
  let updateMock;

  let EditableTextStub;
  beforeEach(() => {
    vi.resetModules();
    updateMock = vi.fn();
    // stub File model
    vi.doMock("@/models/File.js", () => ({ File: { update: updateMock } }));
    // prepare stub for EditableText
    EditableTextStub = defineComponent({
      name: "EditableText",
      props: ["modelValue"],
      emits: ["update:modelValue", "save"],
      setup(props, { attrs }) {
        return () => h("div", { ...attrs }, props.modelValue);
      },
    });
  });

  it("passes the file title to EditableText and disables click editing", async () => {
    const file = { title: "Doc Title" };
    const { default: FileTitle } = await import("@/components/FileTitle.vue");
    const wrapper = mount(FileTitle, {
      props: { file },
      global: { stubs: { EditableText: EditableTextStub } },
    });
    const editable = wrapper.get("div.file-title");
    expect(editable.text()).toBe("Doc Title");
  });

  it("calls File.update when the title is changed and saved", async () => {
    const file = { title: "Old Title" };
    const { default: FileTitle } = await import("@/components/FileTitle.vue");
    const wrapper = mount(FileTitle, {
      props: { file },
      global: { stubs: { EditableText: EditableTextStub } },
    });
    const editableWrapper = wrapper.getComponent({ name: "EditableText" });

    // simulate user editing via v-model update
    await editableWrapper.vm.$emit("update:modelValue", "New Title");
    // simulate save event from EditableText
    await editableWrapper.vm.$emit("save");
    expect(updateMock).toHaveBeenCalledWith(file, { title: "New Title" });
  });

  it("does not call File.update when save is emitted but title unchanged", async () => {
    const file = { title: "Same Title" };
    const { default: FileTitle } = await import("@/components/FileTitle.vue");
    const wrapper = mount(FileTitle, {
      props: { file },
      global: { stubs: { EditableText: EditableTextStub } },
    });
    const editableWrapper = wrapper.getComponent({ name: "EditableText" });

    // emit save without changing
    await editableWrapper.vm.$emit("save");
    expect(updateMock).not.toHaveBeenCalled();
  });
});
