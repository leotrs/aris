<script setup>
  import { ref, watch } from "vue";
  const props = defineProps({
    icon: { type: String, required: true },
    label: { type: String, default: "" },
    preferredSide: { type: String, default: "left" },
  });
  const emit = defineEmits(["on", "off"]);

  const controlDisplay = ref("none");
  const isHoveringButton = ref(false);
  const isHoveringControl = ref(false);
  const updateVisibility = () => {
    controlDisplay.value = isHoveringButton.value || isHoveringControl.value ? "flex" : "none";
  };

  let hideTimeout = null;
  const onMouseEnterButton = () => {
    isHoveringButton.value = true;
    clearTimeout(hideTimeout);
    updateVisibility();
  };
  const onMouseLeaveButton = () => {
    isHoveringButton.value = false;
    hideTimeout = setTimeout(updateVisibility, 500);
  };
  const onMouseEnterControl = () => {
    isHoveringControl.value = true;
    clearTimeout(hideTimeout);
    updateVisibility();
  };
  const onMouseLeaveControl = () => {
    isHoveringControl.value = false;
    hideTimeout = setTimeout(updateVisibility, 500);
  };

  const buttonState = ref(false);
  const controlState = ref(-1);
  const sides = ["left", "top", "right"];
  watch(controlState, (newVal, oldVal) => {
    clearTimeout(hideTimeout);
    controlDisplay.value = "none";

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
      controlDisplay.value = "none";
    }
  });
</script>

<template>
  <div class="sb-item">
    <div class="sb-item-btn">
      <ButtonToggle
        v-model="buttonState"
        :icon="icon"
        @mouseenter="onMouseEnterButton"
        @mouseleave="onMouseLeaveButton"
      />
      <SegmentedControl
        v-model="controlState"
        :icons="['LayoutSidebarFilled', 'LayoutNavbarFilled', 'LayoutSidebarRightFilled']"
        @mouseenter="onMouseEnterControl"
        @mouseleave="onMouseLeaveControl"
      />
    </div>
    <div
      class="sb-item-label text-caption"
      :style="{ fontWeight: buttonState ? 'var(--weight-semi)' : 'var(--weight-regular)' }"
    >
      {{ label }}
    </div>
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
  }

  .sb-item-label {
    width: 48px;
    text-align: center;
  }

  .sc-wrapper {
    opacity: 0.5;
    display: v-bind("controlDisplay");
  }

  .sc-wrapper:hover {
    opacity: 1;
  }

  :deep(.btn-toggle) {
    background-color: transparent;
  }
</style>
