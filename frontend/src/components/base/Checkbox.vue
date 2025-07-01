<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['update:modelValue']);

  const isChecked = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });
</script>

<template>
  <div class="checkbox-wrapper">
    <input
      :id="id"
      v-model="isChecked"
      type="checkbox"
      class="checkbox"
      :disabled="disabled"
    />
    <label :for="id" class="checkbox-label">
      <slot />
    </label>
  </div>
</template>

<style scoped>
  .checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .checkbox {
    width: 16px;
    height: 16px;
    accent-color: var(--primary-500);
    cursor: pointer;
  }

  .checkbox:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .checkbox-label {
    cursor: pointer;
    font-weight: 500;
    color: var(--text-primary);
    user-select: none;
  }

  .checkbox:disabled + .checkbox-label {
    cursor: not-allowed;
    opacity: 0.6;
  }
</style>
