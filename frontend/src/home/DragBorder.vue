<script setup>
  import { ref, computed, useTemplateRef, onMounted } from "vue";
  import { useDraggable } from "@vueuse/core";

  const props = defineProps({
    active: { type: Boolean, default: false },
    boxTop: { type: Number, required: true },
    boxBot: { type: Number, default: 48 + 16 },
    parentHeight: { type: Number, required: true },
  });
  const pointerEvents = computed(() => (props.active ? "all" : "none"));

  const topPercent = computed(() => Math.max((props.boxTop / props.parentHeight) * 100, 5));
  const botPercent = computed(() => Math.min((props.boxBot / props.parentHeight) * 100, 95));
  const boxRef = useTemplateRef("box-ref");
  const boxHeight = computed(() => boxRef.value?.clientHeight ?? 1);
  const handleTop = ref("0%");

  const pos = defineModel({ type: Number });
  const onDrag = (newPos) => {
    const boxHeightPercent = (boxHeight.value / props.parentHeight) * 100;
    pos.value =
      (newPos.y / boxHeight.value) * (boxHeightPercent - props.offsetPercent) + props.offsetPercent;
    handleTop.value = `${(newPos.y / boxHeight.value) * 100}%`;
    console.log(newPos, handleTop.value);
  };
  useDraggable(useTemplateRef("handle-ref"), {
    initialValue: { x: 0, y: 0 },
    preventDefault: true,
    axis: "y",
    containerElement: boxRef,
    onMove: onDrag,
  });
  onMounted(() => onDrag(topPercent.value));
</script>

<template>
  <div class="spacer"></div>
  <div ref="box-ref" class="box" :style="{ bottom: `${boxBot}px`, top: `${boxTop}px` }">
    <div
      ref="handle-ref"
      class="handle"
      :style="{ 'pointer-events': pointerEvents, top: handleTop }"
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
