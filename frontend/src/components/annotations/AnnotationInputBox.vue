<script setup>
  import {} from "vue";

  /**
   * AnnotationInputBox - Expandable annotation input component
   *
   * A specialized input component for creating annotations with expandable states
   * and integrated action buttons. Features a compact default state that can expand
   * to show additional editing controls.
   *
   * Features:
   * - Two states: compact and expanded
   * - Integrated send and edit buttons
   * - Enter key submission
   * - Placeholder text for guidance
   * - Responsive sizing based on state
   *
   * @displayName AnnotationInputBox
   * @example
   * // Basic usage
   * <AnnotationInputBox
   *   v-model="annotationText"
   *   @submit="handleSubmit"
   * />
   *
   * @example
   * // Expanded state
   * <AnnotationInputBox
   *   v-model="annotationText"
   *   :expanded="true"
   *   @submit="handleSubmit"
   * />
   *
   * @example
   * // Compact state
   * <AnnotationInputBox
   *   v-model="annotationText"
   *   :expanded="false"
   *   @submit="handleSubmit"
   * />
   */

  const props = defineProps({
    /**
     * Whether the input is in expanded state (shows edit button)
     */
    expanded: { type: Boolean, default: true },
  });

  /**
   * Events emitted by the component
   * @event submit - Emitted when text is submitted (Enter key or send button)
   */
  const emit = defineEmits(["submit"]);

  /**
   * The annotation text content (v-model)
   */
  const value = defineModel({ type: String, default: "" });

  const onSubmit = () => {
    emit("submit", value.value);
  };
</script>

<template>
  <div class="ann-input-box" :class="expanded ? 'expanded' : ''">
    <InputText v-model="value" placeholder="What's on your mind?" @keyup.enter="onSubmit" />
    <div class="buttons">
      <Button v-if="expanded" class="edit" kind="tertiary" size="sm" icon="Edit" />
      <Button class="send" kind="tertiary" size="sm" icon="Send2" @click="onSubmit" />
    </div>
  </div>
</template>

<style scoped>
  .ann-input-box {
    position: relative;
    display: flex;
  }

  .buttons {
    position: absolute;
    right: 1px;
    top: 1px;

    & > button {
      height: 30px;
      width: 30px;
    }

    & :deep(.tabler-icon) {
      color: var(--dark) !important;
    }
  }

  .input-text {
    height: 32px;
  }

  .input-text :deep(input) {
    width: 204px;
  }

  .ann-input-box.expanded .input-text {
    height: 64px;
  }
</style>
