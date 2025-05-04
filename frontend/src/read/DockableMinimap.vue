<script setup>
  import { ref, reactive, computed } from "vue";

  const props = defineProps({
    doc: { type: Object, required: true },
    side: { type: String, required: true },
  });

  const dockSideToCircleSide = {
    left: "right",
    right: "left",
    top: "top",
  };
  const minimapProps = reactive({
    doc: props.doc,
    orientation: props.side == "top" ? "horizontal" : "vertical",
    side: dockSideToCircleSide[props.side],
    highlightScroll: true,
  });

  const top = computed(() => {
    if (props.side == "left") {
      return "calc(64px + 16px)";
    } else if (props.side == "right") {
      return "calc(64px + 16px)";
    } else if (props.side == "top") {
      return "16px";
    } else {
      return "0";
    }
  });
  const left = computed(() => {
    if (props.side == "left") {
      return "64px";
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
      return "7.5px";
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
  .mm-wrapper.dock-right {
    height: calc(100% - 64px - 16px);
    & :deep(> svg > line) {
      visibility: hidden;
    }
  }

  .mm-wrapper.dock-left {
    height: calc(100% - 64px - 16px);
  }
</style>
