import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import ContextMenu from "@/components/ContextMenu.vue";

describe("ContextMenu.vue - API Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Modern API Validation", () => {
    it("should only accept modern props (variant, placement, size, floatingOptions)", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: "custom",
          placement: "bottom-start",
          size: "lg",
          floatingOptions: { strategy: "absolute" },
        },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: "<button>Trigger</button>",
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      // Should accept modern props
      expect(wrapper.props("variant")).toBe("custom");
      expect(wrapper.props("placement")).toBe("bottom-start");
      expect(wrapper.props("size")).toBe("lg");
      expect(wrapper.props("floatingOptions")).toEqual({ strategy: "absolute" });
    });

    it("should support all modern variants", () => {
      const variants = ["dots", "close", "custom"];

      variants.forEach((variant) => {
        const wrapper = mount(ContextMenu, {
          props: { variant },
          global: {
            stubs: {
              ContextMenuTrigger: {
                template: "<button>Trigger</button>",
                props: ["variant", "size", "isOpen"],
                emits: ["toggle"],
              },
              Teleport: true,
            },
          },
        });

        const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
        expect(trigger.props("variant")).toBe(variant);
      });
    });

    it("should default to dots variant when no variant specified", () => {
      const wrapper = mount(ContextMenu, {
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: "<button>Trigger</button>",
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      expect(wrapper.props("variant")).toBe("dots");
      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
      expect(trigger.props("variant")).toBe("dots");
    });
  });

  describe("Legacy Props Rejection", () => {
    it("should not expose legacy props as component props", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: "dots",
          // Attempt to pass legacy props - these should be ignored
          icon: "SomeIcon",
          text: "Some Text",
          btnComponent: "Button",
          buttonSize: "lg",
          iconClass: "custom-class",
          kind: "primary",
          shadow: true,
        },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: "<button>Trigger</button>",
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      // Legacy props should not be accessible via wrapper.props()
      expect(wrapper.props("icon")).toBeUndefined();
      expect(wrapper.props("text")).toBeUndefined();
      expect(wrapper.props("btnComponent")).toBeUndefined();
      expect(wrapper.props("buttonSize")).toBeUndefined();
      expect(wrapper.props("iconClass")).toBeUndefined();
      expect(wrapper.props("kind")).toBeUndefined();
      expect(wrapper.props("shadow")).toBeUndefined();
    });

    it("should pass modern props correctly to ContextMenuTrigger", () => {
      const wrapper = mount(ContextMenu, {
        props: {
          variant: "custom",
          size: "sm",
        },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: '<button :class="`variant-${variant} size-${size}`">Trigger</button>',
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
      expect(trigger.props("variant")).toBe("custom");
      expect(trigger.props("size")).toBe("sm");
      expect(trigger.props("isOpen")).toBe(false);
    });
  });

  describe("Variant-Specific Behavior", () => {
    it("should handle dots variant correctly", () => {
      const wrapper = mount(ContextMenu, {
        props: { variant: "dots" },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: '<button data-testid="dots-trigger">Dots</button>',
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
      expect(trigger.props("variant")).toBe("dots");
      expect(trigger.find('[data-testid="dots-trigger"]').exists()).toBe(true);
    });

    it("should handle close variant correctly", () => {
      const wrapper = mount(ContextMenu, {
        props: { variant: "close" },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: '<button data-testid="close-trigger">Close</button>',
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
      expect(trigger.props("variant")).toBe("close");
      expect(trigger.find('[data-testid="close-trigger"]').exists()).toBe(true);
    });

    it("should handle custom variant correctly", () => {
      const wrapper = mount(ContextMenu, {
        props: { variant: "custom" },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: '<button data-testid="custom-trigger">Custom</button>',
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      const trigger = wrapper.findComponent({ name: "ContextMenuTrigger" });
      expect(trigger.props("variant")).toBe("custom");
      expect(trigger.find('[data-testid="custom-trigger"]').exists()).toBe(true);
    });

    it("should handle slot variant correctly", () => {
      const wrapper = mount(ContextMenu, {
        slots: {
          trigger: '<button data-testid="slot-trigger">Slot Custom</button>',
        },
        global: {
          stubs: {
            ContextMenuTrigger: {
              template: "<div><slot /></div>",
              props: ["variant", "size", "isOpen"],
              emits: ["toggle"],
            },
            Teleport: true,
          },
        },
      });

      expect(wrapper.find('[data-testid="slot-trigger"]').exists()).toBe(true);
    });
  });
});
