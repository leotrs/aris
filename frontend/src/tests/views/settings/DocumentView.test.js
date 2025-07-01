import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import DocumentView from "@/views/settings/DocumentView.vue";

// Mock File model
const mockFile = {
  getSettings: vi.fn().mockResolvedValue({
    fontSize: 16,
    lineHeight: 1.5,
    theme: "light",
  }),
  updateDefaultSettings: vi.fn().mockResolvedValue({}),
};

vi.mock("@/models/File.js", () => ({
  File: mockFile,
}));

describe("DocumentView", () => {
  let wrapper;
  const mockUser = {
    value: {
      id: "user-123",
      name: "Test User",
      email: "test@example.com",
    },
  };

  const mockApi = {
    post: vi.fn().mockResolvedValue({
      data: "<div>Rendered HTML</div>",
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    wrapper = mount(DocumentView, {
      global: {
        provide: {
          user: mockUser,
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
          FileSettings: {
            name: "FileSettings",
            props: ["modelValue", "header"],
            template: '<div data-testid="file-settings" />',
            emits: ["save"],
            methods: {
              startReceivingUserInput: vi.fn(),
            },
          },
          ManuscriptWrapper: {
            name: "ManuscriptWrapper",
            props: ["htmlString", "keys", "settings"],
            template: '<div data-testid="manuscript-wrapper" />',
          },
          IconFileText: {
            name: "IconFileText",
            template: '<div data-testid="icon-file-text" />',
          },
          IconInfoCircle: {
            name: "IconInfoCircle",
            template: '<div data-testid="icon-info-circle" />',
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
      expect(wrapper.find('[data-testid="icon-file-text"]').exists()).toBe(true);
      expect(wrapper.text()).toContain("Document Display");
    });

    it("renders settings sections", () => {
      const sections = wrapper.findAll('[data-testid="section"]');
      expect(sections.length).toBeGreaterThanOrEqual(2);
    });

    it("renders FileSettings component", () => {
      const fileSettings = wrapper.findComponent({ name: "FileSettings" });
      expect(fileSettings.exists()).toBe(true);
      expect(fileSettings.props("header")).toBe(false);
    });

    it("renders ManuscriptWrapper for preview", () => {
      const manuscriptWrapper = wrapper.findComponent({ name: "ManuscriptWrapper" });
      expect(manuscriptWrapper.exists()).toBe(true);
      expect(manuscriptWrapper.props("keys")).toBe(false);
    });

    it("renders information section", () => {
      expect(wrapper.find('[data-testid="icon-info-circle"]').exists()).toBe(true);
      expect(wrapper.text()).toContain("These settings will be applied to");
      expect(wrapper.text()).toContain("new");
    });
  });

  describe("File Creation and Rendering", () => {
    it("creates a sample file with user information", () => {
      expect(wrapper.vm.file.title).toBe("Sample Title");
      expect(wrapper.vm.file.ownerId).toBe("user-123");
      expect(wrapper.vm.file.source).toContain("${user.value.name}");
      expect(wrapper.vm.file.source).toContain("${user.value.email}");
    });

    it("renders the file content on mount", async () => {
      await wrapper.vm.$nextTick();

      expect(mockApi.post).toHaveBeenCalledWith("render", {
        source: expect.stringContaining("# File Settings Preview"),
      });

      expect(wrapper.vm.file.html).toBe("<div>Rendered HTML</div>");
    });

    it("passes rendered HTML to ManuscriptWrapper", async () => {
      await wrapper.vm.$nextTick();

      const manuscriptWrapper = wrapper.findComponent({ name: "ManuscriptWrapper" });
      expect(manuscriptWrapper.props("htmlString")).toBe("<div>Rendered HTML</div>");
    });
  });

  describe("Settings Management", () => {
    it("loads default settings on mount", async () => {
      await wrapper.vm.$nextTick();

      expect(mockFile.getSettings).toHaveBeenCalledWith(wrapper.vm.file, mockApi);

      expect(wrapper.vm.defaultSettings).toEqual({
        fontSize: 16,
        lineHeight: 1.5,
        theme: "light",
      });
    });

    it("starts receiving user input after settings load", async () => {
      const fileSettings = wrapper.findComponent({ name: "FileSettings" });
      const startReceivingUserInputSpy = vi.spyOn(fileSettings.vm, "startReceivingUserInput");

      await wrapper.vm.$nextTick();

      expect(startReceivingUserInputSpy).toHaveBeenCalled();
    });

    it("passes settings to ManuscriptWrapper", async () => {
      await wrapper.vm.$nextTick();

      const manuscriptWrapper = wrapper.findComponent({ name: "ManuscriptWrapper" });
      expect(manuscriptWrapper.props("settings")).toEqual({
        fontSize: 16,
        lineHeight: 1.5,
        theme: "light",
      });
    });

    it("handles save event from FileSettings", async () => {
      const newSettings = {
        fontSize: 18,
        lineHeight: 1.6,
        theme: "dark",
      };

      const fileSettings = wrapper.findComponent({ name: "FileSettings" });
      await fileSettings.vm.$emit("save", newSettings);

      expect(mockFile.updateDefaultSettings).toHaveBeenCalledWith(newSettings, mockApi);
    });

    it("handles save errors gracefully", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockFile.updateDefaultSettings.mockRejectedValue(new Error("Save failed"));

      const fileSettings = wrapper.findComponent({ name: "FileSettings" });
      await fileSettings.vm.$emit("save", { fontSize: 18 });

      expect(consoleSpy).toHaveBeenCalledWith("Failed trying to update default settings.");
      consoleSpy.mockRestore();
    });
  });

  describe("Layout Structure", () => {
    it("has proper CSS classes for layout", () => {
      expect(wrapper.find(".settings-main").exists()).toBe(true);
      expect(wrapper.find(".settings-controls").exists()).toBe(true);
      expect(wrapper.find(".settings-preview").exists()).toBe(true);
    });

    it("shows information section styling", () => {
      expect(wrapper.find(".info").exists()).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("handles render API errors", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockApi.post.mockRejectedValue(new Error("Render failed"));

      const errorWrapper = mount(DocumentView, {
        global: {
          provide: { user: mockUser, api: mockApi },
          components: {
            Pane: { template: "<div><slot /></div>" },
            Section: { template: '<div><slot name="content" /></div>' },
            FileSettings: {
              template: "<div />",
              methods: { startReceivingUserInput: vi.fn() },
            },
            ManuscriptWrapper: { template: "<div />" },
            IconFileText: { template: "<div />" },
            IconInfoCircle: { template: "<div />" },
          },
        },
      });

      await errorWrapper.vm.$nextTick();

      // Component should still render even if render fails
      expect(errorWrapper.find('[data-testid="pane"]').exists()).toBe(true);
      consoleSpy.mockRestore();
    });

    it("handles settings load errors", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockFile.getSettings.mockRejectedValue(new Error("Settings load failed"));

      const errorWrapper = mount(DocumentView, {
        global: {
          provide: { user: mockUser, api: mockApi },
          components: {
            Pane: { template: "<div><slot /></div>" },
            Section: { template: '<div><slot name="content" /></div>' },
            FileSettings: {
              template: "<div />",
              methods: { startReceivingUserInput: vi.fn() },
            },
            ManuscriptWrapper: { template: "<div />" },
            IconFileText: { template: "<div />" },
            IconInfoCircle: { template: "<div />" },
          },
        },
      });

      await errorWrapper.vm.$nextTick();

      // Component should still render with default settings
      expect(errorWrapper.find('[data-testid="pane"]').exists()).toBe(true);
      consoleSpy.mockRestore();
    });
  });

  describe("Provide/Inject", () => {
    it("provides file to child components", () => {
      expect(wrapper.vm.file).toBeDefined();
      expect(wrapper.vm.file.title).toBe("Sample Title");
    });

    it("injects user and api correctly", () => {
      expect(wrapper.vm.user).toBe(mockUser);
      expect(wrapper.vm.api).toBe(mockApi);
    });
  });
});
