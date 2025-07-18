<script setup>
  /**
   * Slider - A custom slider component with discrete stops.
   *
   * This component provides a visual slider with a fixed number of clickable stops.
   * It can display optional icons and labels on its left and right sides.
   * The active stop is highlighted, and the component emits a 'change' event when the active stop changes.
   *
   * @displayName Slider
   * @example
   * // Basic usage with 3 stops
   * <Slider :number-stops="3" />
   *
   * @example
   * // With icons and labels
   * <Slider icon-left="VolumeOff" icon-right="VolumeUp" label-left="Mute" label-right="Max" :number-stops="5" />
   *
   * @example
   * // Custom default active stop
   * <Slider :number-stops="4" :default-active="2" @change="handleSliderChange" />
   */
  import { ref, watch } from "vue";

  const props = defineProps({
    iconLeft: { type: String, default: null },
    iconRight: { type: String, default: null },
    labelLeft: { type: String, default: null },
    labelRight: { type: String, default: null },
    numberStops: { type: Number, default: 3 },
    defaultActive: { type: Number, default: 0 },
  });
  const emit = defineEmits(["change"]);

  const active = ref(props.defaultActive);
  watch(active, (newVal) => emit("change", newVal));
</script>

<template>
  <div class="s-wrapper">
    <Icon :name="iconLeft" class="s-icon" />
    <span class="s-label">{{ labelLeft }}</span>
    <div class="s-control">
      <span class="s-track"></span>
      <button
        v-for="idx in Array(numberStops).keys()"
        :key="idx"
        type="button"
        class="s-stop"
        :class="{ active: idx === active }"
        @click="active = idx"
        @keydown.enter.prevent="active = idx"
        @keydown.space.prevent="active = idx"
      />
    </div>
    <Icon :name="iconRight" class="s-icon" />
    <span class="s-label">{{ labelRight }}</span>
  </div>
</template>

<style scoped>
  .s-wrapper {
    display: flex;
    align-items: center;
  }

  .s-icon {
    flex-shrink: 0;
  }

  .s-control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 32px);
    position: relative;
  }

  .s-track {
    position: absolute;
    height: 2px;
    width: 100%;
    background-color: var(--light);
  }

  .s-stop {
    height: 9px;
    width: 9px;
    border-radius: 50%;
    background-color: var(--light);
    z-index: 1;
    border: var(--border-thin) solid transparent;

    &.active {
      height: 14px;
      width: 14px;
      border-color: var(--gray-700);
      background-color: var(--gray-700);
    }

    &:not(.active) {
      cursor: pointer;

      &:hover {
        border-color: var(--primary-300);
        background-color: var(--primary-300);
      }
    }
    &:focus-visible {
      outline: var(--border-med) solid var(--border-action);
      outline-offset: var(--border-extrathin);
    }
  }
</style>
