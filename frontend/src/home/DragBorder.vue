<script setup>
  import { computed, useTemplateRef } from "vue";
  import { useDraggable } from "@vueuse/core";

  const props = defineProps({
    active: { type: Boolean, default: false },
    offset: { type: Number, default: 48 },
  });
  const model = defineModel({ type: Number });
  const pointerEvents = computed(() => (props.active ? "all" : "none"));

  /* Usually, we would just set :style="style" on the handle,
   * however, style has px units and we prefer percentages so
   * the handle is responsive to viewport resizing. */
  const onDrag = (pos) => (model.value = pos.y);
  const containerRef = useTemplateRef("container-ref");
  const { y } = useDraggable(useTemplateRef("handle-ref"), {
    initialValue: { x: 0, y: window.innerHeight / 3 },
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
  <div ref="container-ref" class="container" :style="{ top: `${offset}px` }">
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
    bottom: 30%;
    outline: 2px solid blue;
    width: 110%;
    pointer-events: none;
  }

  .handle {
    width: 100%;
    height: 8px;
    background-color: pink;
    position: absolute;
  }
</style>
