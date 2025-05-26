<script setup>
  import { useTemplateRef } from "vue";
  import * as Icons from "@tabler/icons-vue";

  const props = defineProps({
    kind: { type: String, required: true },
    size: { type: String, default: "md" },
    icon: { type: String, default: null },
    text: { type: String, default: "" },
    textFloat: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    shadow: { type: Boolean, default: false },
  });
  const btnRef = useTemplateRef("btn-ref");
  defineExpose({ btn: btnRef });
</script>

<template>
  <button
    ref="btn-ref"
    :class="[
      kind,
      `btn-${size}`,
      textFloat ? `text-float-${props.textFloat}` : '',
      textFloat ? 'text-float' : '',
      shadow ? 'with-shadow' : '',
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
    --border-width: var(--border-thin);

    position: relative;
    display: flex;
    align-items: center;
    border: unset;
    border-radius: 16px;
    gap: 2px;
    text-wrap: nowrap;
    padding-block: 6px;
    outline: none;
    border-width: var(--border-width);
    border-style: solid;
    transition: var(--transition-bg-color), var(--transition-bd-color);

    &:hover {
      cursor: pointer;
    }
    &:focus-visible {
      outline: var(--border-med) solid var(--border-action);
      outline-offset: var(--border-extrathin);
    }
  }

  button.btn-sm {
    border-radius: 8px;
    padding-block: 0;

    & > .tabler-icon {
      /* since all buttons must have border, in this case we
      * need to decrease the icon margin to achieve 32x32 size */
      margin: calc(6px - var(--border-width));
    }

    &:not(.text-float) {
      /* if the text is not floating, behave as normal */

      &:has(.btn-icon):has(.btn-text) {
        padding-left: calc(2px - var(--border-width));
        padding-right: calc(8px - var(--border-width));
      }

      &:has(.btn-icon):not(:has(.btn-text)) {
        padding: 0px;
      }

      &:not(:has(.btn-icon)):has(.btn-text) {
        padding-inline: calc(8px - var(--border-width));
      }

      &:not(:has(.btn-icon)):not(:has(.btn-text)) {
      }
    }

    &.text-float {
      /* must have icon and text and not have slot */
      padding: 0;
    }
  }

  button.btn-md {
    border-radius: 16px;

    &:not(.text-float) {
      /* if the text is not floating, behave as normal */

      &:has(.btn-icon):has(.btn-text) {
        padding-left: calc(2px - var(--border-width));
        padding-right: calc(8px - var(--border-width));
      }

      &:has(.btn-icon):not(:has(.btn-text)) {
        padding: calc(8px - var(--border-width));
      }

      &:not(:has(.btn-icon)):has(.btn-text) {
      }

      &:not(:has(.btn-icon)):not(:has(.btn-text)) {
        padding: calc(8px - var(--border-width));
      }
    }

    &.text-float {
      /* must have both an icon and text */
    }
  }

  button.btn-lg {
    padding-inline: calc(24px - var(--border-width));
    padding-block: calc(24px - var(--border-width));
    border-radius: 24px;

    &:not(.text-float) {
      /* if the text is not floating, behave as normal */

      &:has(.btn-icon):has(.btn-text) {
      }

      &:has(.btn-icon):not(:has(.btn-text)) {
      }

      &:not(:has(.btn-icon)):has(.btn-text) {
      }

      &:not(:has(.btn-icon)):not(:has(.btn-text)) {
      }
    }

    &.text-float {
    }
  }

  button.primary {
    background-color: var(--surface-action);
    border-color: var(--surface-action);
    color: var(--primary-50);
    box-shadow: var(--shadow-soft), var(--shadow-strong);

    &:hover {
      background-color: var(--surface-action-hover);
      border-color: var(--surface-action-hover);
    }

    & .btn-icon {
      color: var(--primary-50);
    }
  }

  button.primary:active {
    background-color: var(--surface-hint);
    border-color: var(--surface-hint);
  }

  button.secondary {
    background-color: var(--surface-primary);
    border-color: var(--border-action);
    color: var(--primary-600);

    &:hover {
      color: var(--text-action-hover);
      background-color: var(--surface-information);
      border-color: var(--border-action-hover);
      box-shadow: var(--shadow-strong);
    }

    & .btn-icon {
      color: var(--icon-action);
    }
  }

  button.secondary.with-shadow {
    box-shadow: var(--shadow-strong);
  }

  button.secondary:active {
    background-color: var(--surface-hint);
    border-color: var(--border-action-hover);
  }

  button.tertiary {
    background-color: transparent;
    border-color: transparent;
    color: var(--extra-dark);

    &:hover {
      background-color: var(--surface-hint);
      border-color: var(--surface-hint);
      color: var(--almost-black);
      box-shadow: var(--shadow-strong);

      & > svg {
        color: var(--almost-black);
      }
    }
  }

  button.tertiary.with-shadow {
    box-shadow: var(--shadow-strong);
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

  button.tertiary:active {
    background-color: var(--surface-action);
    border-color: var(--surface-action);
  }

  button .btn-icon {
    flex-shrink: 0;
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
