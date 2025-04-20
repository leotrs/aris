<script setup>
  import { computed } from "vue";
  import * as Icons from "@tabler/icons-vue";

  const props = defineProps({
    kind: { type: String, default: "primary" },
    size: { type: String, default: "md" },
    icon: { type: String, default: null },
    text: { type: String, default: "" },
    textFloat: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
  });
</script>

<template>
  <button
    :class="[
      kind,
      `btn-${size}`,
      textFloat ? `text-float-${props.textFloat}` : '',
      textFloat ? 'text-float' : '',
      disabled ? 'disabled' : '',
    ]"
  >
    <template v-if="icon">
      <component :is="Icons['Icon' + icon]" class="btn-icon" />
    </template>
    <span v-if="text" class="btn-text" :class="textFloat ? 'text-caption' : 'text-h6'">
      {{ text }}
    </span>
    <slot v-if="!icon && !text"></slot>
  </button>
</template>

<style scoped>
  button {
    position: relative;
    display: flex;
    align-items: center;
    border: unset;
    border-radius: 16px;
    transition: background 0.15s ease-in-out;
    gap: 2px;
    padding-block: 6px;

    &:hover {
      cursor: pointer;
    }
  }

  button.btn-sm {
    border-radius: 8px;
    padding-block: 0px;

    &:not(.text-float) {
      /* if the text is not floating, behave as normal */

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

    &.text-float {
      /* must have both an icon and text */
      padding: 0;
    }
  }

  button.btn-md {
    border-radius: 16px;
    padding-inline: 16px;
    padding-block: 6px;

    &:not(.text-float) {
      /* if the text is not floating, behave as normal */

      &:has(.btn-icon):has(.btn-text) {
        padding-left: 2px;
        padding-right: 8px;
      }

      &:has(.btn-icon):not(:has(.btn-text)) {
        padding: 6px;
      }

      &:not(:has(.btn-icon)):has(.btn-text) {
      }
    }

    &.text-float {
      /* must have both an icon and text */
      padding: 0;
    }
  }

  button.btn-lg {
    padding-inline: 24px;
    padding-block: 24px;
    border-radius: 24px;

    &:has(.btn-icon):has(.btn-text) {
    }

    &:has(.btn-icon):not(:has(.btn-text)) {
    }

    &:not(:has(.btn-icon)):has(.btn-text) {
    }
  }

  button.primary {
    background-color: var(--surface-action);
    color: var(--primary-50);
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 30%);

    &:hover {
      background-color: var(--surface-action-hover);
    }

    & .btn-icon {
      color: var(--primary-50);
    }
  }

  button.secondary {
    background-color: var(--surface-primary);
    color: var(--primary-600);
    border: var(--border-thin) solid var(--border-action-hover);

    &:hover {
      color: var(--text-action-hover);
      background-color: var(--surface-information);
      border-color: var(--border-action-hover);
    }

    & .btn-icon {
      color: var(--icon-action);
    }
  }

  button.tertiary {
    background-color: transparent;
    color: var(--extra-dark);

    &:hover {
      background-color: var(--surface-hint);
      color: var(--almost-black);

      & > svg {
        color: var(--almost-black);
      }
    }
  }

  button.tertiary.disabled {
    color: var(--medium);

    & > svg {
      color: var(--medium);
    }

    &:hover {
      background-color: unset;
      cursor: unset;

      & > svg {
        color: var(--medium);
      }
    }
  }

  button.text-float .btn-text {
    position: absolute;
    color: var(--extra-dark);
  }

  button.text-float-bottom .btn-text {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    display: none;
  }

  button.text-float:hover .btn-text {
    display: block;
  }
</style>
