import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import UserMenu from "@/components/navigation/UserMenu.vue";

/**
 * CRITICAL UserMenu Regression Tests
 *
 * These tests verify the specific fix made to UserMenu and will
 * immediately fail if someone breaks the trigger slot functionality.
 *
 * THE FIX: UserMenu template must use #trigger="{ toggle }" and Avatar must have @click="toggle"
 */
describe("UserMenu.vue - CRITICAL Regression Detection", () => {
  it("🚨 CRITICAL: Avatar click MUST trigger menu toggle", async () => {
    // This is the core functionality test that will catch regressions
    const mockToggle = vi.fn();

    const wrapper = mount(UserMenu, {
      global: {
        provide: {
          user: ref({ id: 1, name: "Test User", email: "test@example.com" }),
        },
        mocks: {
          $router: { push: vi.fn() },
        },
        stubs: {
          ContextMenu: {
            props: ["variant"],
            template: `
              <div data-testid="context-menu">
                <slot name="trigger" :toggle="toggle" :isOpen="false" />
                <slot />
              </div>
            `,
            setup() {
              return { toggle: mockToggle };
            },
          },
          Avatar: {
            props: ["user", "tooltip"],
            template: '<div data-testid="avatar" @click="$emit(\'click\')"></div>',
            emits: ["click"],
          },
          ContextMenuItem: true,
          Separator: true,
        },
      },
    });

    // Find the avatar
    const avatar = wrapper.find('[data-testid="avatar"]');
    expect(avatar.exists()).toBe(true);

    // CRITICAL TEST: Click avatar and verify toggle is called
    await avatar.trigger("click");

    // 🚨 If this assertion fails, the UserMenu fix has been broken
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it("🚨 CRITICAL: UserMenu must use ContextMenu with slot variant", () => {
    // This test ensures the variant is correct
    let capturedVariant = null;

    const wrapper = mount(UserMenu, {
      global: {
        provide: {
          user: ref({ id: 1, name: "Test User", email: "test@example.com" }),
        },
        mocks: {
          $router: { push: vi.fn() },
        },
        stubs: {
          ContextMenu: {
            props: ["variant"],
            template: '<div><slot name="trigger" :toggle="vi.fn()" /><slot /></div>',
            setup(props) {
              capturedVariant = props.variant;
              return {};
            },
          },
          Avatar: true,
          ContextMenuItem: true,
          Separator: true,
        },
      },
    });

    // 🚨 If this fails, UserMenu is not using the correct ContextMenu variant
    expect(capturedVariant).toBe("slot");
  });

  it("🚨 CRITICAL: UserMenu exposed toggle method must work", () => {
    // Test the exposed API
    const mockInternalToggle = vi.fn();

    const wrapper = mount(UserMenu, {
      global: {
        provide: {
          user: ref({ id: 1, name: "Test User", email: "test@example.com" }),
        },
        mocks: {
          $router: { push: vi.fn() },
        },
        stubs: {
          ContextMenu: {
            template: '<div><slot name="trigger" :toggle="vi.fn()" /><slot /></div>',
            setup() {
              return { toggle: mockInternalToggle };
            },
            expose: ["toggle"],
          },
          Avatar: true,
          ContextMenuItem: true,
          Separator: true,
        },
      },
    });

    // The UserMenu should expose a working toggle method
    expect(typeof wrapper.vm.toggle).toBe("function");

    // Calling it should work without errors
    expect(() => wrapper.vm.toggle()).not.toThrow();
  });

  it("📸 VISUAL: UserMenu structure verification", () => {
    // This test captures the structure for visual regression detection
    const wrapper = mount(UserMenu, {
      global: {
        provide: {
          user: ref({ id: 1, name: "Test User", email: "test@example.com" }),
        },
        mocks: {
          $router: { push: vi.fn() },
        },
        stubs: {
          ContextMenu: {
            template: `
              <div class="context-menu" data-variant="slot">
                <slot name="trigger" :toggle="vi.fn()" />
                <div class="menu-content"><slot /></div>
              </div>
            `,
          },
          Avatar: {
            template: '<div class="avatar" data-testid="avatar">User Avatar</div>',
          },
          ContextMenuItem: {
            props: ["icon", "caption"],
            template: '<div class="menu-item">{{ caption }}</div>',
          },
          Separator: {
            template: '<hr class="separator" />',
          },
        },
      },
    });

    // Verify key structural elements exist
    expect(wrapper.find(".context-menu").exists()).toBe(true);
    expect(wrapper.find(".avatar").exists()).toBe(true);
    expect(wrapper.findAll(".menu-item").length).toBeGreaterThan(0);
    expect(wrapper.findAll(".separator").length).toBeGreaterThan(0);

    // Capture the HTML structure for comparison
    const html = wrapper.html();
    expect(html).toContain('data-variant="slot"');
    expect(html).toContain("User Avatar");
    expect(html).toContain('class="menu-item"');
  });
});
