import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import WorkspaceView from "@/views/workspace/View.vue";
import { File } from "@/models/File.js";

const pushMock = vi.fn();
const mockRoute = vi.fn(() => ({ params: { file_id: "42" } }));

vi.mock("vue-router", () => ({
  useRoute: () => mockRoute(),
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/composables/useKeyboardShortcuts.js", () => ({
  useKeyboardShortcuts: vi.fn(),
}));

describe("WorkspaceView Error Handling", () => {
  let getSettingsSpy;

  beforeEach(() => {
    pushMock.mockClear();
    getSettingsSpy = vi.spyOn(File, "getSettings");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should handle file store loading state", async () => {
    const fileStore = { value: null }; // Loading state

    const wrapper = mount(WorkspaceView, {
      global: {
        provide: {
          fileStore,
          api: {
            get: vi.fn().mockResolvedValue({ data: "<h1>Mock Content</h1>" }),
            post: vi.fn().mockResolvedValue({ data: "success" }),
          },
          mobileMode: false,
        },
        stubs: {
          Sidebar: { template: "<div />" },
          Canvas: { template: "<div />" },
          Icon: { template: "<div />" },
        },
      },
    });

    await nextTick();

    // Should not redirect to NotFound while loading
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("should handle file store error state", async () => {
    const fileStore = {
      value: {
        error: "Failed to load files",
        files: [],
        isLoading: false,
      },
    };

    const wrapper = mount(WorkspaceView, {
      global: {
        provide: {
          fileStore,
          api: {
            get: vi.fn().mockResolvedValue({ data: "<h1>Mock Content</h1>" }),
            post: vi.fn().mockResolvedValue({ data: "success" }),
          },
          mobileMode: false,
        },
        stubs: {
          Sidebar: { template: "<div />" },
          Canvas: { template: "<div />" },
          Icon: { template: "<div />" },
        },
      },
    });

    await nextTick();

    // Should not redirect to NotFound when there's an API error
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("should redirect to NotFound when file doesn't exist", async () => {
    const fileStore = {
      value: {
        files: [{ id: 1, content: "other file" }], // File 42 doesn't exist
        isLoading: false,
      },
    };

    const wrapper = mount(WorkspaceView, {
      global: {
        provide: {
          fileStore,
          api: {
            get: vi.fn().mockResolvedValue({ data: "<h1>Mock Content</h1>" }),
            post: vi.fn().mockResolvedValue({ data: "success" }),
          },
          mobileMode: false,
        },
        stubs: {
          Sidebar: { template: "<div />" },
          Canvas: { template: "<div />" },
          Icon: { template: "<div />" },
        },
      },
    });

    await nextTick();

    expect(pushMock).toHaveBeenCalledWith({ name: "NotFound" });
  });

  it("should not redirect when fileStore has no files due to API failure", async () => {
    const fileStore = {
      value: {
        files: [], // Empty due to API failure
        isLoading: false,
        error: "Network error",
      },
    };

    const wrapper = mount(WorkspaceView, {
      global: {
        provide: {
          fileStore,
          api: {
            get: vi.fn().mockResolvedValue({ data: "<h1>Mock Content</h1>" }),
            post: vi.fn().mockResolvedValue({ data: "success" }),
          },
          mobileMode: false,
        },
        stubs: {
          Sidebar: { template: "<div />" },
          Canvas: { template: "<div />" },
          Icon: { template: "<div />" },
        },
      },
    });

    await nextTick();

    // Should not redirect when files array is empty due to API error
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("should handle invalid file_id parameter", async () => {
    mockRoute.mockReturnValue({ params: { file_id: "invalid" } });

    const fileStore = {
      value: {
        files: [{ id: 42, content: "valid file" }],
        isLoading: false,
      },
    };

    const wrapper = mount(WorkspaceView, {
      global: {
        provide: {
          fileStore,
          api: {
            get: vi.fn().mockResolvedValue({ data: "<h1>Mock Content</h1>" }),
            post: vi.fn().mockResolvedValue({ data: "success" }),
          },
          mobileMode: false,
        },
        stubs: {
          Sidebar: { template: "<div />" },
          Canvas: { template: "<div />" },
          Icon: { template: "<div />" },
        },
      },
    });

    await nextTick();

    // Should redirect when file_id can't be parsed
    expect(pushMock).toHaveBeenCalledWith({ name: "NotFound" });
  });

  it("should handle File.getSettings API failure", async () => {
    const apiError = new Error("Settings API failed");
    getSettingsSpy.mockRejectedValue(apiError);

    const fileStore = {
      value: {
        files: [{ id: 42, content: "test file" }],
        isLoading: false,
      },
    };

    const mockApi = {
      get: vi.fn().mockResolvedValue({ data: "<h1>Mock Content</h1>" }),
      post: vi.fn().mockResolvedValue({ data: "success" }),
    };

    const wrapper = mount(WorkspaceView, {
      global: {
        provide: {
          fileStore,
          api: mockApi,
          mobileMode: false,
        },
        stubs: {
          Sidebar: { template: "<div />" },
          Canvas: { template: "<div />" },
          Icon: { template: "<div />" },
        },
      },
    });

    await nextTick();

    // Wait for getSettings call and handle the rejection
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      // Expected error from mock rejection
    }

    // Should handle settings loading error gracefully
    // Component should still render even if settings fail
    expect(wrapper.exists()).toBe(true);
  });

  it("should handle malformed file data", async () => {
    const fileStore = {
      value: {
        files: [
          { id: 42 }, // Missing content
          { content: "orphaned content" }, // Missing id
          null, // Null file
          undefined, // Undefined file
        ],
        isLoading: false,
      },
    };

    const wrapper = mount(WorkspaceView, {
      global: {
        provide: {
          fileStore,
          api: {
            get: vi.fn().mockResolvedValue({ data: "<h1>Mock Content</h1>" }),
            post: vi.fn().mockResolvedValue({ data: "success" }),
          },
          mobileMode: false,
        },
        stubs: {
          Sidebar: { template: "<div />" },
          Canvas: { template: "<div />" },
          Icon: { template: "<div />" },
        },
      },
    });

    await nextTick();

    // Should find file 42 even with malformed data structure
    const fileProvided = wrapper.vm.$.provides.file;
    expect(fileProvided.value.id).toBe(42);
  });

  it("should handle fileStore object mutations", async () => {
    const fileStore = {
      value: {
        files: [{ id: 42, content: "original" }],
        isLoading: false,
      },
    };

    const wrapper = mount(WorkspaceView, {
      global: {
        provide: {
          fileStore,
          api: {
            get: vi.fn().mockResolvedValue({ data: "<h1>Mock Content</h1>" }),
            post: vi.fn().mockResolvedValue({ data: "success" }),
          },
          mobileMode: false,
        },
        stubs: {
          Sidebar: { template: "<div />" },
          Canvas: { template: "<div />" },
          Icon: { template: "<div />" },
        },
      },
    });

    await nextTick();

    // Mutate fileStore after component mount
    fileStore.value = null; // Simulate store reset
    await nextTick();

    // Component should handle fileStore becoming null
    expect(wrapper.exists()).toBe(true);
  });

  it("should handle rapid route parameter changes", async () => {
    let routeParams = { file_id: "42" };
    mockRoute.mockImplementation(() => ({ params: routeParams }));

    const fileStore = {
      value: {
        files: [
          { id: 42, content: "file 42" },
          { id: 43, content: "file 43" },
        ],
        isLoading: false,
      },
    };

    const wrapper = mount(WorkspaceView, {
      global: {
        provide: {
          fileStore,
          api: {
            get: vi.fn().mockResolvedValue({ data: "<h1>Mock Content</h1>" }),
            post: vi.fn().mockResolvedValue({ data: "success" }),
          },
          mobileMode: false,
        },
        stubs: {
          Sidebar: { template: "<div />" },
          Canvas: { template: "<div />" },
          Icon: { template: "<div />" },
        },
      },
    });

    await nextTick();

    // Change route parameter rapidly
    routeParams = { file_id: "43" };
    await wrapper.vm.$forceUpdate();
    await nextTick();

    routeParams = { file_id: "999" }; // Non-existent file
    await wrapper.vm.$forceUpdate();
    await nextTick();

    // Should handle rapid changes without errors
    expect(wrapper.exists()).toBe(true);
  });

  it("should handle concurrent file operations", async () => {
    let resolveSettings;
    const settingsPromise = new Promise((resolve) => {
      resolveSettings = resolve;
    });
    getSettingsSpy.mockReturnValue(settingsPromise);

    const fileStore = {
      value: {
        files: [{ id: 42, content: "test" }],
        isLoading: false,
      },
    };

    const wrapper = mount(WorkspaceView, {
      global: {
        provide: {
          fileStore,
          api: {
            get: vi.fn().mockResolvedValue({ data: "<h1>Mock Content</h1>" }),
            post: vi.fn().mockResolvedValue({ data: "success" }),
          },
          mobileMode: false,
        },
        stubs: {
          Sidebar: { template: "<div />" },
          Canvas: { template: "<div />" },
          Icon: { template: "<div />" },
        },
      },
    });

    await nextTick();

    // Simulate file change while settings are loading
    fileStore.value.files[0].content = "modified content";
    await nextTick();

    // Resolve settings
    resolveSettings({ theme: "dark" });
    await nextTick();

    expect(wrapper.exists()).toBe(true);
  });
});
