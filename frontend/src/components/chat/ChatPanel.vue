<template>
  <div class="chat-panel">
    <div class="chat-header">
      <h3 class="chat-title">AI Copilot</h3>
      <button
        v-if="messages.length > 0"
        class="clear-chat"
        title="Clear conversation"
        @click="clearChat"
      >
        Clear
      </button>
    </div>

    <div ref="messagesContainer" class="chat-messages">
      <div v-if="messages.length === 0" class="welcome-message">
        <p>Hello! I'm your AI writing assistant.</p>
        <p>
          I can help you with your manuscript - ask me questions, request suggestions for
          improvements, or get help with writing and editing.
        </p>
      </div>

      <ChatMessage
        v-for="(message, index) in messages"
        :key="index"
        :message="message.content"
        :role="message.role"
        :timestamp="message.timestamp"
        :is-loading="message.isLoading"
      />

      <div ref="messagesEnd"></div>
    </div>

    <ChatInput ref="chatInput" :disabled="isLoading" @send="handleSendMessage" />
  </div>
</template>

<script>
  import { ref, nextTick, inject } from "vue";
  import ChatMessage from "./ChatMessage.vue";
  import ChatInput from "./ChatInput.vue";
  import { copilotService } from "@/services/copilotService.js";

  export default {
    name: "ChatPanel",
    components: {
      ChatMessage,
      ChatInput,
    },
    props: {
      fileId: {
        type: Number,
        default: null,
      },
    },
    setup(props) {
      // Use injected state for persistence across chat panel open/close
      const messages = inject("chatMessages", ref([]));
      const isLoading = inject("chatIsLoading", ref(false));
      const messagesContainer = ref(null);
      const messagesEnd = ref(null);
      const chatInput = ref(null);

      const scrollToBottom = async () => {
        await nextTick();
        if (messagesEnd.value && messagesEnd.value.scrollIntoView) {
          messagesEnd.value.scrollIntoView({ behavior: "smooth" });
        }
      };

      const addMessage = (content, role, isLoading = false) => {
        messages.value.push({
          content,
          role,
          timestamp: new Date(),
          isLoading,
        });
        scrollToBottom();
      };

      const updateLastMessage = (content, isLoading = false) => {
        if (messages.value.length > 0) {
          const lastMessage = messages.value[messages.value.length - 1];
          lastMessage.content = content;
          lastMessage.isLoading = isLoading;
          lastMessage.timestamp = new Date();
        }
      };

      const handleSendMessage = async (message) => {
        // Add user message
        addMessage(message, "user");

        // Add loading assistant message
        addMessage("", "assistant", true);
        isLoading.value = true;

        try {
          const response = await copilotService.sendMessage(message, props.fileId);

          // Update the loading message with the actual response
          updateLastMessage(response.response, false);
        } catch (error) {
          console.error("Chat error:", error);

          // Update the loading message with error message
          updateLastMessage(
            "Sorry, I encountered an error while processing your request. Please try again.",
            false
          );
        } finally {
          isLoading.value = false;
        }
      };

      const clearChat = () => {
        messages.value = [];
        if (chatInput.value) {
          chatInput.value.focus();
        }
      };

      return {
        messages,
        isLoading,
        messagesContainer,
        messagesEnd,
        chatInput,
        handleSendMessage,
        clearChat,
        scrollToBottom,
      };
    },
  };
</script>

<style scoped>
  .chat-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--surface-primary);
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border-bottom: var(--border-extrathin) solid var(--border-primary);
    background-color: var(--surface-hover);
  }

  .chat-title {
    font-size: 14px;
    font-weight: var(--weight-semi);
    color: var(--extra-dark);
    margin: 0;
  }

  .clear-chat {
    padding: 6px 12px;
    background-color: transparent;
    color: var(--surface-action);
    border: var(--border-thin) solid var(--border-action);
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: var(--transition-bg-color), var(--transition-bd-color);
  }

  .clear-chat:hover {
    background-color: var(--surface-action-hover);
    color: var(--white);
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 0; /* Important for flex children to shrink */
  }

  .welcome-message {
    text-align: center;
    color: var(--medium);
    font-size: 16px;
    line-height: 1.5;
    max-width: 400px;
    margin: 40px auto;
  }

  .welcome-message p {
    margin: 0 0 12px 0;
  }

  .welcome-message p:last-child {
    margin-bottom: 0;
  }

  /* Scrollbar styling */
  .chat-messages::-webkit-scrollbar {
    width: 6px;
  }

  .chat-messages::-webkit-scrollbar-track {
    background: var(--surface-hover);
    border-radius: 3px;
  }

  .chat-messages::-webkit-scrollbar-thumb {
    background: var(--gray-400);
    border-radius: 3px;
  }

  .chat-messages::-webkit-scrollbar-thumb:hover {
    background: var(--gray-500);
  }
</style>
