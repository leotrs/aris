<script setup>
  import { ref, computed, useTemplateRef, onMounted, watch } from "vue";
  import { useDraggable, useElementSize } from "@vueuse/core";

  const props = defineProps({
    active: { type: Boolean, default: false },
    boxTop: { type: Number, required: true },
    boxBot: { type: Number, default: 48 + 16 },
    parentHeight: { type: Number, required: true },
  });
  const pointerEvents = computed(() => (props.active ? "all" : "none"));

  const botPercent = computed(() => Math.min((props.boxBot / props.parentHeight) * 100, 95));
  const boxRef = useTemplateRef("box-ref");
  const { height: boxHeight } = useElementSize(boxRef);
  const boxHeightPercent = computed(() => (boxHeight.value / props.parentHeight) * 100);
  const topPercent = computed(() => (props.boxTop / props.parentHeight) * 100);

  const borderPos = ref("0%");
  const updateBorderPos = (y) => {
    const posFraction = y / boxHeight.value;
    borderPos.value = `${posFraction * 100}%`;
    return posFraction;
  };

  const pos = defineModel({ type: Number });
  const updatePos = (frac) => {
    pos.value = frac * boxHeightPercent.value + topPercent.value;
  };
  const onDrag = (newPos) => {
    const posFraction = updateBorderPos(newPos.y);
    updatePos(posFraction);

    /* console.log(
     *   "newPos.y",
     *   newPos.y,
     *   "pos",
     *   pos.value,
     *   "posFraction",
     *   posFraction,
     *   "boxHeight",
     *   boxHeight.value,
     *   "boxHeightPercent",
     *   boxHeightPercent.value
     * ) */
  };
  const { isDragging } = useDraggable(useTemplateRef("handle-ref"), {
    initialValue: { x: 0, y: 0 },
    preventDefault: true,
    axis: "y",
    containerElement: boxRef,
    onMove: onDrag,
  });
  defineExpose({ isDragging });
</script>

<template>
  <div class="spacer"></div>
  <div ref="box-ref" class="box" :style="{ bottom: `${boxBot}px`, top: `${boxTop}px` }">
    <div
      ref="handle-ref"
      class="handle"
      :style="{ 'pointer-events': pointerEvents, top: borderPos }"
    ></div>
  </div>
</template>

<style scoped>
  .spacer {
    height: 8px;
  }

  .box {
    position: absolute;
    width: 100%;
    pointer-events: none;
    outline: 2px solid blue;
  }

  .handle {
    position: absolute;
    width: 110%;
    height: 8px;
    cursor: row-resize;
    background-color: pink;
  }
</style>
