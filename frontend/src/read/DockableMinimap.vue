<script setup>
  import { reactive, computed } from "vue";

  const props = defineProps({
    doc: { type: Object, required: true },
    side: { type: String, required: true },
  });

  const dockSideToShapeSide = {
    left: "right",
    right: "left",
    top: "bottom",
  };

  const minimapProps = reactive({
    doc: props.doc,
    orientation: props.side == "top" ? "horizontal" : "vertical",
    side: dockSideToShapeSide[props.side],
    highlightScroll: true,
    shape: "line",
    trackWidth: props.side == "right" ? 8 : 3,
  });

  const top = computed(() => {
    if (props.side == "left") {
      return "calc(64px + 6px)";
    } else if (props.side == "right") {
      return "calc(64px + 6px)";
    } else if (props.side == "top") {
      return "16px";
    } else {
      return "0";
    }
  });
  const left = computed(() => {
    if (props.side == "left") {
      return "calc(64px - 16px)";
    } else if (props.side == "right") {
      return "";
    } else if (props.side == "top") {
      return "64px";
    } else {
      return "0";
    }
  });
  const right = computed(() => {
    if (props.side == "left") {
      return "";
    } else if (props.side == "right") {
      return "-4px";
    } else if (props.side == "top") {
      return "64px";
    } else {
      return "0";
    }
  });
</script>

<template>
  <Minimap v-bind="minimapProps" :class="`dock-${side}`" :style="{ top, left, right }" />
</template>

<style scoped>
  .mm-wrapper.dock-left,
  .mm-wrapper.dock-right {
    height: calc(100% - 64px - 16px - 8px - 8px);
    & :deep(svg > line.track) {
      visibility: hidden;
    }
  }

  .mm-wrapper.dock-right {
    & :deep(svg > line.scroll-indicator) {
      visibility: hidden;
    }
  }
</style>
