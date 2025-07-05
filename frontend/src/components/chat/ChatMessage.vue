<template>
  <div :class="['chat-message', role, { loading: isLoading }]">
    <div v-if="!isLoading" class="message-content">{{ message }}</div>
    <div v-if="isLoading" class="loading-indicator">AI is typing...</div>
    <div v-if="timestamp" class="message-timestamp">{{ formattedTimestamp }}</div>
  </div>
</template>

<script>
  import { computed } from "vue";

  export default {
    name: "ChatMessage",
    props: {
      message: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
        validator: (value) => ["user", "assistant"].includes(value),
      },
      timestamp: {
        type: Date,
        default: null,
      },
      isLoading: {
        type: Boolean,
        default: false,
      },
    },
    setup(props) {
      const formattedTimestamp = computed(() => {
        if (!props.timestamp) return "";

        return props.timestamp.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      });

      return {
        formattedTimestamp,
      };
    },
  };
</script>

<style scoped>
  .chat-message {
    margin-bottom: 16px;
    padding: 12px 16px;
    border-radius: 12px;
    max-width: 80%;
    word-wrap: break-word;
  }

  .chat-message.user {
    background-color: var(--blue-900);
    color: var(--white);
    margin-left: auto;
    text-align: right;
  }

  .chat-message.assistant {
    background-color: var(--surface-hover);
    color: var(--extra-dark);
    margin-right: auto;
  }

  .chat-message.loading {
    background-color: var(--surface-hover);
    color: var(--medium);
    margin-right: auto;
  }

  .message-content {
    line-height: 1.4;
  }

  .message-content :deep(strong) {
    font-weight: 600;
  }

  .message-content :deep(code) {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 2px 4px;
    border-radius: 4px;
    font-family: "SF Mono", Monaco, monospace;
    font-size: 0.9em;
  }

  .loading-indicator {
    font-style: italic;
    opacity: 0.7;
  }

  .message-timestamp {
    font-size: 11px;
    opacity: 0.6;
    margin-top: 4px;
  }

  .user .message-timestamp {
    text-align: right;
  }

  .assistant .message-timestamp {
    text-align: left;
  }
</style>
