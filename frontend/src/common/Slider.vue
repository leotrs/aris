<script setup>
  import { ref, watch, onMounted } from "vue";
  import * as Icons from "@tabler/icons-vue";

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
    <component :is="Icons['Icon' + iconLeft]" class="s-icon" />
    <span class="s-label">{{ labelLeft }}</span>
    <div class="s-control">
      <span class="s-track"></span>
      <button
        v-for="idx in Array(numberStops).keys()"
        type="button"
        class="s-stop"
        :class="{ active: idx == active }"
        @click="active = idx"
        @keydown.enter.prevent="active = idx"
        @keydown.space.prevent="active = idx"
      />
    </div>
    <component :is="Icons['Icon' + iconRight]" class="s-icon" />
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
    height: 8px;
    width: 8px;
    border-radius: 4px;
    background-color: var(--light);
    z-index: 1;
    border: var(--border-thin) solid transparent;

    &.active {
      border-color: var(--primary-500);
      background-color: var(--primary-500);
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
