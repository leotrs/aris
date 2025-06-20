import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Header from "@/components/layout/Header.vue";

describe("Header.vue", () => {
  it("renders default slot content inside .pane-header", () => {
    const wrapper = mount(Header, {
      slots: { default: "<div>Header content</div>" },
    });

    const header = wrapper.get(".pane-header");
    expect(header.html()).toContain("<div>Header content</div>");
  });

  it("merges additional classes with pane-header", () => {
    const wrapper = mount(Header, {
      attrs: { class: "custom-class" },
    });
    expect(wrapper.classes()).toContain("pane-header");
    expect(wrapper.classes()).toContain("custom-class");
  });
});
