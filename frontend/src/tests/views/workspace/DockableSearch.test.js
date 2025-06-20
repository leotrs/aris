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
    return () => slots.default && slots.default();
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
});
