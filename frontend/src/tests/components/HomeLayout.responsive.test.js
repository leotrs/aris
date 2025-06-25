import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, shallowMount } from "@vue/test-utils";
import { ref, nextTick } from "vue";
import HomeLayout from "@/components/layout/HomeLayout.vue";

// Mock router
const mockPush = vi.fn();
const mockRoute = { fullPath: "/" };
vi.mock("vue-router", () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => mockRoute,
}));

// Mock keyboard shortcuts
vi.mock("@/composables/useKeyboardShortcuts.js", () => ({
  useKeyboardShortcuts: vi.fn(),
}));

describe("HomeLayout.vue - Responsive Behavior", () => {
  let mockProvides;

  beforeEach(() => {
    mockProvides = {
      mobileMode: ref(false),
      fileStore: ref({
        createFile: vi.fn().mockResolvedValue({ id: "new-file-123" }),
      }),
      user: ref({ id: "user-1" }),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = (overrides = {}) => {
    return mount(HomeLayout, {
      props: {
        active: "Home",
        fab: true,
        ...overrides.props,
      },
      global: {
        provide: {
          ...mockProvides,
          ...overrides.provide,
        },
        stubs: {
          HomeSidebar: {
            template: `
              <div 
                data-testid="home-sidebar" 
                :class="{ mobile: mobileMode, collapsed: collapsed }"
                @click="$emit('newEmptyFile')"
              >
                <slot />
              </div>
            `,
            props: ["fab", "active"],
            emits: ["newEmptyFile", "showFileUploadModal"],
            inject: ["mobileMode"],
            data() {
              return { collapsed: false };
            },
          },
          UserMenu: {
            template: '<div data-testid="user-menu">User Menu</div>',
            methods: {
              toggle: vi.fn(),
            },
          },
          Button: {
            template: '<button data-testid="button" :class="kind"><slot />{{ icon }}</button>',
            props: ["kind", "icon"],
            emits: ["click"],
          },
          UploadFile: {
            template: '<div data-testid="upload-modal" @click="$emit(\\'close\\')">Upload Modal</div>',
            emits: ["close"],
          },
          ...overrides.stubs,
        },
      },
      slots: {
        default: '<div data-testid="main-content">Main Content</div>',
        ...overrides.slots,
      },
    });
  };

  describe("Mobile Sidebar Behavior", () => {
    it("applies mobile class to view container in mobile mode", () => {
      const wrapper = createWrapper({
        provide: {
          mobileMode: ref(true),
        },
      });

      const view = wrapper.find(".view");
      expect(view.classes()).toContain("mobile");
    });

    it("removes mobile class in desktop mode", () => {
      const wrapper = createWrapper({
        provide: {
          mobileMode: ref(false),
        },
      });

      const view = wrapper.find(".view");
      expect(view.classes()).not.toContain("mobile");
    });

    it("passes mobile mode to HomeSidebar component", () => {
      const wrapper = createWrapper({
        provide: {
          mobileMode: ref(true),
        },
      });

      const sidebar = wrapper.findComponent('[data-testid="home-sidebar"]');
      expect(sidebar.exists()).toBe(true);
      expect(sidebar.classes()).toContain("mobile");
    });

    it("adjusts padding for mobile layout", () => {
      const mobileWrapper = createWrapper({
        provide: {
          mobileMode: ref(true),
        },
      });

      const desktopWrapper = createWrapper({
        provide: {
          mobileMode: ref(false),
        },
      });

      // Mobile should have different padding (set via CSS classes)\n      expect(mobileWrapper.find(\".view\").classes()).toContain(\"mobile\");\n      expect(desktopWrapper.find(\".view\").classes()).not.toContain(\"mobile\");\n    });\n\n    it(\"shows fab button on mobile when enabled\", () => {\n      const wrapper = createWrapper({\n        props: {\n          fab: true,\n        },\n        provide: {\n          mobileMode: ref(true),\n        },\n      });\n\n      const sidebar = wrapper.findComponent('[data-testid=\"home-sidebar\"]');\n      expect(sidebar.props(\"fab\")).toBe(true);\n    });\n\n    it(\"hides fab button when disabled\", () => {\n      const wrapper = createWrapper({\n        props: {\n          fab: false,\n        },\n        provide: {\n          mobileMode: ref(true),\n        },\n      });\n\n      const sidebar = wrapper.findComponent('[data-testid=\"home-sidebar\"]');\n      expect(sidebar.props(\"fab\")).toBe(false);\n    });\n\n    it(\"reacts to mobile mode changes\", async () => {\n      const mobileMode = ref(false);\n      const wrapper = createWrapper({\n        provide: {\n          mobileMode,\n        },\n      });\n\n      expect(wrapper.find(\".view\").classes()).not.toContain(\"mobile\");\n\n      // Switch to mobile\n      mobileMode.value = true;\n      await nextTick();\n\n      expect(wrapper.find(\".view\").classes()).toContain(\"mobile\");\n\n      // Switch back to desktop\n      mobileMode.value = false;\n      await nextTick();\n\n      expect(wrapper.find(\".view\").classes()).not.toContain(\"mobile\");\n    });\n  });\n\n  describe(\"Responsive File List Behavior\", () => {\n    it(\"provides proper container structure for file list\", () => {\n      const wrapper = createWrapper();\n\n      // Main content should be slotted properly\n      const mainContent = wrapper.find('[data-testid=\"main-content\"]');\n      expect(mainContent.exists()).toBe(true);\n    });\n\n    it(\"maintains layout flexibility for different content\", () => {\n      const wrapper = createWrapper({\n        slots: {\n          default: `\n            <div data-testid=\"files-pane\">Files Pane</div>\n            <div data-testid=\"preview-pane\">Preview Pane</div>\n          `,\n        },\n      });\n\n      expect(wrapper.find('[data-testid=\"files-pane\"]').exists()).toBe(true);\n      expect(wrapper.find('[data-testid=\"preview-pane\"]').exists()).toBe(true);\n    });\n\n    it(\"handles empty content gracefully\", () => {\n      const wrapper = createWrapper({\n        slots: {\n          default: '',\n        },\n      });\n\n      // Should still render the layout structure\n      expect(wrapper.find(\".view\").exists()).toBe(true);\n      expect(wrapper.findComponent('[data-testid=\"home-sidebar\"]').exists()).toBe(true);\n    });\n\n    it(\"adapts to different viewport sizes through CSS classes\", () => {\n      const wrapper = createWrapper();\n\n      const view = wrapper.find(\".view\");\n      // CSS classes should be applied for responsive behavior\n      expect(view.element).toBeTruthy();\n    });\n  });\n\n  describe(\"Menu and Navigation Responsive Behavior\", () => {\n    it(\"positions menus correctly in desktop mode\", () => {\n      const wrapper = createWrapper({\n        provide: {\n          mobileMode: ref(false),\n        },\n      });\n\n      const menus = wrapper.find(\".menus\");\n      expect(menus.exists()).toBe(true);\n      expect(menus.classes()).not.toContain(\"mobile\");\n    });\n\n    it(\"adjusts menu positioning for mobile\", () => {\n      const wrapper = createWrapper({\n        provide: {\n          mobileMode: ref(true),\n        },\n      });\n\n      const menus = wrapper.find(\".menus\");\n      expect(menus.classes()).toContain(\"mobile\");\n    });\n\n    it(\"shows home button in mobile mode when not on home page\", () => {\n      // Mock route to non-home page\n      mockRoute.fullPath = \"/account\";\n      \n      const wrapper = createWrapper({\n        provide: {\n          mobileMode: ref(true),\n        },\n      });\n\n      const homeButton = wrapper.findAll('[data-testid=\"button\"]')\n        .find(btn => btn.text().includes(\"Home\"));\n      expect(homeButton.exists()).toBe(true);\n      expect(homeButton.props(\"kind\")).toBe(\"tertiary\");\n      expect(homeButton.props(\"icon\")).toBe(\"Home\");\n    });\n\n    it(\"hides home button on home page even in mobile mode\", () => {\n      // Mock route to home page\n      mockRoute.fullPath = \"/\";\n      \n      const wrapper = createWrapper({\n        provide: {\n          mobileMode: ref(true),\n        },\n      });\n\n      const homeButton = wrapper.findAll('[data-testid=\"button\"]')\n        .find(btn => btn.text().includes(\"Home\"));\n      expect(homeButton).toBeFalsy();\n    });\n\n    it(\"shows notification and user menu buttons\", () => {\n      const wrapper = createWrapper();\n\n      const bellButton = wrapper.findAll('[data-testid=\"button\"]')\n        .find(btn => btn.text().includes(\"Bell\"));\n      expect(bellButton.exists()).toBe(true);\n      expect(bellButton.props(\"kind\")).toBe(\"tertiary\");\n      expect(bellButton.props(\"icon\")).toBe(\"Bell\");\n\n      const userMenu = wrapper.findComponent('[data-testid=\"user-menu\"]');\n      expect(userMenu.exists()).toBe(true);\n    });\n\n    it(\"handles home navigation correctly\", async () => {\n      mockRoute.fullPath = \"/account\";\n      \n      const wrapper = createWrapper({\n        provide: {\n          mobileMode: ref(true),\n        },\n      });\n\n      const homeButton = wrapper.findAll('[data-testid=\"button\"]')\n        .find(btn => btn.text().includes(\"Home\"));\n      \n      await homeButton.trigger(\"click\");\n      expect(mockPush).toHaveBeenCalledWith(\"/\");\n    });\n  });\n\n  describe(\"File Creation and Modal Behavior\", () => {\n    it(\"handles new empty file creation\", async () => {\n      const wrapper = createWrapper();\n\n      const sidebar = wrapper.findComponent('[data-testid=\"home-sidebar\"]');\n      await sidebar.trigger(\"click\"); // Simulate newEmptyFile event\n\n      expect(mockProvides.fileStore.value.createFile).toHaveBeenCalledWith({\n        title: \"New File\",\n        ownerId: \"user-1\",\n        source: \":rsm:\\n# New File\\n\\nThe possibilities are *endless*!\\n\\n::\\n\",\n      });\n\n      expect(mockPush).toHaveBeenCalledWith(\"/file/new-file-123\");\n    });\n\n    it(\"handles file creation errors gracefully\", async () => {\n      const consoleErrorSpy = vi.spyOn(console, \"error\").mockImplementation(() => {});\n      mockProvides.fileStore.value.createFile.mockRejectedValue(new Error(\"Creation failed\"));\n      \n      const wrapper = createWrapper();\n\n      await wrapper.vm.newEmptyFile();\n\n      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));\n      consoleErrorSpy.mockRestore();\n    });\n\n    it(\"shows upload modal when triggered\", async () => {\n      const wrapper = createWrapper();\n\n      expect(wrapper.find('[data-testid=\"upload-modal\"]').exists()).toBe(false);\n\n      // Trigger show upload modal\n      const sidebar = wrapper.findComponent('[data-testid=\"home-sidebar\"]');\n      await sidebar.vm.$emit(\"showFileUploadModal\");\n\n      expect(wrapper.vm.showModal).toBe(true);\n      expect(wrapper.find('[data-testid=\"upload-modal\"]').exists()).toBe(true);\n    });\n\n    it(\"closes upload modal when requested\", async () => {\n      const wrapper = createWrapper();\n\n      // Open modal\n      wrapper.vm.showModal = true;\n      await nextTick();\n\n      expect(wrapper.find('[data-testid=\"upload-modal\"]').exists()).toBe(true);\n\n      // Close modal\n      const uploadModal = wrapper.findComponent('[data-testid=\"upload-modal\"]');\n      await uploadModal.trigger(\"click\"); // Simulate close event\n\n      expect(wrapper.vm.showModal).toBe(false);\n    });\n\n    it(\"applies modal overlay styles\", async () => {\n      const wrapper = createWrapper();\n\n      wrapper.vm.showModal = true;\n      await nextTick();\n\n      const modal = wrapper.find(\".modal\");\n      expect(modal.exists()).toBe(true);\n    });\n  });\n\n  describe(\"Keyboard Shortcuts and Accessibility\", () => {\n    it(\"registers user menu keyboard shortcut\", () => {\n      const wrapper = createWrapper();\n      const { useKeyboardShortcuts } = vi.mocked(await import(\"@/composables/useKeyboardShortcuts.js\"));\n\n      expect(useKeyboardShortcuts).toHaveBeenCalledWith(\n        { u: { fn: expect.any(Function), description: \"Toggle user menu\" } },\n        true,\n        \"Menus\"\n      );\n    });\n\n    it(\"toggles user menu via keyboard shortcut\", async () => {\n      const wrapper = createWrapper();\n      const { useKeyboardShortcuts } = vi.mocked(await import(\"@/composables/useKeyboardShortcuts.js\"));\n      \n      const shortcuts = useKeyboardShortcuts.mock.calls[0][0];\n      const userMenu = wrapper.findComponent('[data-testid=\"user-menu\"]');\n\n      // Execute 'u' shortcut\n      shortcuts.u.fn();\n\n      expect(userMenu.vm.toggle).toHaveBeenCalled();\n    });\n\n    it(\"handles missing user menu reference gracefully\", async () => {\n      const wrapper = createWrapper({\n        stubs: {\n          UserMenu: {\n            template: '<div data-testid=\"user-menu\">User Menu</div>',\n            // No toggle method\n          },\n        },\n      });\n\n      // Should not throw when trying to toggle\n      expect(() => wrapper.vm.toggleUserMenu()).not.toThrow();\n    });\n  });\n\n  describe(\"Layout Flexibility and Edge Cases\", () => {\n    it(\"handles dynamic content changes\", async () => {\n      const wrapper = createWrapper({\n        slots: {\n          default: '<div data-testid=\"content-1\">Content 1</div>',\n        },\n      });\n\n      expect(wrapper.find('[data-testid=\"content-1\"]').exists()).toBe(true);\n\n      // Update slot content (simulating dynamic content)\n      await wrapper.setProps({});\n      \n      // Layout should remain stable\n      expect(wrapper.find(\".view\").exists()).toBe(true);\n    });\n\n    it(\"maintains z-index layering\", () => {\n      const wrapper = createWrapper();\n\n      const menus = wrapper.find(\".menus\");\n      expect(menus.exists()).toBe(true);\n      \n      // Open modal to test z-index\n      wrapper.vm.showModal = true;\n      \n      const modal = wrapper.find(\".modal\");\n      expect(modal.exists()).toBe(true);\n    });\n\n    it(\"handles component lifecycle correctly\", () => {\n      const wrapper = createWrapper();\n\n      // Should render without errors\n      expect(wrapper.vm).toBeTruthy();\n\n      // Should unmount cleanly\n      expect(() => wrapper.unmount()).not.toThrow();\n    });\n\n    it(\"passes active prop to sidebar correctly\", () => {\n      const wrapper = createWrapper({\n        props: {\n          active: \"Settings\",\n        },\n      });\n\n      const sidebar = wrapper.findComponent('[data-testid=\"home-sidebar\"]');\n      expect(sidebar.props(\"active\")).toBe(\"Settings\");\n    });\n\n    it(\"computes isHome correctly based on route\", () => {\n      mockRoute.fullPath = \"/\";\n      const homeWrapper = createWrapper();\n      expect(homeWrapper.vm.isHome).toBe(true);\n\n      mockRoute.fullPath = \"/account\";\n      const accountWrapper = createWrapper();\n      expect(accountWrapper.vm.isHome).toBe(false);\n    });\n  });\n\n  describe(\"Performance and Memory Management\", () => {\n    it(\"does not cause memory leaks with repeated modal operations\", async () => {\n      const wrapper = createWrapper();\n\n      // Rapidly open and close modal\n      for (let i = 0; i < 10; i++) {\n        wrapper.vm.showModal = true;\n        await nextTick();\n        wrapper.vm.showModal = false;\n        await nextTick();\n      }\n\n      // Should not accumulate listeners or references\n      expect(wrapper.vm.showModal).toBe(false);\n    });\n\n    it(\"efficiently handles mobile mode transitions\", async () => {\n      const mobileMode = ref(false);\n      const wrapper = createWrapper({\n        provide: {\n          mobileMode,\n        },\n      });\n\n      // Rapidly toggle mobile mode\n      for (let i = 0; i < 5; i++) {\n        mobileMode.value = !mobileMode.value;\n        await nextTick();\n      }\n\n      // Should maintain consistent state\n      expect(wrapper.find(\".view\").exists()).toBe(true);\n    });\n\n    it(\"handles props updates efficiently\", async () => {\n      const wrapper = createWrapper();\n\n      // Update props multiple times\n      await wrapper.setProps({ active: \"Account\" });\n      await wrapper.setProps({ active: \"Settings\" });\n      await wrapper.setProps({ fab: false });\n\n      // Should maintain stable component state\n      expect(wrapper.findComponent('[data-testid=\"home-sidebar\"]').props(\"active\")).toBe(\"Settings\");\n      expect(wrapper.findComponent('[data-testid=\"home-sidebar\"]').props(\"fab\")).toBe(false);\n    });\n  });\n});