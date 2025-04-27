<script setup>
  import { reactive, computed, watch, onMounted } from "vue";

  const props = defineProps({
    labels: { type: Array, default: null },
    icons: { type: Array, default: null },
  });
  const numTabs = computed(() => props.labels?.length ?? 0);
  const activeIndex = defineModel({ type: Number, default: 0 });
  const tabStates = reactive({
    active: Array.from({ length: numTabs.value }).map(() => false),
  });
  watch(
    () => [...tabStates.active],
    (newVal, oldVal) => {
      for (let i = 0; i < newVal.length; i++) {
        if (newVal[i] && !oldVal[i]) {
          tabStates.active.fill(false);
          tabStates.active[i] = true;
          activeIndex.value = i;
          return;
        }
      }
    }
  );
  onMounted(() => (tabStates.active[0] = true));
</script>

<template>
  <div class="tabs-wrapper">
    <div class="tabs-header">
      <div v-for="count in numTabs" :key="count" class="tabs-header-item">
        <Tab
          v-model="tabStates.active[count - 1]"
          :icon="icons[count - 1]"
          :label="labels[count - 1]"
        />
      </div>
    </div>
    <div class="tabs-content">
      <slot />
    </div>
  </div>
</template>

<style>
  .tabs-wrapper {
    --header-height: 48px;

    width: min-content;
    height: 100%;
  }

  .tabs-header {
    height: var(--header-height);
    display: flex;
    gap: 4px;
    border-radius: 8px;
    width: fit-content;
    background-color: var(--surface-hover);
  }

  .tabs-content {
    width: calc(100% + var(--scrollbar-size));
    height: calc(100% - var(--header-height));
    padding-block: 16px;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-gutter: stable;
  }
</style>
