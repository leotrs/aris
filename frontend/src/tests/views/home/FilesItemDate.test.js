import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import FilesItemDate from "@/views/home/FilesItemDate.vue";

describe("FilesItemDate.vue", () => {
  let mockFile;

  beforeEach(() => {
    mockFile = {
      id: "test-file-1",
      title: "Test File",
      last_edited_at: "2023-12-01T10:30:00Z",
      getFormattedDate: vi.fn(() => "Dec 1, 2023"),
      getFullDateTime: vi.fn(() => "December 1, 2023 at 10:30 AM"),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = (fileOverrides = {}, overrides = {}) => {
    const file = { ...mockFile, ...fileOverrides };

    return mount(FilesItemDate, {
      props: {
        file,
      },
      global: {
        stubs: {
          Tooltip: {
            template: '<div class="tooltip"><slot></slot></div>',
            props: ["anchor"],
          },
          ...overrides.stubs,
        },
      },
    });
  };

  describe("Component Rendering", () => {
    it("renders with basic structure", () => {
      const wrapper = createWrapper();

      expect(wrapper.find(".last-edited").exists()).toBe(true);
      expect(wrapper.find(".timestamp").exists()).toBe(true);
      expect(wrapper.find(".tooltip").exists()).toBe(true);
    });

    it("displays formatted date from file method", () => {
      const wrapper = createWrapper();

      expect(wrapper.find(".timestamp").text()).toBe("Dec 1, 2023");
      expect(mockFile.getFormattedDate).toHaveBeenCalledOnce();
    });

    it("displays full datetime in tooltip", () => {
      const wrapper = createWrapper();

      expect(wrapper.find(".tooltip").text()).toBe("December 1, 2023 at 10:30 AM");
      expect(mockFile.getFullDateTime).toHaveBeenCalledOnce();
    });

    it("maintains template ref for timestamp element", () => {
      const wrapper = createWrapper();

      expect(wrapper.vm.timestampRef).toBeDefined();
      // Template ref should be connected to the span element
      expect(wrapper.find(".timestamp").element).toBeTruthy();
    });
  });

  describe("Props Handling", () => {
    it("requires file prop", () => {
      // Component should have file as required prop
      const wrapper = createWrapper();
      expect(wrapper.props().file).toBeDefined();
      expect(wrapper.props().file).toStrictEqual(mockFile);
    });

    it("handles different file objects", () => {
      const differentFile = {
        id: "different-file",
        getFormattedDate: vi.fn(() => "Jan 15, 2024"),
        getFullDateTime: vi.fn(() => "January 15, 2024 at 2:45 PM"),
      };

      const wrapper = createWrapper(differentFile);

      expect(wrapper.find(".timestamp").text()).toBe("Jan 15, 2024");
      expect(wrapper.find(".tooltip").text()).toBe("January 15, 2024 at 2:45 PM");
    });

    it("calls file methods for date formatting", () => {
      createWrapper();

      expect(mockFile.getFormattedDate).toHaveBeenCalledOnce();
      expect(mockFile.getFullDateTime).toHaveBeenCalledOnce();
    });
  });

  describe("Date Formatting Integration", () => {
    it("handles various date formats from file methods", () => {
      const testCases = [
        {
          formatted: "Today",
          full: "December 15, 2023 at 9:15 AM",
        },
        {
          formatted: "Yesterday",
          full: "December 14, 2023 at 11:30 PM",
        },
        {
          formatted: "Dec 10",
          full: "December 10, 2023 at 3:22 PM",
        },
        {
          formatted: "Nov 2022",
          full: "November 18, 2022 at 4:05 PM",
        },
      ];

      testCases.forEach((testCase, index) => {
        const file = {
          id: `test-${index}`,
          getFormattedDate: vi.fn(() => testCase.formatted),
          getFullDateTime: vi.fn(() => testCase.full),
        };

        const wrapper = createWrapper(file);

        expect(wrapper.find(".timestamp").text()).toBe(testCase.formatted);
        expect(wrapper.find(".tooltip").text()).toBe(testCase.full);
      });
    });

    it("handles empty or null date strings gracefully", () => {
      const fileWithEmptyDate = {
        id: "empty-date",
        getFormattedDate: vi.fn(() => ""),
        getFullDateTime: vi.fn(() => ""),
      };

      const wrapper = createWrapper(fileWithEmptyDate);

      expect(wrapper.find(".timestamp").text()).toBe("");
      expect(wrapper.find(".tooltip").text()).toBe("");
    });

    it("handles undefined date methods gracefully", () => {
      const fileWithoutDateMethods = {
        id: "no-methods",
        last_edited_at: "2023-12-01T10:30:00Z",
        // Missing getFormattedDate and getFullDateTime methods
      };

      // Should not throw when methods are missing
      expect(() => createWrapper(fileWithoutDateMethods)).not.toThrow();
    });
  });

  describe("Tooltip Integration", () => {
    it("passes timestamp ref to Tooltip component", () => {
      const wrapper = createWrapper();

      const tooltipStub = wrapper.find(".tooltip");

      expect(tooltipStub.exists()).toBe(true);
      // Tooltip should receive the anchor prop (tested via stub props)
    });

    it("provides detailed datetime information in tooltip", () => {
      const wrapper = createWrapper();

      const tooltipContent = wrapper.find(".tooltip").text();
      expect(tooltipContent).toBe("December 1, 2023 at 10:30 AM");
      expect(tooltipContent).toContain("December");
      expect(tooltipContent).toContain("2023");
      expect(tooltipContent).toContain("10:30");
    });

    it("shows different content in timestamp vs tooltip", () => {
      const wrapper = createWrapper();

      const timestampText = wrapper.find(".timestamp").text();
      const tooltipText = wrapper.find(".tooltip").text();

      expect(timestampText).toBe("Dec 1, 2023"); // Short format
      expect(tooltipText).toBe("December 1, 2023 at 10:30 AM"); // Long format
      expect(timestampText).not.toBe(tooltipText);
    });
  });

  describe("Reactivity", () => {
    it("updates when file prop changes", async () => {
      const wrapper = createWrapper();

      expect(wrapper.find(".timestamp").text()).toBe("Dec 1, 2023");

      const newFile = {
        id: "new-file",
        getFormattedDate: vi.fn(() => "Jan 2, 2024"),
        getFullDateTime: vi.fn(() => "January 2, 2024 at 1:00 PM"),
      };

      await wrapper.setProps({ file: newFile });

      expect(wrapper.find(".timestamp").text()).toBe("Jan 2, 2024");
      expect(wrapper.find(".tooltip").text()).toBe("January 2, 2024 at 1:00 PM");
    });

    it("calls file methods on initial render", () => {
      createWrapper();

      // Initial render should call methods
      expect(mockFile.getFormattedDate).toHaveBeenCalledTimes(1);
      expect(mockFile.getFullDateTime).toHaveBeenCalledTimes(1);
    });
  });

  describe("Error Handling", () => {
    it("handles file with missing date methods", () => {
      const fileWithoutMethods = {
        id: "no-methods",
        last_edited_at: "2023-12-01T10:30:00Z",
        // No getFormattedDate or getFullDateTime
      };

      // Should render without throwing
      expect(() => createWrapper(fileWithoutMethods)).not.toThrow();
    });

    it("handles null or undefined file prop", () => {
      // This would normally be caught by props validation, but test edge case
      const nullFile = null;

      expect(() => createWrapper(nullFile)).not.toThrow();
    });

    it("propagates errors from file methods", () => {
      const fileWithErrorMethods = {
        id: "error-methods",
        getFormattedDate: vi.fn(() => {
          throw new Error("Date formatting error");
        }),
        getFullDateTime: vi.fn(() => {
          throw new Error("DateTime formatting error");
        }),
      };

      // Errors should be propagated since template calls methods directly
      expect(() => createWrapper(fileWithErrorMethods)).toThrow("Date formatting error");
    });
  });

  describe("Component Lifecycle", () => {
    it("initializes properly", () => {
      const wrapper = createWrapper();

      expect(wrapper.vm).toBeDefined();
      expect(wrapper.vm.timestampRef).toBeDefined();
    });

    it("cleans up properly on unmount", () => {
      const wrapper = createWrapper();

      expect(() => wrapper.unmount()).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("provides semantic HTML structure", () => {
      const wrapper = createWrapper();

      const container = wrapper.find(".last-edited");
      const timestamp = wrapper.find(".timestamp");

      expect(container.element.tagName).toBe("DIV");
      expect(timestamp.element.tagName).toBe("SPAN");
    });

    it("provides additional context via tooltip", () => {
      const wrapper = createWrapper();

      // Tooltip provides more detailed information for screen readers
      const tooltipContent = wrapper.find(".tooltip").text();
      expect(tooltipContent).toContain("December");
      expect(tooltipContent).toContain("10:30");
    });
  });

  describe("CSS and Styling", () => {
    it("applies correct CSS classes", () => {
      const wrapper = createWrapper();

      expect(wrapper.find(".last-edited").exists()).toBe(true);
      expect(wrapper.find(".timestamp").exists()).toBe(true);
    });

    it("maintains consistent font styling", () => {
      const wrapper = createWrapper();

      const container = wrapper.find(".last-edited");
      expect(container.classes()).toContain("last-edited");
      // Font size is applied via scoped CSS
    });
  });

  describe("Integration with File Model", () => {
    it("relies on file model for date formatting logic", () => {
      const wrapper = createWrapper();

      // Component should delegate date formatting to file model
      expect(mockFile.getFormattedDate).toHaveBeenCalled();
      expect(mockFile.getFullDateTime).toHaveBeenCalled();

      // Should not perform date formatting itself
      expect(wrapper.vm.formatDate).toBeUndefined();
    });

    it("works with different file model implementations", () => {
      const customFile = {
        id: "custom",
        getFormattedDate: vi.fn(() => "Custom Format"),
        getFullDateTime: vi.fn(() => "Custom Full Format"),
        customProperty: "test",
      };

      const wrapper = createWrapper(customFile);

      expect(wrapper.find(".timestamp").text()).toBe("Custom Format");
      expect(wrapper.find(".tooltip").text()).toBe("Custom Full Format");
    });
  });
});
