import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";

// Import inside tests to allow window.matchMedia to be stubbed before script setup

const SegmentedControlStub = defineComponent({
  name: "SegmentedControl",
  props: {
    modelValue: { type: Number },
    icons: { type: Array },
    labels: { type: Array },
    defaultActive: { type: Number },
  },
  emits: ["update:modelValue"],
  template: "<div />",
});

describe("ThemeSwitch.vue", () => {
  let originalMatchMedia;
  let listeners;
  let matches;

  beforeAll(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });

  beforeEach(() => {
    vi.resetModules();
    listeners = [];
    matches = false;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      get matches() {
        return matches;
      },
      addEventListener: (event, cb) => {
        if (event === "change") listeners.push(cb);
      },
      removeEventListener: (event, cb) => {
        if (event === "change") listeners = listeners.filter((fn) => fn !== cb);
      },
    }));
    document.documentElement.classList.remove("theme-transition", "dark-theme");
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("forwards correct props to SegmentedControl without labels", async () => {
    const { default: ThemeSwitch } = await import("@/components/ThemeSwitch.vue");
    const wrapper = mount(ThemeSwitch, {
      global: { stubs: { SegmentedControl: SegmentedControlStub } },
    });
    const seg = wrapper.getComponent(SegmentedControlStub);
    expect(seg.props()).toMatchObject({
      icons: ["Sun", "SunMoon", "Moon"],
      labels: null,
      defaultActive: 1,
      modelValue: -1,
    });
  });

  it("forwards correct labels when labels prop is true", async () => {
    const { default: ThemeSwitch } = await import("@/components/ThemeSwitch.vue");
    const wrapper = mount(ThemeSwitch, {
      props: { labels: true },
      global: { stubs: { SegmentedControl: SegmentedControlStub } },
    });
    const seg = wrapper.getComponent(SegmentedControlStub);
    expect(seg.props("labels")).toEqual(["Light", "System", "Dark"]);
  });

  it("toggles dark-theme class based on mode changes", async () => {
    const { default: ThemeSwitch } = await import("@/components/ThemeSwitch.vue");
    const wrapper = mount(ThemeSwitch, {
      global: { stubs: { SegmentedControl: SegmentedControlStub } },
    });
    // system mode, matches=false => light theme
    expect(document.documentElement.classList.contains("dark-theme")).toBe(false);

    // dark mode
    wrapper.vm.mode = 2;
    await wrapper.vm.$nextTick();
    expect(document.documentElement.classList.contains("dark-theme")).toBe(true);

    // light mode
    wrapper.vm.mode = 0;
    await wrapper.vm.$nextTick();
    expect(document.documentElement.classList.contains("dark-theme")).toBe(false);
  });

  it("updates theme on media query changes in system mode", async () => {
    const { default: ThemeSwitch } = await import("@/components/ThemeSwitch.vue");
    matches = true;
    const wrapper = mount(ThemeSwitch, {
      global: { stubs: { SegmentedControl: SegmentedControlStub } },
    });
    // switch to system mode
    wrapper.vm.mode = 1;
    await wrapper.vm.$nextTick();
    expect(document.documentElement.classList.contains("dark-theme")).toBe(true);

    matches = false;
    listeners.forEach((cb) => cb());
    await wrapper.vm.$nextTick();
    expect(document.documentElement.classList.contains("dark-theme")).toBe(false);
  });

  it("adds and removes theme-transition class on theme updates", async () => {
    const { default: ThemeSwitch } = await import("@/components/ThemeSwitch.vue");
    mount(ThemeSwitch, {
      global: { stubs: { SegmentedControl: SegmentedControlStub } },
    });
    expect(document.documentElement.classList.contains("theme-transition")).toBe(true);
    vi.advanceTimersByTime(300);
    expect(document.documentElement.classList.contains("theme-transition")).toBe(false);
  });
});
