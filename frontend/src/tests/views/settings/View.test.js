import { describe, it, expect, beforeEach, vi } from "vitest";
import { ref, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import SettingsView from "@/views/settings/View.vue";
import { File } from "@/models/File.js";

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("SettingsView", () => {
  let wrapper;
  const user = ref({ id: 1, name: "Test User", email: "test@example.com" });
  const api = { post: vi.fn() };
  let getSettingsSpy;
  let updateDefaultSpy;
  let startSpy;

  beforeEach(async () => {
    api.post.mockReset().mockResolvedValue({ data: "<p>rendered HTML</p>" });
    getSettingsSpy = vi.spyOn(File, "getSettings").mockResolvedValue({ theme: "dark" });
    updateDefaultSpy = vi.spyOn(File, "updateDefaultSettings").mockResolvedValue();
    startSpy = vi.fn();
    wrapper = mount(SettingsView, {
      global: {
        components: {
          HomeLayout: { template: "<div><slot/></div>" },
          Pane: { template: "<div><slot/></div>" },
          FileSettings: {
            template: "<div/>",
            name: "FileSettings",
            props: ["modelValue", "header"],
            setup(_, { expose }) {
              expose({ startReceivingUserInput: startSpy });
              return {};
            },
          },
          IconSettings: true,
          IconInfoCircle: true,
          ManuscriptWrapper: {
            template:
              '<div class="manuscript-wrapper" :data-html-string="$attrs.htmlString"></div>',
          },
        },
        provide: { user, api },
      },
    });
    await nextTick();
    await flushPromises();
    await nextTick();
    await flushPromises();
    await nextTick();
  });

  it("fetches default settings and starts receiving user input on mount", () => {
    expect(getSettingsSpy).toHaveBeenCalledWith(wrapper.vm.file, api);
    expect(wrapper.vm.defaultSettings).toEqual({ theme: "dark" });
    expect(startSpy).toHaveBeenCalled();
  });

  it("renders FileSettings with v-model and header=false", () => {
    const fs = wrapper.findComponent({ name: "FileSettings" });
    expect(fs.exists()).toBe(true);
    expect(fs.props("modelValue")).toBe(wrapper.vm.defaultSettings);
    expect(fs.props("header")).toBe(false);
  });

  it("requests rendered HTML from API and renders ManuscriptWrapper", () => {
    expect(api.post).toHaveBeenCalledWith("render", { source: wrapper.vm.file.source });
    const mw = wrapper.find(".manuscript-wrapper");
    expect(mw.exists()).toBe(true);
  });

  it("displays informational text about default vs existing files", () => {
    const info = wrapper.find("div.info p");
    expect(info.text()).toContain("These settings will be applied to new files");
    expect(info.text()).toContain("Modify the settings of existing files by opening them");
  });

  it("onSave calls updateDefaultSettings with provided settings", async () => {
    await wrapper.vm.onSave({ newSetting: "value" });
    expect(updateDefaultSpy).toHaveBeenCalledWith({ newSetting: "value" }, api);
  });

  it("onSave logs error when updateDefaultSettings throws", async () => {
    updateDefaultSpy.mockRejectedValue(new Error("fail"));
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    await wrapper.vm.onSave({ foo: "bar" });
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed trying to update default settings.");
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    consoleErrorSpy.mockRestore();
  });
});
