import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ButtonClose from "@/components/ButtonClose.vue";

describe("ButtonClose.vue", () => {
  it("emits close event on click", async () => {
    const wrapper = mount(ButtonClose, {
      global: { stubs: { IconX: true } },
    });
    const btn = wrapper.get("button.btn-close");
    expect(btn.exists()).toBe(true);
    await btn.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("close");
  });
});
