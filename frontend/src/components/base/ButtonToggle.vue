<script setup>
  import { watch } from "vue";

  defineOptions({
    name: "ButtonToggle",
  });

  const props = defineProps({
    text: { type: String, default: "" },
    icon: { type: String, default: "" },
    iconClass: { type: String, default: "" },
    size: { type: String, default: "md" },
    hoverColor: { type: String, default: "var(--gray-50)" },
    activeColor: { type: String, default: "var(--surface-hint)" },
    type: { type: String, default: "filled" },
  });
  const active = defineModel({ type: Boolean });
  const emit = defineEmits(["on", "off"]);

  watch(active, (newValue) => (newValue ? emit("on") : emit("off")));
</script>

<template>
  <button
    class="text-h6 btn-toggle"
    :class="[type, `btn-${size}`, active ? 'active' : '']"
    @click="active = !active"
  >
    <template v-if="icon">
      <Icon :name="icon" class="btn-icon" :class="iconClass" />
    </template>
    <span v-if="text" class="btn-text">{{ text }}</span>
    <slot />
  </button>
</template>

<style scoped>
  button {
    --border-width: var(--border-thin);

    display: flex;
    align-items: center;
    border: var(--border-width) solid transparent;
    border-radius: 16px;
    transition: background 0.15s ease-in-out;
    gap: 2px;
    background-color: transparent;
    outline: none;

    &:has(.btn-icon):has(.btn-text) {
      padding-left: 2px;
      padding-right: 8px;
    }

    &:has(.btn-icon):not(:has(.btn-text)) {
    }

    &:hover {
      cursor: pointer;
      box-shadow: var(--shadow-strong);
    }

    &.active:hover {
      background-color: v-bind("activeColor");
    }

    &:not(.active):hover {
      background-color: v-bind("hoverColor");
    }

    &.active {
      color: var(--almost-black);
      box-shadow: var(--shadow-strong);
    }

    &.active.filled {
      background-color: v-bind("activeColor");
    }

    &.active.outline {
      border: var(--border-width) solid v-bind("activeColor");
    }
  }

  button.btn-sm {
    border-radius: 12px;
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

  button:active {
    background-color: var(--surface-action) !important;
  }
</style>
