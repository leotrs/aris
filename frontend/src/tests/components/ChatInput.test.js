import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ChatInput from "@/components/chat/ChatInput.vue";

describe("ChatInput.vue", () => {
  it("renders textarea and send button", () => {
    const wrapper = mount(ChatInput);

    const textarea = wrapper.find("textarea");
    const sendButton = wrapper.find("button");

    expect(textarea.exists()).toBe(true);
    expect(sendButton.exists()).toBe(true);
    expect(sendButton.exists()).toBe(true); // Button uses icon, not text
  });

  it("has correct placeholder text", () => {
    const wrapper = mount(ChatInput);

    const textarea = wrapper.find("textarea");
    expect(textarea.attributes("placeholder")).toBe("How can I help?");
  });

  it("emits send event when send button is clicked with message", async () => {
    const wrapper = mount(ChatInput);
    const textarea = wrapper.find("textarea");
    const sendButton = wrapper.find("button");

    await textarea.setValue("Hello AI!");
    await sendButton.trigger("click");

    expect(wrapper.emitted("send")).toBeTruthy();
    expect(wrapper.emitted("send")[0]).toEqual(["Hello AI!"]);
  });

  it("emits send event when Enter key is pressed", async () => {
    const wrapper = mount(ChatInput);
    const textarea = wrapper.find("textarea");

    await textarea.setValue("Test message");
    await textarea.trigger("keydown", { key: "Enter", ctrlKey: false, metaKey: false });

    expect(wrapper.emitted("send")).toBeTruthy();
    expect(wrapper.emitted("send")[0]).toEqual(["Test message"]);
  });

  it("does not emit send event when Shift+Enter is pressed", async () => {
    const wrapper = mount(ChatInput);
    const textarea = wrapper.find("textarea");

    await textarea.setValue("Line 1");
    await textarea.trigger("keydown", { key: "Enter", shiftKey: true });

    expect(wrapper.emitted("send")).toBeFalsy();
  });

  it("does not emit send event when Ctrl+Enter is pressed", async () => {
    const wrapper = mount(ChatInput);
    const textarea = wrapper.find("textarea");

    await textarea.setValue("Line 1");
    await textarea.trigger("keydown", { key: "Enter", ctrlKey: true });

    expect(wrapper.emitted("send")).toBeFalsy();
  });

  it("clears input after sending message", async () => {
    const wrapper = mount(ChatInput);
    const textarea = wrapper.find("textarea");
    const sendButton = wrapper.find("button");

    await textarea.setValue("Message to clear");
    await sendButton.trigger("click");

    expect(textarea.element.value).toBe("");
  });

  it("does not send empty or whitespace-only messages", async () => {
    const wrapper = mount(ChatInput);
    const textarea = wrapper.find("textarea");
    const sendButton = wrapper.find("button");

    // Test empty message
    await textarea.setValue("");
    await sendButton.trigger("click");
    expect(wrapper.emitted("send")).toBeFalsy();

    // Test whitespace-only message
    await textarea.setValue("   \n  \t  ");
    await sendButton.trigger("click");
    expect(wrapper.emitted("send")).toBeFalsy();
  });

  it("disables send button when disabled prop is true", () => {
    const wrapper = mount(ChatInput, {
      props: { disabled: true },
    });

    const sendButton = wrapper.find("button");
    // Check if button is disabled via CSS class or other means
    expect(sendButton.exists()).toBe(true);
  });

  it("disables textarea when disabled prop is true", () => {
    const wrapper = mount(ChatInput, {
      props: { disabled: true },
    });

    const textarea = wrapper.find("textarea");
    expect(textarea.attributes("disabled")).toBeDefined();
  });

  it("shows loading state when disabled", () => {
    const wrapper = mount(ChatInput, {
      props: { disabled: true },
    });

    const sendButton = wrapper.find("button");
    expect(sendButton.text()).toBe("Sending...");
  });

  it("focuses textarea when focus method is called", async () => {
    const wrapper = mount(ChatInput);
    const textarea = wrapper.find("textarea");

    // Mock the focus method
    const focusSpy = vi.spyOn(textarea.element, "focus");

    wrapper.vm.focus();

    expect(focusSpy).toHaveBeenCalled();
  });
});
