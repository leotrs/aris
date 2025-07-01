<script setup>
  import { computed } from "vue";

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(["update:modelValue"]);

  const isChecked = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
  });
</script>

<template>
  <div class="checkbox-container">
    <label :for="id" class="checkbox-wrapper">
      <!-- Hidden native input -->
      <input
        :id="id"
        v-model="isChecked"
        type="checkbox"
        class="hidden-input"
        :disabled="disabled"
      />

      <!-- Custom checkbox box -->
      <span class="checkbox-box" :class="{ checked: isChecked, disabled }"> </span>

      <!-- Label text -->
      <span class="checkbox-text">
        <slot />
      </span>
    </label>
  </div>
</template>

<style scoped>
  .checkbox-container {
    display: inline-block;
  }

  .checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
  }

  .hidden-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .checkbox-box {
    width: 18px;
    height: 18px;
    border: 2px solid #9ca3af;
    border-radius: 4px;
    background-color: white;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .checkbox-wrapper:hover .checkbox-box:not(.disabled) {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .checkbox-box.checked {
    background-color: white;
    border-color: #3b82f6;
    position: relative;
  }

  .checkbox-box.checked::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background-color: #3b82f6;
    border-radius: 2px;
  }

  .checkbox-box.disabled {
    background-color: #f3f4f6;
    border-color: #d1d5db;
    cursor: not-allowed;
  }

  .checkbox-wrapper.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .checkbox-text {
    font-weight: 500;
    color: #374151;
  }

  .disabled .checkbox-text {
    color: #9ca3af;
  }
</style>
