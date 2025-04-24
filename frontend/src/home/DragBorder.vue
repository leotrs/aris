<script setup>
  import { watch, computed, useTemplateRef } from "vue";
  import { useDraggable } from "@vueuse/core";

  const props = defineProps({
    active: { type: Boolean, default: false },
    panesHeight: { type: Number, default: 100 },
  });
  const model = defineModel({ type: Number });
  const pointerEvents = computed(() => (props.active ? "all" : "none"));

  /* Usually, we would just set :style="style" on the handle,
   * however, style has px units and we prefer percentages so
   * the handle is responsive to viewport resizing. */
  const onDrag = (pos) => (model.value = pos.y);
  const containerRef = useTemplateRef("container-ref");
  const { y } = useDraggable(useTemplateRef("handle-ref"), {
    initialValue: { x: 0, y: 0 },
    preventDefault: true,
    axis: "y",
    containerElement: containerRef,
    onMove: onDrag,
  });

  const handleTop = computed(() => {
    const height = containerRef.value?.clientHeight ?? 1;
    const percentage = (y.value / height) * 100;
    return `${percentage}%`;
  });
</script>

<template>
  <div class="spacer"></div>
  <div ref="container-ref" class="container">
    <div ref="handle-ref" class="handle"></div>
  </div>
</template>

<style scoped>
  .spacer {
    height: 8px;
  }

  .container {
    position: absolute;
    top: calc(16px + 48px + 16px + 40px);
    bottom: 20%;
    outline: 2px solid blue;
    width: 100%;
    pointer-events: none;
  }

  .handle {
    width: 100%;
    height: 8px;
    background-color: pink;
    position: absolute;
    pointer-events: v-bind(pointerEvents);
    top: v-bind(handleTop);
  }
</style>
