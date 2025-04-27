<script setup>
  import {} from "vue";
  import * as Icons from "@tabler/icons-vue";

  const props = defineProps({
    label: { type: String, default: "" },
    icon: { type: String, default: "" },
  });
  const active = defineModel({ type: Boolean, default: false });
</script>

<template>
  <div class="tab-wrapper" :class="{ active }" @click="active = true">
    <component :is="Icons['Icon' + icon]" class="tab-icon" />
    <span class="tab-label text-caption">{{ label }}</span>
  </div>
</template>

<style>
  .tab-wrapper {
    --transition-duration: 0.3s;

    height: calc(48px - var(--border-extrathin));
    width: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-inline: 8px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom: var(--border-thin) solid transparent;
    transition:
      background-color var(--transition-duration) ease,
      box-shadow var(--transition-duration) ease,
      border-bottom-color var(--transition-duration) ease;
  }

  .tab-wrapper:not(.active):hover {
    cursor: pointer;
    box-shadow: var(--shadow-soft);
  }

  .tab-wrapper.active {
    background-color: var(--information-100);
    box-shadow: var(--shadow-strong);
    border-bottom-color: var(--border-action);
  }

  .tab-wrapper .tabler-icon {
    margin-top: 6px;
    margin-bottom: 2px;
    stroke-width: 1.5px;
  }
</style>
