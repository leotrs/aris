<script setup>
  import { computed } from "vue";

  const props = defineProps({
    labels: { type: Array, default: null },
    icons: { type: Array, default: null },
  });
  const numTabs = computed(() => props.labels?.length);
</script>

<template>
  <div class="tabs-wrapper">
    <div class="tabs-header">
      <div v-for="idx in numTabs" :key="idx" class="tabs-header-item">
        <Tab :icon="icons[idx - 1]" :label="labels[idx - 1]" />
      </div>
    </div>
    <slot />
  </div>
</template>

<style>
  .tabs-wrapper {
  }
  .tabs-header {
    display: flex;
  }
</style>
