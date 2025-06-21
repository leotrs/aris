<script setup>
  import { ref, inject, onBeforeUnmount } from "vue";

  const props = defineProps({
    icon: { type: String, required: true },
    label: { type: String, default: "" },
    preferredSide: {
      type: String,
      default: "left",
      validator: (value) => ["left", "top", "right"].includes(value),
    },
    showDelay: { type: Number, default: 500 },
    hideDelay: { type: Number, default: 300 },
    type: { type: String, default: "filled" },
  });
  const emit = defineEmits(["on", "off"]);
  const buttonState = defineModel({ type: Boolean, default: false });

  const isHoveringButton = ref(false);
  const isHoveringControl = ref(false);
  const visibilityClass = ref("");
  const updateVisibility = () => {
    visibilityClass.value = isHoveringButton.value || isHoveringControl.value ? "show" : "";
  };
  let hideTimeout = null;
  let showTimeout = null;
  const onMouseEnterButton = () => {
    isHoveringButton.value = true;
    clearTimeout(hideTimeout);
    showTimeout = setTimeout(updateVisibility, 500);
  };
  const onMouseLeaveButton = () => {
    isHoveringButton.value = false;
    clearTimeout(showTimeout);
    hideTimeout = setTimeout(updateVisibility, 300);
  };

  const mobileMode = inject("mobileMode");

  onBeforeUnmount(() => {
    if (hideTimeout) clearTimeout(hideTimeout);
    if (showTimeout) clearTimeout(showTimeout);
  });
</script>

<template>
  <div class="sb-item">
    <div class="sb-item-btn">
      <ButtonToggle
        v-model="buttonState"
        :icon="icon"
        :aria-label="label || 'Toggle ' + icon"
        :aria-pressed="buttonState"
        tabindex="0"
        :button-size="mobileMode ? 'sm' : 'md'"
        :active-color="type === 'outline' ? 'var(--purple-300)' : 'var(--surface-hint)'"
        :type="type"
        @mouseenter="onMouseEnterButton"
        @mouseleave="onMouseLeaveButton"
      />
    </div>
    <div class="sb-item-label text-default">{{ label }}</div>
  </div>
</template>

<style scoped>
  .sb-item {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  /* .sb-item::after {
     content: "";
     height: 8px;
     width: 8px;
     background: var(--purple-500);
     position: absolute;
     right: 12px;
     border-radius: 50%;
     bottom: 12px;
     } */

  .sb-item-btn {
    display: flex;
    gap: 16px;
    justify-content: center;
    align-items: center;
  }

  .sb-item-btn button {
    padding: 6px !important;
  }

  .sb-item-btn:hover button:not(.active) {
    box-shadow: var(--shadow-strong);
    background-color: var(--gray-50);
  }

  .sb-item-btn:has(button.active.outline) {
    font-weight: var(--weight-semi);
  }

  .sb-item-btn > button.active.outline {
    background-color: var(--surface-page);
  }

  .sb-item-btn:has(button.active) + .sb-item-label {
    font-weight: var(--weight-semi);
  }

  .sb-item-label {
    margin-left: -8px;
    width: 64px;
    text-align: center;
    font-size: 14px;
    transition: font-weight 0.3s ease;
  }

  .sc-wrapper {
    z-index: -1;
    position: absolute;
    left: calc(64px + 8px);
    transform: translateX(calc(-100% - 64px - 8px));
    opacity: 0.5;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .sc-wrapper.show {
    transform: translateX(0);
  }

  .sc-wrapper:hover {
    opacity: 1;
  }
</style>
