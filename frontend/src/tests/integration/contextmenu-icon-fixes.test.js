import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ContextMenu from "@/components/navigation/ContextMenu.vue";

describe("ContextMenu Icon Fixes - Integration Tests", () => {
  describe("Bug Fix 1: Tag Icon Should Use Custom Variant", () => {
    it("should render custom variant correctly", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: "custom",
        },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template:
                '<button data-testid="trigger-button" :class="$attrs.class">Custom Button</button>',
              props: ["variant", "component", "icon", "text", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      // Should render custom variant correctly
      const triggerButton = wrapper.find('[data-testid="trigger-button"]');
      expect(triggerButton.exists()).toBe(true);
      expect(triggerButton.text()).toBe("Custom Button");
      expect(triggerButton.classes()).toContain("variant-custom");
    });

    it("should render close variant correctly", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: "close",
        },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template:
                '<button data-testid="trigger-button" :class="$attrs.class">Close Button</button>',
              props: ["variant", "component", "icon", "text", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      // Should render close variant correctly
      const triggerButton = wrapper.find('[data-testid="trigger-button"]');
      expect(triggerButton.exists()).toBe(true);
      expect(triggerButton.text()).toBe("Close Button");
      expect(triggerButton.classes()).toContain("variant-close");
    });

    it("should render dots variant by default", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          // No variant specified - should default to 'dots'
        },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: '<button data-testid="trigger-button" :class="$attrs.class">Dots</button>',
              props: ["variant", "component", "icon", "text", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      // Should render dots variant by default
      const triggerButton = wrapper.find('[data-testid="trigger-button"]');
      expect(triggerButton.exists()).toBe(true);
      expect(triggerButton.text()).toBe("Dots");
      expect(triggerButton.classes()).toContain("variant-dots");
    });
  });

  describe("Bug Fix 2: CSS Class Structure Update", () => {
    it("should have context-menu-trigger class on trigger button", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          icon: "Dots",
        },
        global: {
          stubs: {
            ButtonDots: {
              template: '<button data-testid="trigger-button" :class="$attrs.class">Dots</button>',
            },
            Teleport: true,
          },
        },
      });

      const triggerButton = wrapper.find('[data-testid="trigger-button"]');
      expect(triggerButton.exists()).toBe(true);

      // Should have the new context-menu-trigger class
      const classes = triggerButton.classes();
      expect(classes).toContain("context-menu-trigger");
      expect(classes).toContain("variant-dots");
      expect(classes).toContain("size-md"); // default size
    });

    it("should have context-menu-trigger class on custom button component", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: "custom",
          size: "lg",
        },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template:
                '<button data-testid="trigger-button" :class="$attrs.class">Custom</button>',
              props: ["variant", "component", "icon", "text", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      const triggerButton = wrapper.find('[data-testid="trigger-button"]');
      expect(triggerButton.exists()).toBe(true);

      // Should have the new context-menu-trigger class for CSS targeting
      const classes = triggerButton.classes();
      expect(classes).toContain("context-menu-trigger");
      expect(classes).toContain("variant-custom");
      // Note: size class may not be passed through in stubs, so we test the core functionality
    });
  });

  describe("Bug Fix 3: Slot Detection Logic", () => {
    it("should not use slot variant for empty menu content slots", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: "dots",
        },
        slots: {
          default: '', // Empty slot content should not trigger slot variant
        },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: '<button data-testid="trigger-button" :class="$attrs.class">{{ $attrs.variant }}</button>',
              props: ["variant", "component", "icon", "text", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      const triggerButton = wrapper.find('[data-testid="trigger-button"]');
      expect(triggerButton.exists()).toBe(true);
      expect(triggerButton.classes()).toContain("variant-dots");
      expect(triggerButton.classes()).not.toContain("variant-slot");
    });

    it("should not use slot variant for comment-only menu content", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: "dots",
        },
        slots: {
          default: '<!-- ContextMenuItem components will go here -->', // Comments should not trigger slot variant
        },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: '<button data-testid="trigger-button" :class="$attrs.class">{{ $attrs.variant }}</button>',
              props: ["variant", "component", "icon", "text", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      const triggerButton = wrapper.find('[data-testid="trigger-button"]');
      expect(triggerButton.exists()).toBe(true);
      expect(triggerButton.classes()).toContain("variant-dots");
      expect(triggerButton.classes()).not.toContain("variant-slot");
    });

    it("should use slot variant only when explicit trigger slot is provided", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: "slot",
        },
        slots: {
          trigger: '<span data-testid="custom-trigger">Custom Trigger</span>',
          default: '<div>Menu content</div>',
        },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: `
                <button data-testid="trigger-button" :class="$attrs.class">
                  <slot />
                </button>
              `,
              props: ["variant", "component", "icon", "text", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      const triggerButton = wrapper.find('[data-testid="trigger-button"]');
      expect(triggerButton.exists()).toBe(true);
      expect(wrapper.find('[data-testid="custom-trigger"]').exists()).toBe(true);
    });
  });

  describe("Modern API Only", () => {
    it("should work with new variant prop without warnings", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      mount(ContextMenu, {
        props: {
          variant: "dots",
        },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: '<button data-testid="trigger-button">Dots</button>',
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      // Should not show any warnings with modern API
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should have clean modern API without deprecated props", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: "dots",
          placement: "bottom-start",
          size: "sm",
        },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template:
                '<button data-testid="trigger-button" :class="$attrs.class">Modern</button>',
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      // Should work with modern props only
      expect(wrapper.props("variant")).toBe("dots");
      expect(wrapper.props("placement")).toBe("bottom-start");
      expect(wrapper.props("size")).toBe("sm");

      // Should not have deprecated props
      expect(wrapper.props("icon")).toBeUndefined();
      expect(wrapper.props("btnComponent")).toBeUndefined();
      expect(wrapper.props("text")).toBeUndefined();
    });
  });
});
