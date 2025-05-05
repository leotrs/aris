<script setup>
  import { ref, watch, inject, computed, onMounted, useTemplateRef, nextTick } from "vue";
  import { useElementSize } from "@vueuse/core";
  import { makeMinimap, resizeMinimap, highlightScrollPos } from "./MinimapUtils.js";

  const props = defineProps({
    doc: { type: Object, required: true },
    orientation: { type: String, default: "vertical" },
    side: { type: String, default: "right" },
    highlightScroll: { type: Boolean, default: true },
    shape: { type: String, default: "arc" },
    trackWidth: { type: Number, default: 3 },
  });
  const wrapperRef = useTemplateRef("mm-wrapper");
  const { width: wrapperWidth, height: wrapperHeight } = useElementSize(wrapperRef);
  const yScroll = inject("yScroll", ref(null));
  const html = ref("");
  const isHorizontal = computed(() => props.orientation === "horizontal");
  const visibility = ref("hidden");

  onMounted(async () => {
    if (!props.doc) return;
    await nextTick();
    visibility.value = "visible";

    // Remake when neccessary
    watch(
      () => [props.side, props.doc, props.orientation],
      () => {
        if (!wrapperRef.value) return;
        html.value = makeMinimap(
          props.doc,
          isHorizontal.value,
          wrapperWidth.value,
          wrapperHeight.value
        );
      },
      { deep: true, immediate: true }
    );

    // Responsiveness
    watch(
      () => (isHorizontal.value ? wrapperWidth.value : wrapperHeight.value),
      (newDimension) => {
        if (newDimension <= 0 || !wrapperRef.value) return;
        resizeMinimap(
          wrapperRef.value.querySelector("svg"),
          wrapperWidth.value,
          wrapperHeight.value,
          isHorizontal.value
        );
      },
      { immediate: true }
    );

    // Highlight scroll position
    watch(
      yScroll,
      (newVal) => {
        if (!wrapperRef.value || !props.highlightScroll) return;
        highlightScrollPos(
          newVal,
          isHorizontal.value,
          wrapperWidth.value,
          wrapperHeight.value,
          wrapperRef.value.querySelector("svg")
        );
      },
      { immediate: true }
    );
  });
</script>

<template>
  <div
    ref="mm-wrapper"
    class="mm-wrapper"
    :class="[orientation, side]"
    :style="{ visibility }"
    v-html="html"
  ></div>
</template>

<style scoped>
  :deep(.minimap) {
    background-color: transparent;
    width: 100%;
    transition: width 0.3s ease-in-out;
    & svg {
      overflow: visible;
      width: var(--minimap-width);
      transition: width 0.3s ease-in-out;
    }
  }
</style>

<style>
  .mm-wrapper {
    --mm-gray: var(--gray-200);
    overflow: hidden;

    &.vertical {
      height: 75%;
      width: fit-content;
    }

    &.horizontal {
      height: fit-content;
    }

    &.top,
    &.bottom {
      padding-block: 8px;
    }

    &.left,
    &.right {
      padding-inline: 8px;
    }
  }

  .mm-wrapper svg {
    width: 100%;
    height: 100%;

    & line {
      stroke: var(--mm-gray);
    }

    & .scroll-indicator {
      stroke: var(--secondary-800);
    }

    & .current-section {
      stroke: var(--secondary-500);
      opacity: 0.25;
      transition: stroke 0.3s ease;
    }

    & path.mm-shape {
      fill: var(--surface-page);
      stroke: var(--mm-gray);
      transition:
        fill 0.2s ease,
        stroke 0.2s ease;

      &:hover {
        fill: var(--surface-information);
        stroke: var(--border-action);
      }

      &.section-start {
        fill: var(--surface-primary);
        stroke: var(--primary-500);
      }

      &.section-end {
        fill: var(--surface-primary);
        stroke: var(--primary-500);
      }
    }
  }
</style>
