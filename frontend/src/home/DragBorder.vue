<script setup>
  import { ref, computed, useTemplateRef } from "vue";
  import { useDraggable } from "@vueuse/core";

  const props = defineProps({
    active: { type: Boolean, default: false },
    offset: { type: Number, default: 48 },
  });
  const pos = defineModel({ type: Number });
  const pointerEvents = computed(() => (props.active ? "all" : "none"));

  /* Usually, we would just set :style="style" on the handle,
   * however, style has px units and we prefer percentages so
   * the handle is responsive to viewport resizing. */
  const containerBottom = 30;
  const containerRef = useTemplateRef("container-ref");
  const containerHeight = computed(() => containerRef.value?.clientHeight ?? 1);
  const handleTop = ref("66%");
  const onDrag = (newPos) => {
    const containerHeightPercent = 100 - containerBottom;
    pos.value =
      (newPos.y / containerHeight.value) * (containerHeightPercent - props.offset) + props.offset;
    handleTop.value = `${(newPos.y / containerHeight.value) * 100}%`;
  };
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
  <div
    ref="container-ref"
    class="container"
    :style="{ bottom: `${containerBottom}%`, top: `${offset}%` }"
  >
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
  }

  .handle {
    position: absolute;
    width: 100%;
    height: 8px;
    cursor: row-resize;
  }
</style>
