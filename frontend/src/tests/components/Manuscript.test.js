import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { shallowMount } from "@vue/test-utils";

import Manuscript from "@/components/Manuscript.vue";

describe("Manuscript.vue", () => {
  it("renders basic HTML string", async () => {
    const html = "<h1>Title</h1><p>Paragraph</p>";
    const wrapper = shallowMount(Manuscript, {
      props: { htmlString: html },
      global: {
        stubs: ["FeedbackIcon"],
      },
    });
    await nextTick();
    expect(wrapper.html()).toContain("<h1>Title</h1>");
    expect(wrapper.html()).toContain("<p>Paragraph</p>");
  });

  it("applies style attributes to elements", async () => {
    const html = '<div style="color: red; font-size: 12px"></div>';
    const wrapper = shallowMount(Manuscript, {
      props: { htmlString: html },
      global: {
        stubs: ["FeedbackIcon"],
      },
    });
    await nextTick();
    const div = wrapper.element.querySelector("div");
    expect(div.style.color).toBe("red");
    expect(div.style.fontSize).toBe("12px");
  });

  it("renders FeedbackIcon for elements with hr-info class", async () => {
    const html = '<div class="hr-info">Info</div>';
    const wrapper = shallowMount(Manuscript, {
      props: { htmlString: html },
      global: {
        stubs: ["FeedbackIcon"],
      },
    });
    await nextTick();
    expect(wrapper.html()).toContain('<div class="hr-info">Info<feedback-icon-stub');
    expect(wrapper.find("feedback-icon-stub").exists()).toBe(true);
  });
});
