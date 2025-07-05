import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ChatPanel from "@/components/chat/ChatPanel.vue";
import ChatMessage from "@/components/chat/ChatMessage.vue";
import ChatInput from "@/components/chat/ChatInput.vue";
import { copilotService } from "@/services/copilotService.js";

// Mock the copilot service
vi.mock("@/services/copilotService.js", () => ({
  copilotService: {
    sendMessage: vi.fn(),
  },
}));

describe("ChatPanel.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders chat header, messages container, and input", () => {
    const wrapper = mount(ChatPanel, {
      props: { fileId: 123 },
      global: {
        components: { ChatMessage, ChatInput },
      },
    });

    expect(wrapper.find(".chat-header").exists()).toBe(true);
    expect(wrapper.find(".chat-messages").exists()).toBe(true);
    expect(wrapper.findComponent(ChatInput).exists()).toBe(true);
  });

  it("displays AI Copilot title in header", () => {
    const wrapper = mount(ChatPanel, {
      props: { fileId: 123 },
      global: {
        components: { ChatMessage, ChatInput },
      },
    });

    const header = wrapper.find(".chat-header");
    expect(header.text()).toContain("AI Copilot");
  });

  it("shows welcome message when no messages exist", () => {
    const wrapper = mount(ChatPanel, {
      props: { fileId: 123 },
      global: {
        components: { ChatMessage, ChatInput },
      },
    });

    const welcomeMessage = wrapper.find(".welcome-message");
    expect(welcomeMessage.exists()).toBe(true);
    expect(welcomeMessage.text()).toContain("Hello! I'm your AI writing assistant");
  });

  it("hides welcome message when messages exist", async () => {
    copilotService.sendMessage.mockResolvedValue({
      message: "Hello AI",
      response: "Hello! How can I help?",
      context_used: true,
    });

    const wrapper = mount(ChatPanel, {
      props: { fileId: 123 },
      global: {
        components: { ChatMessage, ChatInput },
      },
    });

    // Simulate sending a message
    const chatInput = wrapper.findComponent(ChatInput);
    await chatInput.vm.$emit("send", "Hello AI");
    await nextTick();

    const welcomeMessage = wrapper.find(".welcome-message");
    expect(welcomeMessage.exists()).toBe(false);
  });

  it("adds user message when send event is emitted", async () => {
    // Create a promise that won't resolve immediately
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    copilotService.sendMessage.mockReturnValue(promise);

    const wrapper = mount(ChatPanel, {
      props: { fileId: 123 },
      global: {
        components: { ChatMessage, ChatInput },
      },
    });

    const chatInput = wrapper.findComponent(ChatInput);
    await chatInput.vm.$emit("send", "Test message");
    await nextTick();

    const messages = wrapper.findAllComponents(ChatMessage);
    expect(messages.length).toBe(2); // User message + loading assistant message
    expect(messages[0].props().message).toBe("Test message");
    expect(messages[0].props().role).toBe("user");
    expect(messages[1].props().role).toBe("assistant");
    expect(messages[1].props().isLoading).toBe(true);

    // Clean up by resolving the promise
    resolvePromise({
      message: "Test message",
      response: "AI response",
      context_used: true,
    });
    await promise;
  });

  it("calls copilot service when message is sent", async () => {
    copilotService.sendMessage.mockResolvedValue({
      message: "Test message",
      response: "AI response",
      context_used: true,
    });

    const wrapper = mount(ChatPanel, {
      props: { fileId: 123 },
      global: {
        components: { ChatMessage, ChatInput },
      },
    });

    const chatInput = wrapper.findComponent(ChatInput);
    await chatInput.vm.$emit("send", "Test message");
    await nextTick();

    expect(copilotService.sendMessage).toHaveBeenCalledWith("Test message", 123);
  });

  it("adds AI response after successful API call", async () => {
    copilotService.sendMessage.mockResolvedValue({
      message: "Test message",
      response: "AI response",
      context_used: true,
    });

    const wrapper = mount(ChatPanel, {
      props: { fileId: 123 },
      global: {
        components: { ChatMessage, ChatInput },
      },
    });

    const chatInput = wrapper.findComponent(ChatInput);
    await chatInput.vm.$emit("send", "Test message");
    await nextTick();

    // Wait for API call to complete
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();

    const messages = wrapper.findAllComponents(ChatMessage);
    expect(messages.length).toBe(2);
    expect(messages[1].props().message).toBe("AI response");
    expect(messages[1].props().role).toBe("assistant");
  });

  it("shows loading message while API call is in progress", async () => {
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    copilotService.sendMessage.mockReturnValue(promise);

    const wrapper = mount(ChatPanel, {
      props: { fileId: 123 },
      global: {
        components: { ChatMessage, ChatInput },
      },
    });

    const chatInput = wrapper.findComponent(ChatInput);
    await chatInput.vm.$emit("send", "Test message");
    await nextTick();

    // Should show loading message
    const messages = wrapper.findAllComponents(ChatMessage);
    expect(messages.length).toBe(2);
    expect(messages[1].props().isLoading).toBe(true);
    expect(messages[1].props().role).toBe("assistant");

    // Resolve the promise
    resolvePromise({
      message: "Test message",
      response: "AI response",
      context_used: true,
    });
    await promise;
    await nextTick();

    // Loading should be gone, real message should appear
    const updatedMessages = wrapper.findAllComponents(ChatMessage);
    expect(updatedMessages[1].props().isLoading).toBe(false);
    expect(updatedMessages[1].props().message).toBe("AI response");
  });

  it("handles API errors gracefully", async () => {
    copilotService.sendMessage.mockRejectedValue(new Error("API Error"));

    const wrapper = mount(ChatPanel, {
      props: { fileId: 123 },
      global: {
        components: { ChatMessage, ChatInput },
      },
    });

    const chatInput = wrapper.findComponent(ChatInput);
    await chatInput.vm.$emit("send", "Test message");
    await nextTick();

    // Wait for API call to fail
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();

    const messages = wrapper.findAllComponents(ChatMessage);
    expect(messages.length).toBe(2);
    expect(messages[1].props().message).toContain("Sorry, I encountered an error");
    expect(messages[1].props().role).toBe("assistant");
  });

  it("disables input while API call is in progress", async () => {
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    copilotService.sendMessage.mockReturnValue(promise);

    const wrapper = mount(ChatPanel, {
      props: { fileId: 123 },
      global: {
        components: { ChatMessage, ChatInput },
      },
    });

    const chatInput = wrapper.findComponent(ChatInput);
    await chatInput.vm.$emit("send", "Test message");
    await nextTick();

    // Input should be disabled
    expect(chatInput.props().disabled).toBe(true);

    // Resolve the promise
    resolvePromise({
      message: "Test message",
      response: "AI response",
      context_used: true,
    });
    await promise;
    await nextTick();

    // Input should be enabled again
    expect(chatInput.props().disabled).toBe(false);
  });

  it("scrolls to bottom when new messages are added", async () => {
    copilotService.sendMessage.mockResolvedValue({
      message: "Test message",
      response: "AI response",
      context_used: true,
    });

    const wrapper = mount(ChatPanel, {
      props: { fileId: 123 },
      global: {
        components: { ChatMessage, ChatInput },
      },
    });

    // Mock scrollIntoView on the messagesEnd element
    const scrollIntoViewMock = vi.fn();

    // Wait for the component to mount and refs to be available
    await nextTick();

    // Mock the messagesEnd ref
    if (wrapper.vm.messagesEnd) {
      wrapper.vm.messagesEnd.scrollIntoView = scrollIntoViewMock;
    }

    const chatInput = wrapper.findComponent(ChatInput);
    await chatInput.vm.$emit("send", "Test message");
    await nextTick();

    // We expect scrollIntoView to be called when messages are added
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("includes clear chat functionality", async () => {
    const wrapper = mount(ChatPanel, {
      props: { fileId: 123 },
      global: {
        components: { ChatMessage, ChatInput },
      },
    });

    // Add a message first
    const chatInput = wrapper.findComponent(ChatInput);
    await chatInput.vm.$emit("send", "Test message");
    await nextTick();

    // Find and click clear button
    const clearButton = wrapper.find(".clear-chat");
    expect(clearButton.exists()).toBe(true);

    await clearButton.trigger("click");
    await nextTick();

    // Messages should be cleared
    const messages = wrapper.findAllComponents(ChatMessage);
    expect(messages.length).toBe(0);

    // Welcome message should be visible again
    const welcomeMessage = wrapper.find(".welcome-message");
    expect(welcomeMessage.exists()).toBe(true);
  });
});
