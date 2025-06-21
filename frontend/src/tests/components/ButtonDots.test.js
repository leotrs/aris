import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { shallowMount } from "@vue/test-utils";
import ButtonDots from "@/components/base/ButtonDots.vue";

describe("ButtonDots.vue", () => {
  // Note: Icon sizing and positioning regression tests are in ButtonDots.regression.test.js
  
  it("emits on when active becomes true and off when becomes false", async () => {
    const wrapper = shallowMount(ButtonDots, {
      global: { stubs: { IconDotsVertical: true } },
    });
    // activate
    wrapper.vm.active = true;
    await nextTick();
    expect(wrapper.emitted("on")).toBeTruthy();
    // deactivate
    wrapper.vm.active = false;
    await nextTick();
    expect(wrapper.emitted("off")).toBeTruthy();
  });
});
