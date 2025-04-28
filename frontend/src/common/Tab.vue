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
    color: var(--gray-800);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    border-bottom: var(--border-thin) solid transparent;
    transition:
      background-color var(--transition-duration) ease,
      box-shadow var(--transition-duration) ease,
      border-bottom-color var(--transition-duration) ease;

    & .tabler-icon {
      color: var(--gray-800);
    }
  }

  .tab-wrapper:not(.active):hover {
    color: var(--almost-black);
    & .tabler-icon {
      color: var(--almost-black);
    }
    cursor: pointer;
    box-shadow: var(--shadow-soft);
  }

  .tab-wrapper.active {
    color: var(--almost-black);
    background-color: var(--information-100);
    box-shadow: var(--shadow-strong);
    border-bottom-color: var(--border-action);
    & .tabler-icon {
      color: var(--almost-black);
    }
  }

  .tab-wrapper .tabler-icon {
    margin-top: 6px;
    margin-bottom: 2px;
    stroke-width: 2px;
  }

  .tab-label {
    font-weight: var(--weight-medium) !important;
  }
</style>
