import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import MultiSelectTags from "@/components/tags/MultiSelectTags.vue";

describe("MultiSelectTags.vue - Bug: Tag Icon Issue", () => {
  const createMockFileStore = () => ref({
    tags: [
      { id: 1, name: "math", color: "blue" },
      { id: 2, name: "science", color: "green" }
    ]
  });

  it("should render Tag icon instead of three dots in ContextMenu", () => {
    const wrapper = mount(MultiSelectTags, {
      props: {
        tags: ["math", "science"],
        // icon prop defaults to "Tag" per component definition
      },
      global: {
        provide: {
          fileStore: createMockFileStore(),
        },
        stubs: {
          ContextMenu: {
            template: `
              <div data-testid="context-menu">
                <slot name="trigger" :toggle="() => {}"></slot>
              </div>
            `,
          },
          ButtonToggle: {
            template: `
              <button data-testid="button-toggle" :data-icon="icon">
                <div v-if="icon === 'Tag'" data-testid="tag-icon">Tag Icon</div>
                <div v-else-if="icon === 'Dots'" data-testid="dots-icon">Three Dots</div>
                <div v-else data-testid="unknown-icon">{{ icon }}</div>
              </button>
            `,
            props: { icon: { type: String }, size: { type: String } },
          },
          TagControl: {
            template: '<div data-testid="tag-control"><slot /></div>',
          },
        },
      },
    });

    // Verify the ButtonToggle receives the Tag icon
    const buttonToggle = wrapper.find('[data-testid="button-toggle"]');
    expect(buttonToggle.exists()).toBe(true);
    expect(buttonToggle.attributes("data-icon")).toBe("Tag");

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
        provide: {
          fileStore: createMockFileStore(),
        },
        stubs: {
          ContextMenu: {
            template: `
              <div data-testid="context-menu">
                <slot name="trigger" :toggle="() => {}"></slot>
              </div>
            `,
          },
          ButtonToggle: {
            template: `
              <button data-testid="button-toggle" :data-icon="icon">
                <div data-testid="icon-display">{{ icon }}</div>
              </button>
            `,
            props: { icon: { type: String }, size: { type: String } },
          },
          TagControl: {
            template: '<div data-testid="tag-control"><slot /></div>',
          },
        },
      },
    });

    expect(wrapper.find('[data-testid="button-toggle"]').attributes("data-icon")).toBe("CustomIcon");
    expect(wrapper.find('[data-testid="icon-display"]').text()).toBe("CustomIcon");
  });
});
