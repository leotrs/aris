<template>
  <TextareaInput
    ref="textareaInput"
    v-model="message"
    :placeholder="placeholder"
    :disabled="disabled"
    :submit-button-text="disabled ? 'Sending...' : ''"
    submit-button-icon="Send"
    submit-button-kind="primary"
    submit-button-size="md"
    layout="stacked"
    @submit="handleSendMessage"
  />
</template>

<script>
  import { ref } from "vue";
  import TextareaInput from "@/components/base/TextareaInput.vue";

  export default {
    name: "ChatInput",
    components: {
      TextareaInput,
    },
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
      placeholder: {
        type: String,
        default: "How can I help?",
      },
    },
    emits: ["send"],
    setup(props, { emit }) {
      const message = ref("");
      const textareaInput = ref(null);

      const handleSendMessage = (messageText) => {
        emit("send", messageText);
      };

      const focus = () => {
        if (textareaInput.value) {
          textareaInput.value.focus();
        }
      };

      return {
        message,
        textareaInput,
        handleSendMessage,
        focus,
      };
    },
  };
</script>
