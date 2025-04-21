<script setup>
  import { watch } from "vue";
  import * as Icons from "@tabler/icons-vue";

  const props = defineProps({
    icon: { type: String, default: "" },
    text: { type: String, default: "" },
    hoverColor: { type: String, default: "var(--gray-50)" },
    activeColor: { type: String, default: "var(--surface-hint)" },
  });
  const active = defineModel({ type: Boolean });
  const emit = defineEmits(["on", "off"]);

  watch(active, (newValue) => (newValue ? emit("on") : emit("off")));
</script>

<template>
  <button class="text-h6 btn-toggle" :class="{ active: active }" @click="active = !active">
    <template v-if="icon">
      <component :is="Icons['Icon' + props.icon]" class="btn-icon" />
    </template>
    <span v-if="text" class="btn-text">{{ text }}</span>
    <slot />
  </button>
</template>

<style scoped>
  button {
    display: flex;
    align-items: center;
    border: unset;
    border-radius: 16px;
    transition: background 0.15s ease-in-out;
    gap: 2px;
    background-color: transparent;

    padding-block: 6px;

    &:has(.btn-icon):has(.btn-text) {
      padding-left: 2px;
      padding-right: 8px;
    }

    &:has(.btn-icon):not(:has(.btn-text)) {
      padding: 8px;
    }

    &:hover {
      cursor: pointer;
      background-color: v-bind("hoverColor");
      color: var(--text-action-hover);
    }

    &.active {
      background-color: v-bind("activeColor");
      color: var(--almost-black);
    }
  }

  button.btn-sm {
    border-radius: 8px;
    padding-block: 0px;

    &:has(.btn-icon):has(.btn-text) {
      padding-left: 2px;
      padding-right: 8px;
    }

    &:has(.btn-icon):not(:has(.btn-text)) {
      padding: 0px;
    }

    &:not(:has(.btn-icon)):has(.btn-text) {
      padding-left: 2px;
      padding-right: 8px;
    }
  }

  button.btn-md {
    border-radius: 16px;
    padding-inline: 16px;
    padding-block: 6px;

    &:has(.btn-icon):has(.btn-text) {
      padding-left: 2px;
      padding-right: 8px;
    }

    &:has(.btn-icon):not(:has(.btn-text)) {
      padding: 8px;
    }
  }

  button.btn-lg {
    padding-inline: 24px;
    padding-block: 24px;
    border-radius: 24px;
  }
</style>
