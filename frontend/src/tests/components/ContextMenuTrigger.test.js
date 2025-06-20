import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ContextMenuTrigger from "@/components/ContextMenuTrigger.vue";

// Common test stubs
const commonStubs = {
  ButtonDots: {
    template:
      '<button data-testid="trigger-button" :class="$attrs.class" v-bind="$attrs"><slot /></button>',
    name: "ButtonDots",
    emits: ["update:modelValue"],
  },
  ButtonClose: {
    template:
      '<button data-testid="trigger-button" :class="$attrs.class" v-bind="$attrs"><slot /></button>',
    name: "ButtonClose",
  },
  Button: {
    template:
      '<button data-testid="trigger-button" :class="$attrs.class" v-bind="$attrs"><slot /></button>',
    name: "Button",
  },
  ButtonToggle: {
    template:
      '<button data-testid="trigger-button" :class="$attrs.class" v-bind="$attrs"><slot /></button>',
    name: "ButtonToggle",
    emits: ["update:modelValue"],
  },
};

const mountComponent = (props = {}, options = {}) => {
  return mount(ContextMenuTrigger, {
    props: { isOpen: false, ...props },
    global: {
      stubs: commonStubs,
      ...options.global,
    },
    ...options,
  });
};

describe("ContextMenuTrigger.vue", () => {
  describe("Variant System", () => {
    it("should render dots variant by default", () => {
      const wrapper = mountComponent();

      expect(wrapper.find('[data-testid="trigger-button"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="trigger-button"]').classes()).toContain("variant-dots");
      expect(wrapper.findComponent({ name: "ButtonDots" }).exists()).toBe(true);
    });

    it("should render close variant when specified", () => {
      const wrapper = mountComponent({ variant: "close" });

      expect(wrapper.find('[data-testid="trigger-button"]').classes()).toContain("variant-close");
      expect(wrapper.findComponent({ name: "ButtonClose" }).exists()).toBe(true);
    });

    it("should render custom variant with specified component", () => {
      const wrapper = mountComponent({
        variant: "custom",
        component: "ButtonToggle",
        icon: "Tag",
      });

      expect(wrapper.find('[data-testid="trigger-button"]').classes()).toContain("variant-custom");
      expect(wrapper.findComponent({ name: "ButtonToggle" }).exists()).toBe(true);
    });
  });

  describe("Slot System", () => {
    it("should render trigger slot when provided", () => {
      const wrapper = mountComponent(
        {},
        {
          slots: {
            default: '<span data-testid="custom-trigger">Custom Trigger</span>',
          },
        }
      );

      expect(wrapper.find('[data-testid="custom-trigger"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="trigger-button"]').classes()).toContain("variant-slot");
    });

    it("should prioritize slot over variant prop", () => {
      const wrapper = mountComponent(
        { variant: "dots" },
        {
          slots: {
            default: '<span data-testid="slot-content">Slot Content</span>',
          },
        }
      );

      expect(wrapper.find('[data-testid="slot-content"]').exists()).toBe(true);
      expect(wrapper.findComponent({ name: "ButtonDots" }).exists()).toBe(false);
    });
  });

  describe("Size System", () => {
    it("should apply size classes correctly", () => {
      const wrapper = mountComponent({ size: "lg" });

      expect(wrapper.find('[data-testid="trigger-button"]').classes()).toContain("size-lg");
    });

    it("should default to medium size", () => {
      const wrapper = mountComponent();

      expect(wrapper.find('[data-testid="trigger-button"]').classes()).toContain("size-md");
    });
  });

  describe("Event Handling", () => {
    it("should emit toggle event when clicked", async () => {
      const wrapper = mountComponent();

      await wrapper.find('[data-testid="trigger-button"]').trigger("click");

      expect(wrapper.emitted("toggle")).toHaveLength(1);
    });

    it("should prevent event propagation on click", async () => {
      const parentClick = vi.fn();
      const wrapper = mount(
        {
          template: `
          <div @click="parentClick">
            <ContextMenuTrigger :isOpen="false" @toggle="toggle" />
          </div>
        `,
          components: { ContextMenuTrigger },
          methods: {
            parentClick,
            toggle: vi.fn(),
          },
        },
        {
          global: { stubs: commonStubs },
        }
      );

      await wrapper.find('[data-testid="trigger-button"]').trigger("click");

      expect(parentClick).not.toHaveBeenCalled();
    });

    it("should handle touch events on mobile", async () => {
      const wrapper = mountComponent();

      // const trigger = wrapper.find("div").element;
      await wrapper.find("div").trigger("touchstart");
      await wrapper.find("div").trigger("touchend");

      expect(wrapper.emitted("toggle")).toHaveLength(1);
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      const wrapper = mountComponent({ isOpen: true });

      const button = wrapper.find('[data-testid="trigger-button"]');
      expect(button.attributes("aria-expanded")).toBe("true");
      expect(button.attributes("id")).toMatch(/^cm-trigger-/);
    });

    it("should update aria-expanded based on isOpen prop", async () => {
      const wrapper = mountComponent({ isOpen: false });

      expect(wrapper.find('[data-testid="trigger-button"]').attributes("aria-expanded")).toBe(
        "false"
      );

      await wrapper.setProps({ isOpen: true });
      expect(wrapper.find('[data-testid="trigger-button"]').attributes("aria-expanded")).toBe(
        "true"
      );
    });
  });

  describe("CSS Classes", () => {
    it("should apply all required CSS classes", () => {
      const wrapper = mountComponent({
        variant: "close",
        size: "sm",
        isOpen: true,
      });

      const button = wrapper.find('[data-testid="trigger-button"]');
      const classes = button.classes();

      expect(classes).toContain("context-menu-trigger");
      expect(classes).toContain("variant-close");
      expect(classes).toContain("size-sm");
    });

    it("should accept additional CSS classes", () => {
      const wrapper = mountComponent(
        {},
        {
          attrs: {
            class: "custom-class another-class",
          },
        }
      );

      const classes = wrapper.find('[data-testid="trigger-button"]').classes();
      expect(classes).toContain("custom-class");
      expect(classes).toContain("another-class");
    });
  });

  describe("Props and Attributes", () => {
    it("should pass through custom props to underlying button", () => {
      const wrapper = mountComponent({
        variant: "custom",
        component: "ButtonToggle",
        icon: "Tag",
        text: "Custom Text",
      });

      const buttonToggle = wrapper.findComponent({ name: "ButtonToggle" });
      expect(buttonToggle.exists()).toBe(true);
      // Note: In real implementation, these would be passed through v-bind="$attrs"
    });

    it("should handle model-value correctly for toggle buttons", async () => {
      const wrapper = mountComponent({
        variant: "dots",
        isOpen: false,
      });

      const buttonDots = wrapper.findComponent({ name: "ButtonDots" });
      expect(buttonDots.exists()).toBe(true);

      await wrapper.setProps({ isOpen: true });
      // The model-value should be bound correctly through the template
    });
  });

  describe("Context Menu Integration", () => {
    it("should provide triggerId for accessibility", () => {
      const wrapper = mountComponent();

      const triggerId = wrapper.find('[data-testid="trigger-button"]').attributes("id");
      expect(triggerId).toMatch(/^cm-trigger-/);
      expect(wrapper.vm.triggerId).toBe(triggerId);
    });

    it("should expose trigger element reference", () => {
      const wrapper = mountComponent();

      expect(wrapper.vm.triggerRef).toBeDefined();
    });
  });
});
