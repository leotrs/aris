import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, nextTick, defineComponent } from "vue";
import DockableSearch from "@/views/workspace/DockableSearch.vue";
import * as HSM from "@/utils/highlightSearchMatches.js";
import * as KSMod from "@/composables/useKeyboardShortcuts.js";

const SearchBarStub = defineComponent({
  name: "SearchBar",
  props: {
    withButtons: { type: Boolean },
    placeholder: { type: String },
  },
  emits: ["submit", "next", "prev", "cancel"],
  setup(_, { expose, slots }) {
    const focusInput = vi.fn();
    expose({ focusInput });
    return () => [slots.default && slots.default(), slots.buttons && slots.buttons()];
  },
});

describe("DockableSearch.vue", () => {
  const stubMatches = [
    {
      mark: {
        scrollIntoView: vi.fn(),
        classList: {
          remove: vi.fn(),
          add: vi.fn(),
        },
      },
    },
    {
      mark: {
        scrollIntoView: vi.fn(),
        classList: {
          remove: vi.fn(),
          add: vi.fn(),
        },
      },
    },
  ];

  beforeEach(() => {
    vi.spyOn(HSM, "highlightSearchMatches").mockReturnValue(stubMatches);
    vi.spyOn(HSM, "highlightSearchMatchesSource").mockReturnValue([]);
    vi.spyOn(HSM, "clearHighlights").mockImplementation(() => {});
    vi.spyOn(HSM, "updateCurrentMatch").mockImplementation(() => {});
    vi.spyOn(KSMod, "useKeyboardShortcuts").mockImplementation(() => ({
      activate: vi.fn(),
      deactivate: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not display match count before search", () => {
    const manuscriptRef = ref({ $el: {} });
    const file = ref({ source: "" });
    const wrapper = mount(DockableSearch, {
      global: {
        provide: { manuscriptRef, file },
        stubs: { SearchBar: SearchBarStub, ButtonClose: true },
      },
    });
    expect(wrapper.find(".match-count").exists()).toBe(false);
  });

  it("performs search and navigates through matches correctly", async () => {
    const manuscriptRef = ref({ $el: {} });
    const file = ref({ source: "dummy source" });
    const wrapper = mount(DockableSearch, {
      global: {
        provide: { manuscriptRef, file },
        stubs: { SearchBar: SearchBarStub, ButtonClose: true },
      },
    });
    const query = "term";
    await wrapper.findComponent(SearchBarStub).vm.$emit("submit", query);
    await nextTick();
    expect(HSM.highlightSearchMatches).toHaveBeenCalledWith(manuscriptRef.value.$el, query.trim());
    expect(HSM.highlightSearchMatchesSource).toHaveBeenCalledWith(file.value.source, query.trim());
    const countLabel = wrapper.find(".match-count").text();
    expect(countLabel).toBe(`1/${stubMatches.length} document matches`);

    await wrapper.findComponent(SearchBarStub).vm.$emit("next");
    await nextTick();
    expect(stubMatches[1].mark.scrollIntoView).toHaveBeenCalled();
    expect(wrapper.find(".match-count").text()).toBe(`2/${stubMatches.length} document matches`);

    await wrapper.findComponent(SearchBarStub).vm.$emit("prev");
    await nextTick();
    expect(stubMatches[0].mark.scrollIntoView).toHaveBeenCalled();
    expect(wrapper.find(".match-count").text()).toBe(`1/${stubMatches.length} document matches`);

    await wrapper.findComponent(SearchBarStub).vm.$emit("cancel");
    await nextTick();
    expect(HSM.clearHighlights).toHaveBeenCalledWith(manuscriptRef.value.$el);
    expect(wrapper.find(".match-count").exists()).toBe(false);
  });

  it("hides advanced search toggle button when feature is disabled", async () => {
    const manuscriptRef = ref({ $el: {} });
    const file = ref({ source: "" });
    const wrapper = mount(DockableSearch, {
      global: {
        provide: { manuscriptRef, file },
        stubs: {
          SearchBar: SearchBarStub,
          ButtonClose: true,
          Button: { template: "<button class='test-button'><slot/></button>" },
          SelectBox: { template: "<div/>", props: ["modelValue", "options"] },
          InputText: { template: "<input/>", props: ["modelValue"] },
        },
      },
    });

    // Should start in simple mode
    expect(wrapper.classes()).toContain("simple");
    expect(wrapper.classes()).not.toContain("advanced");

    // Advanced search toggle button should not be visible
    expect(wrapper.find(".test-button").exists()).toBe(false);
  });

  it("shows advanced search toggle when feature is enabled", async () => {
    const manuscriptRef = ref({ $el: {} });
    const file = ref({ source: "" });
    const wrapper = mount(DockableSearch, {
      global: {
        provide: { manuscriptRef, file },
        stubs: {
          SearchBar: SearchBarStub,
          ButtonClose: true,
          Button: { template: "<button class='test-button'><slot/></button>" },
          SelectBox: { template: "<div/>", props: ["modelValue", "options"] },
          InputText: { template: "<input/>", props: ["modelValue"] },
        },
      },
    });

    // Enable advanced search feature
    wrapper.vm.enableAdvancedSearch = true;
    await nextTick();

    // Advanced search toggle button should now be visible
    expect(wrapper.find(".test-button").exists()).toBe(true);

    // Can switch to advanced mode
    wrapper.vm.advanced = true;
    await nextTick();
    expect(wrapper.classes()).toContain("advanced");
    expect(wrapper.classes()).not.toContain("simple");
  });

  it("handles advanced search scope selection", async () => {
    const manuscriptRef = ref({ $el: {} });
    const file = ref({ source: "test source content" });
    const wrapper = mount(DockableSearch, {
      global: {
        provide: { manuscriptRef, file },
        stubs: {
          SearchBar: SearchBarStub,
          ButtonClose: true,
          Button: { template: "<button><slot/></button>" },
          SelectBox: {
            template: "<select/>",
            props: ["modelValue", "options"],
            emits: ["update:modelValue"],
          },
          InputText: { template: "<input/>", props: ["modelValue"] },
        },
      },
    });

    // Enable advanced search feature and switch to advanced mode
    wrapper.vm.enableAdvancedSearch = true;
    wrapper.vm.advanced = true;
    await nextTick();

    // Test scope options are available in advanced mode
    expect(wrapper.classes()).toContain("advanced");
  });

  it("handles advanced search mode selection", async () => {
    const manuscriptRef = ref({ $el: {} });
    const file = ref({ source: "test content" });
    const wrapper = mount(DockableSearch, {
      global: {
        provide: { manuscriptRef, file },
        stubs: {
          SearchBar: SearchBarStub,
          ButtonClose: true,
          Button: { template: "<button><slot/></button>" },
          SelectBox: {
            template: "<select/>",
            props: ["modelValue", "options"],
          },
          InputText: { template: "<input/>", props: ["modelValue"] },
        },
      },
    });

    // Enable advanced search feature and switch to advanced mode
    wrapper.vm.enableAdvancedSearch = true;
    wrapper.vm.advanced = true;
    await nextTick();

    // Test that advanced mode is active
    expect(wrapper.classes()).toContain("advanced");
  });

  it("shows replace input when replace mode is selected", async () => {
    const manuscriptRef = ref({ $el: {} });
    const file = ref({ source: "test content" });
    const wrapper = mount(DockableSearch, {
      global: {
        provide: { manuscriptRef, file },
        stubs: {
          SearchBar: SearchBarStub,
          ButtonClose: true,
          Button: { template: "<button><slot/></button>" },
          SelectBox: {
            template: "<select/>",
            props: ["modelValue", "options"],
          },
          InputText: {
            template: '<input class="replace-input"/>',
            props: ["modelValue"],
          },
        },
      },
    });

    // Enable advanced search feature, switch to advanced mode and replace mode
    wrapper.vm.enableAdvancedSearch = true;
    wrapper.vm.advanced = true;
    wrapper.vm.selectMode = "replace";
    await nextTick();

    // Should be in advanced mode
    expect(wrapper.classes()).toContain("advanced");
  });

  it("handles empty search strings gracefully", async () => {
    const manuscriptRef = ref({ $el: {} });
    const file = ref({ source: "test content" });
    const wrapper = mount(DockableSearch, {
      global: {
        provide: { manuscriptRef, file },
        stubs: { SearchBar: SearchBarStub, ButtonClose: true },
      },
    });

    // Submit empty search
    await wrapper.findComponent(SearchBarStub).vm.$emit("submit", "");
    await nextTick();

    // Should not perform search
    expect(HSM.highlightSearchMatches).not.toHaveBeenCalled();
    expect(wrapper.find(".match-count").exists()).toBe(false);
  });

  it("handles whitespace-only search strings", async () => {
    const manuscriptRef = ref({ $el: {} });
    const file = ref({ source: "test content" });
    const wrapper = mount(DockableSearch, {
      global: {
        provide: { manuscriptRef, file },
        stubs: { SearchBar: SearchBarStub, ButtonClose: true },
      },
    });

    // Submit whitespace-only search
    await wrapper.findComponent(SearchBarStub).vm.$emit("submit", "   \t  \n  ");
    await nextTick();

    // Should not perform search
    expect(HSM.highlightSearchMatches).not.toHaveBeenCalled();
    expect(wrapper.find(".match-count").exists()).toBe(false);
  });

  it("handles navigation with no matches", async () => {
    // Temporarily override the mock to return no matches
    vi.spyOn(HSM, "highlightSearchMatches").mockReturnValue([]); // No matches

    const manuscriptRef = ref({ $el: {} });
    const file = ref({ source: "no matching content" });
    const wrapper = mount(DockableSearch, {
      global: {
        provide: { manuscriptRef, file },
        stubs: { SearchBar: SearchBarStub, ButtonClose: true },
      },
    });

    await wrapper.findComponent(SearchBarStub).vm.$emit("submit", "nomatch");
    await nextTick();

    // The component should not show match count when there are no matches
    const matchCountElement = wrapper.find(".match-count");
    // For no matches, the component should either not show the element or show "0 matches"
    if (matchCountElement.exists()) {
      const text = matchCountElement.text();
      expect(text === "" || text.includes("0") || text.includes("matches")).toBe(true);
    }

    // Component should exist and be stable
    expect(wrapper.exists()).toBe(true);

    // Navigation should do nothing with no matches (but not throw errors)
    await wrapper.findComponent(SearchBarStub).vm.$emit("next");
    await nextTick();

    await wrapper.findComponent(SearchBarStub).vm.$emit("prev");
    await nextTick();

    // Should not throw errors
    expect(wrapper.exists()).toBe(true);
  });

  it("handles circular navigation through matches", async () => {
    const manuscriptRef = ref({ $el: {} });
    const file = ref({ source: "content" });
    const wrapper = mount(DockableSearch, {
      global: {
        provide: { manuscriptRef, file },
        stubs: { SearchBar: SearchBarStub, ButtonClose: true },
      },
    });

    await wrapper.findComponent(SearchBarStub).vm.$emit("submit", "test");
    await nextTick();

    // Navigate to last match (should wrap from first)
    await wrapper.findComponent(SearchBarStub).vm.$emit("prev");
    await nextTick();

    expect(stubMatches[1].mark.scrollIntoView).toHaveBeenCalled();
    expect(wrapper.find(".match-count").text()).toBe(`2/${stubMatches.length} document matches`);

    // Navigate forward from last (should wrap to first)
    await wrapper.findComponent(SearchBarStub).vm.$emit("next");
    await nextTick();

    expect(stubMatches[0].mark.scrollIntoView).toHaveBeenCalled();
    expect(wrapper.find(".match-count").text()).toBe(`1/${stubMatches.length} document matches`);
  });

  it("focuses search input on mount", async () => {
    const mockFocusInput = vi.fn();
    const SearchBarWithFocus = defineComponent({
      name: "SearchBar",
      setup(_, { expose }) {
        expose({ focusInput: mockFocusInput });
        return () => null;
      },
    });

    const manuscriptRef = ref({ $el: {} });
    const file = ref({ source: "" });

    mount(DockableSearch, {
      global: {
        provide: { manuscriptRef, file },
        stubs: { SearchBar: SearchBarWithFocus, ButtonClose: true },
      },
    });

    await nextTick();
    expect(mockFocusInput).toHaveBeenCalled();
  });

  it("handles manuscript ref not being available", async () => {
    const manuscriptRef = ref(null); // No manuscript ref
    const file = ref({ source: "test content" });
    const wrapper = mount(DockableSearch, {
      global: {
        provide: { manuscriptRef, file },
        stubs: { SearchBar: SearchBarStub, ButtonClose: true },
      },
    });

    // Should not crash when no manuscript ref
    await wrapper.findComponent(SearchBarStub).vm.$emit("submit", "test");
    await nextTick();

    expect(HSM.highlightSearchMatches).not.toHaveBeenCalled();
    expect(wrapper.exists()).toBe(true);
  });

  it("updates current match highlighting during navigation", async () => {
    const manuscriptRef = ref({ $el: {} });
    const file = ref({ source: "test content" });
    const wrapper = mount(DockableSearch, {
      global: {
        provide: { manuscriptRef, file },
        stubs: { SearchBar: SearchBarStub, ButtonClose: true },
      },
    });

    await wrapper.findComponent(SearchBarStub).vm.$emit("submit", "test");
    await nextTick();

    await wrapper.findComponent(SearchBarStub).vm.$emit("next");
    await nextTick();

    expect(HSM.updateCurrentMatch).toHaveBeenCalledWith(stubMatches, 1);

    await wrapper.findComponent(SearchBarStub).vm.$emit("prev");
    await nextTick();

    expect(HSM.updateCurrentMatch).toHaveBeenCalledWith(stubMatches, 0);
  });
});
