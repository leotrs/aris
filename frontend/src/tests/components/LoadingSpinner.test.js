import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import LoadingSpinner from "@/components/base/LoadingSpinner.vue";

describe("LoadingSpinner.vue", () => {
  it("renders with default props", () => {
    const wrapper = mount(LoadingSpinner);

    expect(wrapper.find(".loading-container").exists()).toBe(true);
    expect(wrapper.find(".spinner").exists()).toBe(true);
    expect(wrapper.find(".loading-message").text()).toBe("Loading...");
    expect(wrapper.find(".spinner").classes()).toContain("medium");
  });

  it("displays custom message", () => {
    const wrapper = mount(LoadingSpinner, {
      props: { message: "Loading files..." },
    });

    expect(wrapper.find(".loading-message").text()).toBe("Loading files...");
  });

  it("applies different sizes", () => {
    const wrapper = mount(LoadingSpinner, {
      props: { size: "large" },
    });

    expect(wrapper.find(".spinner").classes()).toContain("large");
  });

  it("handles compact mode", () => {
    const wrapper = mount(LoadingSpinner, {
      props: { compact: true },
    });

    expect(wrapper.find(".loading-container").classes()).toContain("compact");
    expect(wrapper.find(".loading-message").exists()).toBe(false);
  });

  it("shows message in compact mode when message is provided", () => {
    const wrapper = mount(LoadingSpinner, {
      props: { compact: true, message: "Loading..." },
    });

    // In compact mode, message should not be shown
    expect(wrapper.find(".loading-message").exists()).toBe(false);
  });
});
