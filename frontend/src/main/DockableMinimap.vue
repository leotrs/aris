<script setup>
  import { inject, reactive, computed } from "vue";

  const props = defineProps({
    file: { type: Object, required: true },
    side: { type: String, required: true },
  });

  // The props to be passed on to the minimap
  const minimapProps = reactive({
    file: props.file,
    orientation: props.side == "top" ? "horizontal" : "vertical",
    side: "left",
    highlightScroll: true,
    shape: "line",
    trackWidth: props.side == "right" ? 8 : 3,
  });

  // Positioning, size, and other styles
  const sizes = inject("columnSizes");
  const minimapHeight = computed(() => {
    if (["left", "right"].includes(props.side)) {
      const height = sizes.inner.height;
      return height ? `${height}px` : "100%";
    }
  });
</script>

<template>
  <Minimap v-bind="minimapProps" />
</template>

<style scoped>
  .mm-wrapper {
    top: calc(16px + 13px);
    right: 0;
    height: calc(100% - 16px - 8px - 8px);
    & :deep(svg > line.track) {
      visibility: hidden;
    }
    & :deep(svg > line.scroll-indicator) {
      /* visibility: hidden; */
    }
  }

  .mm-wrapper > :deep(:is(.mm-main, .mm-icons)) {
    height: v-bind("minimapHeight");
    width: fit-content;
  }
</style>
