import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import UserMenu from "@/components/navigation/UserMenu.vue";

describe("UserMenu.vue - TDD Tests", () => {
  let mockUser;
  let mockRouter;

  beforeEach(() => {
    mockUser = ref({
      id: 1,
      name: "Test User",
      email: "test@example.com",
    });

    mockRouter = {
      push: vi.fn(),
    };
  });

  describe("ContextMenu Integration", () => {
    it("should render ContextMenu with slot variant", () => {
      const wrapper = mount(UserMenu, {
        global: {
          provide: { user: mockUser },
          mocks: { $router: mockRouter },
          stubs: {
            ContextMenu: {
              template:
                '<div data-testid="context-menu" :variant="variant"><slot name="trigger" :toggle="toggle" :isOpen="false" /><slot /></div>',
              props: ["variant"],
              setup() {
                return { toggle: vi.fn() };
              },
            },
            Avatar: {
              template: '<div data-testid="avatar" @click="$attrs.onClick"></div>',
            },
            ContextMenuItem: {
              template: '<div data-testid="context-menu-item"><slot /></div>',
            },
            Separator: {
              template: '<hr data-testid="separator" />',
            },
          },
        },
      });

      const contextMenu = wrapper.find('[data-testid="context-menu"]');
      expect(contextMenu.exists()).toBe(true);
      expect(contextMenu.attributes("variant")).toBe("slot");
    });

    it("should pass toggle function to Avatar trigger", async () => {
      const mockToggle = vi.fn();

      const wrapper = mount(UserMenu, {
        global: {
          provide: { user: mockUser },
          mocks: { $router: mockRouter },
          stubs: {
            ContextMenu: {
              template:
                '<div data-testid="context-menu"><slot name="trigger" :toggle="toggle" :isOpen="false" /><slot /></div>',
              setup() {
                return { toggle: mockToggle };
              },
            },
            Avatar: {
              template: '<div data-testid="avatar" @click="handleClick"></div>',
              props: ["user", "tooltip"],
              setup(props, { attrs }) {
                const handleClick = () => {
                  if (attrs.onClick) attrs.onClick();
                };
                return { handleClick };
              },
            },
            ContextMenuItem: {
              template: '<div data-testid="context-menu-item"><slot /></div>',
            },
            Separator: {
              template: '<hr data-testid="separator" />',
            },
          },
        },
      });

      const avatar = wrapper.find('[data-testid="avatar"]');
      expect(avatar.exists()).toBe(true);

      await avatar.trigger("click");
      expect(mockToggle).toHaveBeenCalled();
    });

    it("should render menu items correctly", () => {
      const wrapper = mount(UserMenu, {
        global: {
          provide: { user: mockUser },
          mocks: { $router: mockRouter },
          stubs: {
            ContextMenu: {
              template:
                '<div data-testid="context-menu"><slot name="trigger" :toggle="mockToggle" :isOpen="false" /><slot /></div>',
              setup() {
                const mockToggle = vi.fn();
                return { mockToggle };
              },
            },
            Avatar: {
              template: '<div data-testid="avatar"></div>',
            },
            ContextMenuItem: {
              template: '<div data-testid="context-menu-item" :class="$attrs.class"><slot /></div>',
              props: ["icon", "caption"],
            },
            Separator: {
              template: '<hr data-testid="separator" />',
            },
          },
        },
      });

      const menuItems = wrapper.findAll('[data-testid="context-menu-item"]');
      expect(menuItems.length).toBeGreaterThan(0);

      const separators = wrapper.findAll('[data-testid="separator"]');
      expect(separators.length).toBeGreaterThan(0);
    });

    it("should expose toggle method correctly", () => {
      const wrapper = mount(UserMenu, {
        global: {
          provide: { user: mockUser },
          mocks: { $router: mockRouter },
          stubs: {
            ContextMenu: {
              template:
                '<div data-testid="context-menu"><slot name="trigger" :toggle="toggle" :isOpen="false" /><slot /></div>',
              setup() {
                const toggle = vi.fn();
                return { toggle };
              },
              expose: ["toggle"],
            },
            Avatar: { template: '<div data-testid="avatar"></div>' },
            ContextMenuItem: { template: '<div data-testid="context-menu-item"></div>' },
            Separator: { template: '<hr data-testid="separator" />' },
          },
        },
      });

      expect(typeof wrapper.vm.toggle).toBe("function");
    });
  });
});
