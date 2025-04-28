<script setup>
  import { ref, computed, useTemplateRef, onMounted } from "vue";
  import { useDraggable } from "@vueuse/core";

  const props = defineProps({
    active: { type: Boolean, default: false },
    offset: { type: Number, required: true },
    parentHeight: { type: Number, required: true },
  });
  const pos = defineModel({ type: Number });
  const pointerEvents = computed(() => (props.active ? "all" : "none"));

  const bottom = 48 + 16;
  const containerBottom = computed(() => Math.min((bottom / props.parentHeight) * 100, 95));
  const offsetPercent = computed(() => Math.max((props.offset / props.parentHeight) * 100, 5));
  const containerRef = useTemplateRef("container-ref");
  const containerHeight = computed(() => containerRef.value?.clientHeight ?? 1);
  const handleTop = ref("0%");
  const onDrag = (newPos) => {
    const containerHeightPercent = 100 - containerBottom.value;
    pos.value =
      (newPos.y / containerHeight.value) * (containerHeightPercent - props.offsetPercent) +
      props.offsetPercent;
    handleTop.value = `${(newPos.y / containerHeight.value) * 100}%`;
  };
  onMounted(() => onDrag(offsetPercent.value));
  useDraggable(useTemplateRef("handle-ref"), {
    initialValue: { x: 0, y: 0 },
    preventDefault: true,
    axis: "y",
    containerElement: containerRef,
    onMove: onDrag,
  });
</script>

<template>
  <div class="spacer"></div>
  <div ref="container-ref" class="container" :style="{ bottom: `${bottom}px`, top: `${offset}px` }">
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

  .container {
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
