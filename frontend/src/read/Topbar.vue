<script setup>
import { inject, computed, watch } from "vue";
import Drawer from "./Drawer.vue";

const props = defineProps({
  showTitle: { type: Boolean, required: true },
  drawer: { type: Object, default: null },
});
const doc = inject("doc");

const columnSizes = inject("columnSizes");
const leftColumnWidth = computed(() => `${columnSizes.left.width}px`);
const middleColumnWidth = computed(() => `${columnSizes.middle.width}px`);
</script>

<template>
  <div class="tb-wrapper" :class="{ 'with-border': showTitle }">
    <Drawer class="left-column top">
      <FileTitle v-if="showTitle && drawer" :doc="doc" class="text-h6" />
    </Drawer>

    <Drawer class="middle-column top">
      <FileTitle v-if="showTitle && !drawer" :doc="doc" class="text-h6" />
      <component :is="drawer" />
    </Drawer>

  </div>
</template>

<style scoped>
.tb-wrapper {
  --outer-padding: 8px;
  --sidebar-width: 64px;
  --links-width: 151px;

  display: flex;
  height: var(--sidebar-width);
  width: calc(100% - var(--sidebar-width) - var(--outer-padding));
  position: fixed;
  top: 8px;
  background-color: var(--surface-page);
  z-index: 2;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border-bottom: var(--border-extrathin) solid var(--surface-page);
  padding-right: var(--links-width);

  &.with-border {
    box-shadow:
      0px 4px 2px -2px rgba(0, 0, 0, 15%),
      0px 8px 6px -6px rgba(0, 0, 0, 05%);
  }
}

.left-column,
.middle-column {
  background-color: var(--surface-page);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.left-column {
  margin-inline: 16px;
  border-top-left-radius: 16px;
  width: v-bind("leftColumnWidth");
}

.middle-column {
  padding-inline: 48px;
  text-align: center;
  width: v-bind("middleColumnWidth");
}
</style>
