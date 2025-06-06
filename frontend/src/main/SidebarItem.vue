<script setup>
  import { ref, watch, inject, onBeforeUnmount } from "vue";

  const props = defineProps({
    icon: { type: String, required: true },
    label: { type: String, default: "" },
    withSideControl: { type: Boolean, default: true },
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
  const onMouseEnterControl = () => {
    isHoveringControl.value = true;
    clearTimeout(hideTimeout);
    updateVisibility();
  };
  const onMouseLeaveControl = () => {
    isHoveringControl.value = false;
    clearTimeout(showTimeout);
    hideTimeout = setTimeout(updateVisibility, 300);
  };

  // Segmented control allows user to choose side
  const controlState = ref(-1);
  const sides = ["left", "top", "right"];
  watch(controlState, (newVal, oldVal) => {
    clearTimeout(hideTimeout);
    visibilityClass.value = "";

    if (!buttonState.value) {
      buttonState.value = true;
      // DONT emit here since setting buttonState.value = true will emit
      // emit('on', sides[newVal]);
    } else {
      if (oldVal !== -1) emit("off", sides[oldVal]);
      emit("on", sides[newVal]);
    }
  });

  const sideToIndexMap = { left: 0, top: 1, right: 2 };
  watch(buttonState, (pressed) => {
    if (pressed) {
      if (controlState.value == -1) {
        controlState.value = sideToIndexMap[props.preferredSide];
        // DONT emit here since setting controlState.value = 0 will emit
        // emit('on', sides[controlState.value]);
      } else {
        emit("on", sides[controlState.value]);
      }
    } else {
      emit("off", sides[controlState.value]);
      clearTimeout(hideTimeout);
      visibilityClass.value = "";
    }
  });

  // Clean up any timers when component is unmounted
  onBeforeUnmount(() => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = null;
    }
  });

  const mobileMode = inject("mobileMode");
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
        :button-size="mobileMode ? 'btn-sm' : 'btn-md'"
        :active-color="type == 'outline' ? 'var(--purple-300)' : 'var(--surface-hint)'"
        :type="type"
        @mouseenter="onMouseEnterButton"
        @mouseleave="onMouseLeaveButton"
      />
      <!-- <SegmentedControl
           v-if="withSideControl"
           v-model="controlState"
           :icons="['LayoutSidebarFilled', 'LayoutNavbarFilled', 'LayoutSidebarRightFilled']"
           :class="visibilityClass"
           :aria-orientation="'horizontal'"
           role="tablist"
           tabindex="0"
           @mouseenter="onMouseEnterControl"
           @mouseleave="onMouseLeaveControl"
           /> -->
    </div>
    <div class="sb-item-label text-default">{{ label }}</div>
  </div>
</template>

<style scoped>
  .sb-item {
    display: flex;
    flex-direction: column;
  }

  .sb-item-btn {
    display: flex;
    gap: 16px;
    justify-content: center;
    align-items: center;
  }

  .sb-item-btn button {
    padding-inline: 6px;
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
