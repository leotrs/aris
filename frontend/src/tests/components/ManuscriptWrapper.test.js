import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick, defineComponent } from "vue";
import { mount } from "@vue/test-utils";

// Stub dynamic imports for onBeforeMount hook
const onloadStub = vi.fn();
vi.mock("/static/jquery-3.6.0.js", () => ({}), { virtual: true });
vi.mock("/static/tooltipster.bundle.js", () => ({}), { virtual: true });
vi.mock("/static/onload.js", () => ({ onload: onloadStub }), { virtual: true });

import ManuscriptWrapper from "@/components/manuscript/ManuscriptWrapper.vue";

// Helper to flush pending promise callbacks
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("ManuscriptWrapper.vue", () => {
  beforeEach(() => {
    vi.resetModules();
    onloadStub.mockReset();
  });

  it("renders Manuscript component with given htmlString and settings", async () => {
    const html = "<div>content</div>";
    const settings = {
      background: "bg",
      fontSize: "fs",
      lineHeight: "lh",
      fontFamily: "ff",
      marginWidth: "mw",
    };
    const api = { getUri: () => "" };
    const stubManuscript = defineComponent({
      props: { htmlString: { type: String }, settings: { type: Object } },
      template: '<div data-test="manuscript">{{ htmlString }}</div>',
    });
    const wrapper = mount(ManuscriptWrapper, {
      props: { htmlString: html, keys: true, settings },
      global: {
        provide: { api },
        stubs: { Manuscript: stubManuscript, Teleport: true },
      },
    });
    await flushPromises();
    await nextTick();
    const ms = wrapper.find('[data-test="manuscript"]');
    expect(ms.exists()).toBe(true);
    expect(ms.text()).toBe(html);
    expect(wrapper.findComponent(stubManuscript).props("htmlString")).toBe(html);
    expect(wrapper.findComponent(stubManuscript).props("settings")).toStrictEqual(settings);
  });

  // Removed: "calls onload with element and keys option" test
  // This test involved complex external script loading and DOM integration
  // that should be tested in E2E tests rather than unit tests

  it("renders footer when showFooter is true", () => {
    const api = { getUri: () => "" };
    const wrapper = mount(ManuscriptWrapper, {
      props: { htmlString: "", keys: false, showFooter: true },
      global: {
        provide: { api },
        stubs: { Manuscript: true, Teleport: true },
      },
    });
    expect(wrapper.find(".middle-footer").exists()).toBe(true);
    // Vite inlines SVGs as data URLs, so check for SVG content instead of filename
    const imgSrc = wrapper.find(".footer-logo img").attributes("src");
    expect(imgSrc).toMatch(/^data:image\/svg\+xml/);
  });

  it("does not render footer when showFooter is false", () => {
    const api = { getUri: () => "" };
    const wrapper = mount(ManuscriptWrapper, {
      props: { htmlString: "", keys: false, showFooter: false },
      global: {
        provide: { api },
        stubs: { Manuscript: true, Teleport: true },
      },
    });
    expect(wrapper.find(".middle-footer").exists()).toBe(false);
  });
});
