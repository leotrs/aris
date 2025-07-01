import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import BehaviorView from "@/views/settings/BehaviorView.vue";

describe("BehaviorView", () => {
  let wrapper;
  const mockApi = {
    get: vi.fn().mockResolvedValue({
      data: {
        autoSaveInterval: 30,
        focusModeAutoHide: true,
        sidebarAutoCollapse: false,
        drawerDefaultAnnotations: false,
        drawerDefaultMargins: false,
        drawerDefaultSettings: false,
        soundNotifications: true,
        autoCompileDelay: 1000,
        mobileMenuBehavior: "standard",
      },
    }),
    post: vi.fn().mockResolvedValue({}),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    wrapper = mount(BehaviorView, {
      global: {
        provide: {
          api: mockApi,
        },
        components: {
          Pane: {
            name: "Pane",
            template: '<div data-testid="pane"><slot name="header" /><slot /></div>',
          },
          Section: {
            name: "Section",
            template:
              '<div data-testid="section"><slot name="title" /><slot name="content" /></div>',
          },
          Checkbox: {
            name: "Checkbox",
            props: ["modelValue", "id"],
            template:
              '<label><input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', $event.target.checked)" /><slot /></label>',
            emits: ["update:modelValue"],
          },
          IconSettings2: {
            name: "IconSettings2",
            template: '<div data-testid="icon-settings2" />',
          },
        },
      },
    });
  });

  describe("Component Rendering", () => {
    it("renders the main pane", () => {
      expect(wrapper.find('[data-testid="pane"]').exists()).toBe(true);
    });

    it("renders the header with icon and title", () => {
      expect(wrapper.find('[data-testid="icon-settings2"]').exists()).toBe(true);
      expect(wrapper.text()).toContain("Behavior");
    });

    it("renders all settings sections", () => {
      const sections = wrapper.findAll('[data-testid="section"]');
      expect(sections.length).toBeGreaterThanOrEqual(5);

      // Check for expected section titles
      expect(wrapper.text()).toContain("Auto-save & Performance");
      expect(wrapper.text()).toContain("Focus Mode");
      expect(wrapper.text()).toContain("Interface Layout");
      expect(wrapper.text()).toContain("Drawer Defaults");
      expect(wrapper.text()).toContain("Audio & Mobile");
    });
  });

  describe("Settings Form Elements", () => {
    it("renders auto-save interval select", () => {
      const autoSaveSelect = wrapper.find("#auto-save-interval");
      expect(autoSaveSelect.exists()).toBe(true);
      expect(autoSaveSelect.element.value).toBe("30");

      const options = autoSaveSelect.findAll("option");
      expect(options.length).toBe(4);
      expect(options[0].text()).toBe("10 seconds");
      expect(options[1].text()).toBe("30 seconds");
      expect(options[2].text()).toBe("1 minute");
      expect(options[3].text()).toBe("5 minutes");
    });

    it("renders auto-compile delay select", () => {
      const autoCompileSelect = wrapper.find("#auto-compile-delay");
      expect(autoCompileSelect.exists()).toBe(true);
      expect(autoCompileSelect.element.value).toBe("1000");

      const options = autoCompileSelect.findAll("option");
      expect(options.length).toBe(4);
      expect(options[0].text()).toBe("500ms");
      expect(options[1].text()).toBe("1 second");
      expect(options[2].text()).toBe("2 seconds");
      expect(options[3].text()).toBe("5 seconds");
    });

    it("renders mobile menu behavior select", () => {
      const mobileMenuSelect = wrapper.find("#mobile-menu-behavior");
      expect(mobileMenuSelect.exists()).toBe(true);
      expect(mobileMenuSelect.element.value).toBe("standard");

      const options = mobileMenuSelect.findAll("option");
      expect(options.length).toBe(3);
      expect(options[0].text()).toBe("Standard");
      expect(options[1].text()).toBe("Compact");
      expect(options[2].text()).toBe("Minimal");
    });
  });

  describe("Checkbox Settings", () => {
    it("renders focus mode auto-hide checkbox", () => {
      const checkbox = wrapper.findComponent({ name: "Checkbox" });
      expect(checkbox.exists()).toBe(true);
      expect(checkbox.props("id")).toBe("focus-mode-auto-hide");
    });

    it("renders all drawer default checkboxes", () => {
      const checkboxes = wrapper.findAllComponents({ name: "Checkbox" });
      const drawerCheckboxes = checkboxes.filter((checkbox) =>
        checkbox.props("id")?.includes("drawer")
      );
      expect(drawerCheckboxes.length).toBe(3);

      expect(wrapper.text()).toContain("Open annotations drawer by default");
      expect(wrapper.text()).toContain("Open margins drawer by default");
      expect(wrapper.text()).toContain("Open settings drawer by default");
    });

    it("renders sidebar auto-collapse checkbox", () => {
      expect(wrapper.text()).toContain("Auto-collapse sidebar");
    });

    it("renders sound notifications checkbox", () => {
      expect(wrapper.text()).toContain("Enable sound notifications");
    });
  });

  describe("Settings Loading", () => {
    it("loads settings from API on mount", async () => {
      await wrapper.vm.$nextTick();

      expect(mockApi.get).toHaveBeenCalledWith("/user-settings");
      expect(wrapper.vm.settings.autoSaveInterval).toBe(30);
      expect(wrapper.vm.settings.focusModeAutoHide).toBe(true);
      expect(wrapper.vm.settings.sidebarAutoCollapse).toBe(false);
    });

    it("handles settings load errors", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockApi.get.mockRejectedValue(new Error("Load failed"));

      const errorWrapper = mount(BehaviorView, {
        global: {
          provide: { api: mockApi },
          components: {
            Pane: { template: "<div><slot /></div>" },
            Section: { template: '<div><slot name="content" /></div>' },
            Checkbox: { template: "<div />" },
            IconSettings2: { template: "<div />" },
          },
        },
      });

      await errorWrapper.vm.$nextTick();

      expect(consoleSpy).toHaveBeenCalledWith("Failed to load user settings:", expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe("Settings Saving", () => {
    it("saves settings when save button clicked", async () => {
      await wrapper.vm.$nextTick();

      const saveButton = wrapper.find(".save-button");
      expect(saveButton.exists()).toBe(true);

      await saveButton.trigger("click");

      expect(mockApi.post).toHaveBeenCalledWith("/user-settings", wrapper.vm.settings);
    });

    it("shows loading state during save", async () => {
      await wrapper.vm.$nextTick();

      // Mock delayed save
      mockApi.post.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      const saveButton = wrapper.find(".save-button");
      await saveButton.trigger("click");

      expect(wrapper.vm.loading).toBe(true);
      expect(saveButton.text()).toBe("Saving...");
      expect(saveButton.element.disabled).toBe(true);
    });

    it("shows saved state after successful save", async () => {
      await wrapper.vm.$nextTick();

      const saveButton = wrapper.find(".save-button");
      await saveButton.trigger("click");

      expect(wrapper.vm.saved).toBe(true);
      expect(saveButton.text()).toBe("Saved!");
      expect(saveButton.classes()).toContain("saved");

      // Should auto-reset after timeout
      setTimeout(() => {
        expect(wrapper.vm.saved).toBe(false);
      }, 2100);
    });

    it("handles save errors", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockApi.post.mockRejectedValue(new Error("Save failed"));

      await wrapper.vm.$nextTick();

      const saveButton = wrapper.find(".save-button");
      await saveButton.trigger("click");

      expect(wrapper.vm.loading).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith("Failed to save user settings:", expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe("Form Interactions", () => {
    it("updates settings when select values change", async () => {
      await wrapper.vm.$nextTick();

      const autoSaveSelect = wrapper.find("#auto-save-interval");
      await autoSaveSelect.setValue("60");

      expect(wrapper.vm.settings.autoSaveInterval).toBe(60);
    });

    it("updates settings when checkbox values change", async () => {
      await wrapper.vm.$nextTick();

      const checkbox = wrapper.findComponent({ name: "Checkbox" });
      await checkbox.vm.$emit("update:modelValue", false);

      expect(wrapper.vm.settings.focusModeAutoHide).toBe(false);
    });
  });

  describe("Accessibility", () => {
    it("has proper form labels", () => {
      expect(wrapper.find('label[for="auto-save-interval"]').exists()).toBe(true);
      expect(wrapper.find('label[for="auto-compile-delay"]').exists()).toBe(true);
      expect(wrapper.find('label[for="mobile-menu-behavior"]').exists()).toBe(true);
    });

    it("has descriptive text for settings", () => {
      expect(wrapper.text()).toContain("Automatically hide UI elements in focus mode");
      expect(wrapper.text()).toContain("Play audio feedback for actions and notifications");
      expect(wrapper.text()).toContain("Set the default open/closed state for workspace drawers");
    });
  });

  describe("Component State", () => {
    it("initializes with default settings", () => {
      expect(wrapper.vm.settings.autoSaveInterval).toBe(30);
      expect(wrapper.vm.settings.focusModeAutoHide).toBe(true);
      expect(wrapper.vm.settings.soundNotifications).toBe(true);
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.vm.saved).toBe(false);
    });

    it("handles reactive settings updates", async () => {
      await wrapper.vm.$nextTick();

      wrapper.vm.settings.autoSaveInterval = 60;
      await wrapper.vm.$nextTick();

      const autoSaveSelect = wrapper.find("#auto-save-interval");
      expect(autoSaveSelect.element.value).toBe("60");
    });
  });
});
