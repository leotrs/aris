import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ContextMenuItem from "@/components/navigation/ContextMenuItem.vue";

// Mock Icon component
vi.mock("@/components/base/Icon.vue", () => ({
  default: {
    name: "Icon",
    template: '<div class="mock-icon" :class="$attrs.class"><slot /></div>',
  },
}));

describe("ContextMenuItem", () => {
  it("renders with icon and caption", () => {
    const wrapper = mount(ContextMenuItem, {
      props: {
        icon: "edit",
        caption: "Edit Item",
      },
      global: {
        provide: {
          closeMenu: vi.fn(),
        },
      },
    });

    expect(wrapper.find(".cmi-icon").exists()).toBe(true);
    expect(wrapper.find(".cmi-caption").text()).toBe("Edit Item");
  });

  it("applies custom icon class", () => {
    const wrapper = mount(ContextMenuItem, {
      props: {
        icon: "edit",
        caption: "Edit Item",
        iconClass: "custom-icon-class",
      },
      global: {
        provide: {
          closeMenu: vi.fn(),
        },
      },
    });

    expect(wrapper.find(".cmi-icon").classes()).toContain("custom-icon-class");
  });

  it("calls closeMenu when clicked", async () => {
    const closeMenuMock = vi.fn();
    const wrapper = mount(ContextMenuItem, {
      props: {
        icon: "edit",
        caption: "Edit Item",
      },
      global: {
        provide: {
          closeMenu: closeMenuMock,
        },
      },
    });

    await wrapper.find(".item").trigger("click");
    expect(closeMenuMock).toHaveBeenCalled();
  });

  it("stops event propagation", async () => {
    const wrapper = mount(ContextMenuItem, {
      props: {
        icon: "edit",
        caption: "Edit Item",
      },
      global: {
        provide: {
          closeMenu: vi.fn(),
        },
      },
    });

    const clickEvent = new Event("click", { bubbles: true });
    const stopPropagationSpy = vi.spyOn(clickEvent, "stopPropagation");

    await wrapper.find(".item").element.dispatchEvent(clickEvent);
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it("has proper accessibility attributes", () => {
    const wrapper = mount(ContextMenuItem, {
      props: {
        icon: "edit",
        caption: "Edit Item",
      },
      global: {
        provide: {
          closeMenu: vi.fn(),
        },
      },
    });

    const button = wrapper.find(".item");
    expect(button.attributes("role")).toBe("menuitem");
    expect(button.attributes("tabindex")).toBe("-1");
    expect(button.attributes("type")).toBe("button");
  });

  it("has proper styling classes", () => {
    const wrapper = mount(ContextMenuItem, {
      props: {
        icon: "edit",
        caption: "Edit Item",
      },
      global: {
        provide: {
          closeMenu: vi.fn(),
        },
      },
    });

    const button = wrapper.find(".item");
    expect(button.exists()).toBe(true);
    expect(wrapper.find(".cmi-icon").exists()).toBe(true);
    expect(wrapper.find(".cmi-caption").exists()).toBe(true);
  });
});
