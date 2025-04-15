<script setup>
import { inject, computed } from "vue";

const emits = defineEmits(["list", "cards"]);
const isMobile = inject("isMobile");
const segmentedControlIcons = computed(() =>
  isMobile.value ? ["LayoutList", "LayoutCards", "CropPortrait"] : ["LayoutList", "LayoutCards"],
);
</script>

<template>
  <div class="tb-wrapper" :class="{ mobile: isMobile }">
    <div class="tb-control">
      <SegmentedControl
        :icons="segmentedControlIcons"
        @change="(idx) => (idx == 0 ? $emit('list') : $emit('cards'))"
      />
    </div>
    <div class="tb-search">
      <SearchBar />
    </div>
  </div>
</template>

<style scoped>
.tb-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  column-gap: 48px;
  row-gap: 8px;
  max-width: calc(100% - (100px + 48px));

  &.mobile {
    background-color: var(--extra-light);
  }
}

.tb-wrapper .tb-search {
  flex: 1;
}

.tb-control {
  align-content: center;
  flex: 0;
}
</style>
