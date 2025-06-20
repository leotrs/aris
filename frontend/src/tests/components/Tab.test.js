import { describe, it, expect, afterEach as _afterEach } from "vitest";
import { defineComponent, h, ref as _ref } from "vue";
import { mount } from "@vue/test-utils";
import Tab from "@/components/Tab.vue";

describe("Tab.vue", () => {
  const IconStub = defineComponent({
    name: "Icon",
    props: ["name", "class"],
    render() {
      return h("div", { class: this.class }, this.name);
    },
  });

  it("renders label and icon with correct classes and aria attributes", () => {
    const wrapper = mount(Tab, {
      props: { label: "MyTab", icon: "MyIcon", modelValue: false },
      global: { stubs: { Icon: IconStub } },
    });

    const btn = wrapper.get("button");
    expect(btn.classes()).toContain("tab-wrapper");
    expect(btn.classes()).not.toContain("active");
    expect(btn.attributes("role")).toBe("tab");
    expect(btn.attributes("aria-selected")).toBe("false");

    const icon = wrapper.getComponent(IconStub);
    expect(icon.text()).toBe("MyIcon");
    expect(icon.classes()).toContain("tab-icon");

    const label = wrapper.get(".tab-label");
    expect(label.text()).toBe("MyTab");
  });

  it("emits update:modelValue on click, enter and space keydown", async () => {
    const wrapper = mount(Tab, {
      props: { label: "Tab", icon: "", modelValue: false },
      global: { stubs: { Icon: IconStub } },
    });

    await wrapper.get("button").trigger("click");
    await wrapper.get("button").trigger("keydown.enter");
    await wrapper.get("button").trigger("keydown.space");

    const events = wrapper.emitted("update:modelValue") || [];
    expect(events).toEqual([[true]]);
  });
});
