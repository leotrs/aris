import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ChatMessage from "@/components/chat/ChatMessage.vue";

describe("ChatMessage.vue", () => {
  it("renders user message with correct styling", () => {
    const wrapper = mount(ChatMessage, {
      props: {
        message: "Hello, can you help me?",
        role: "user",
      },
    });

    expect(wrapper.text()).toContain("Hello, can you help me?");
    expect(wrapper.classes()).toContain("chat-message");
    expect(wrapper.classes()).toContain("user");
  });

  it("renders assistant message with correct styling", () => {
    const wrapper = mount(ChatMessage, {
      props: {
        message: "Of course! I'd be happy to help.",
        role: "assistant",
      },
    });

    expect(wrapper.text()).toContain("Of course! I'd be happy to help.");
    expect(wrapper.classes()).toContain("chat-message");
    expect(wrapper.classes()).toContain("assistant");
  });

  it("renders text content as plain text", () => {
    const textMessage = "Here's some **bold text** and `code`";
    const wrapper = mount(ChatMessage, {
      props: {
        message: textMessage,
        role: "assistant",
      },
    });

    const messageContent = wrapper.find(".message-content");
    expect(messageContent.exists()).toBe(true);
    // Text should be rendered as-is without markdown processing
    expect(messageContent.text()).toBe("Here's some **bold text** and `code`");
  });

  it("shows timestamp when provided", () => {
    const timestamp = new Date("2024-01-15T15:30:00Z"); // 3:30 PM UTC
    const wrapper = mount(ChatMessage, {
      props: {
        message: "Test message",
        role: "user",
        timestamp,
      },
    });

    const timestampElement = wrapper.find(".message-timestamp");
    expect(timestampElement.exists()).toBe(true);
    // Check that timestamp is formatted (format will depend on local timezone)
    expect(timestampElement.text()).toMatch(/\d{1,2}:\d{2}\s(AM|PM)/);
  });

  it("does not show timestamp when not provided", () => {
    const wrapper = mount(ChatMessage, {
      props: {
        message: "Test message",
        role: "user",
      },
    });

    const timestampElement = wrapper.find(".message-timestamp");
    expect(timestampElement.exists()).toBe(false);
  });

  it("applies loading state when isLoading is true", () => {
    const wrapper = mount(ChatMessage, {
      props: {
        message: "",
        role: "assistant",
        isLoading: true,
      },
    });

    expect(wrapper.classes()).toContain("loading");
    const loadingIndicator = wrapper.find(".loading-indicator");
    expect(loadingIndicator.exists()).toBe(true);
    expect(loadingIndicator.text()).toBe("AI is typing...");
  });

  it("does not apply loading state when isLoading is false", () => {
    const wrapper = mount(ChatMessage, {
      props: {
        message: "Complete message",
        role: "assistant",
        isLoading: false,
      },
    });

    expect(wrapper.classes()).not.toContain("loading");
    const loadingIndicator = wrapper.find(".loading-indicator");
    expect(loadingIndicator.exists()).toBe(false);
  });

  it("handles empty message gracefully", () => {
    const wrapper = mount(ChatMessage, {
      props: {
        message: "",
        role: "user",
      },
    });

    const messageContent = wrapper.find(".message-content");
    expect(messageContent.exists()).toBe(true);
    expect(messageContent.text()).toBe("");
  });
});
