<script setup>
  import { computed, useTemplateRef } from "vue";
  import { useDraggable } from "@vueuse/core";

  const props = defineProps({ active: { type: Boolean, default: false } });
  const model = defineModel({ type: Number });

  const onDrag = (pos) => (model.value = pos.y);
  const { style } = useDraggable(useTemplateRef("self-ref"), {
    initialValue: { x: 0, y: 0 },
    preventDefault: true,
    axis: "y",
    containerElement: useTemplateRef("container-ref"),
    onMove: onDrag,
  });

  const pointerEvents = computed(() => (props.active ? "all" : "none"));
</script>

<template>
  <div class="spacer"></div>
  <div ref="container-ref" class="container">
    <div ref="self-ref" class="handle" :style="style"></div>
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
  }
</style>
