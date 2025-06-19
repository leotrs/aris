import { describe, it, expect } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";
import Tabs from "@/components/Tabs.vue";
import TabPage from "@/components/TabPage.vue";

describe.skip("Tabs.vue", () => {
  const TabStub = defineComponent({
    name: "Tab",
    props: ["modelValue", "label", "icon"],
    emits: ["update:modelValue"],
    setup(props, { emit }) {
      return () =>
        h(
          "button",
          {
            class: { active: props.modelValue },
            onClick: () => emit("update:modelValue", !props.modelValue),
          },
          props.label
        );
    },
  });

  it("renders pages and toggles visible page on tab click", async () => {
    const labels = ["One", "Two", "Three"];
    const wrapper = mount(Tabs, {
      props: { labels },
      global: { stubs: { Tab: TabStub } },
      slots: { default: () => labels.map((l) => h(TabPage, null, () => l + "Content")) },
    });

    const pages = wrapper.findAllComponents(TabPage);
    expect(pages).toHaveLength(labels.length);
    expect(pages[0].element.style.display).toBe("block");
    expect(pages[1].element.style.display).toBe("none");

    const tabs = wrapper.findAllComponents(TabStub);
    await tabs[1].trigger("click");
    await wrapper.vm.$nextTick();

    expect(pages[1].element.style.display).toBe("block");
    expect(pages[0].element.style.display).toBe("none");
  });
});
