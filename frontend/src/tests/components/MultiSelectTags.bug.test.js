import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MultiSelectTags from "@/components/MultiSelectTags.vue";

describe("MultiSelectTags.vue - Bug: Tag Icon Issue", () => {
  it("should render Tag icon instead of three dots in ContextMenu", () => {
    const wrapper = mount(MultiSelectTags, {
      props: {
        tags: ["math", "science"],
        // icon prop defaults to "Tag" per component definition
      },
      global: {
        stubs: {
          ContextMenu: {
            template: `
              <div data-testid="context-menu" :data-icon="icon">
                <div v-if="icon === 'Tag'" data-testid="tag-icon">Tag Icon</div>
                <div v-else-if="icon === 'Dots'" data-testid="dots-icon">Three Dots</div>
                <div v-else data-testid="unknown-icon">{{ icon }}</div>
              </div>
            `,
            props: ["icon"],
          },
          TagControl: {
            template: '<div data-testid="tag-control"><slot /></div>',
          },
        },
      },
    });

    // Verify the ContextMenu receives the Tag icon
    const contextMenu = wrapper.find('[data-testid="context-menu"]');
    expect(contextMenu.exists()).toBe(true);
    expect(contextMenu.attributes("data-icon")).toBe("Tag");

    // Should render Tag icon, not dots
    expect(wrapper.find('[data-testid="tag-icon"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="dots-icon"]').exists()).toBe(false);
  });

  it("should allow custom icon override", () => {
    const wrapper = mount(MultiSelectTags, {
      props: {
        tags: ["math"],
        icon: "CustomIcon",
      },
      global: {
        stubs: {
          ContextMenu: {
            template: `
              <div data-testid="context-menu" :data-icon="icon">
                <div data-testid="icon-display">{{ icon }}</div>
              </div>
            `,
            props: ["icon"],
          },
          TagControl: {
            template: '<div data-testid="tag-control"><slot /></div>',
          },
        },
      },
    });

    expect(wrapper.find('[data-testid="context-menu"]').attributes("data-icon")).toBe("CustomIcon");
    expect(wrapper.find('[data-testid="icon-display"]').text()).toBe("CustomIcon");
  });
});
