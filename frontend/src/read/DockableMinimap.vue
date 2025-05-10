<script setup>
  import { inject, reactive, computed } from "vue";

  const props = defineProps({
    doc: { type: Object, required: true },
    side: { type: String, required: true },
  });
  // The location of the shapes depends on which dock we're in
  const dockSideToShapeSide = {
    left: "right",
    right: "left",
    top: "bottom",
  };

  // The props to be passed on to the minimap
  const minimapProps = reactive({
    doc: props.doc,
    orientation: props.side == "top" ? "horizontal" : "vertical",
    side: dockSideToShapeSide[props.side],
    highlightScroll: true,
    shape: "line",
    trackWidth: props.side == "right" ? 8 : 3,
  });

  // Positioning, size, and other styles
  const top = computed(() => {
    if (props.side == "left") {
      return "calc(64px + 6px)";
    } else if (props.side == "right") {
      return "calc(64px + 6px)";
    } else if (props.side == "top") {
      return "0px";
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
      return "0px";
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
  const sizes = inject("columnSizes");
  const minimapHeight = computed(() => {
    if (["left", "right"].includes(props.side)) {
      const height = sizes.inner.height;
      return height ? `${height}px` : "100%";
    } else if (props.side == "top") {
      return "64px";
    } else {
      console.error(`Unknown side ${props.side}`);
      return "0";
    }
  });
  const minimapWidth = computed(() => {
    if (["left", "right"].includes(props.side)) {
      return "fit-content";
    } else if (props.side == "top") {
      const width = sizes.middle.width;
      return width ? `${width}px` : "100%";
    } else {
      console.error(`Unknown side ${props.side}`);
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

  .mm-wrapper > :deep(:is(.mm-main, .mm-icons)) {
    height: v-bind("minimapHeight");
    width: v-bind("minimapWidth");
  }
</style>
