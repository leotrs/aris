<script setup>
  import { ref, watch, inject, computed, onMounted, useTemplateRef, nextTick } from "vue";
  import { useElementSize } from "@vueuse/core";
  import { useFloating, autoUpdate, offset, shift } from "@floating-ui/vue";
  import {
    IconBookmarkFilled,
    IconStarFilled,
    IconHeartFilled,
    IconCircleCheckFilled,
    IconAlertTriangleFilled,
    IconHelpSquareRoundedFilled,
    IconQuoteFilled,
  } from "@tabler/icons-vue";
  import { makeMinimap, resizeMinimap, highlightScrollPos, makeIcons } from "./MinimapUtils.js";

  const props = defineProps({
    file: { type: Object, required: true },
    orientation: { type: String, default: "vertical" },
    side: { type: String, default: "right" },
    highlightScroll: { type: Boolean, default: true },
    shape: { type: String, default: "line" },
    trackWidth: { type: Number, default: 3 },
  });
  const wrapperRef = useTemplateRef("mm-wrapper");
  const { width: wrapperWidth, height: wrapperHeight } = useElementSize(wrapperRef);
  const yScroll = inject("yScroll", ref(null));
  const html = ref("");
  const svgInitialData = ref(null);
  const isHorizontal = computed(() => props.orientation === "horizontal");
  const icons = ref([]);
  const tooltipReferenceRef = ref(null);
  const tooltipRef = useTemplateRef("tooltip-ref");
  const tooltipText = ref("");
  const { floatingStyles } = useFloating(tooltipReferenceRef, tooltipRef, {
    placement: "left",
    middleware: [offset(6), shift()],
    whileElementsMounted: autoUpdate,
  });

  const classToIconComponent = {
    bookmark: IconBookmarkFilled,
    star: IconStarFilled,
    heart: IconHeartFilled,
    check: IconCircleCheckFilled,
    exclamation: IconAlertTriangleFilled,
    question: IconHelpSquareRoundedFilled,
    quote: IconQuoteFilled,
  };

  onMounted(async () => {
    if (!props.file) return;
    await nextTick();

    // Remake when neccessary
    watch(
      () => [props.side, props.file.id, props.orientation],
      () => {
        if (!wrapperRef.value) return;
        const { svg: newSvg, svgInitialData: newData } = makeMinimap(
          props.file,
          isHorizontal.value,
          wrapperWidth.value,
          wrapperHeight.value,
          {
            side: props.side,
            highlightScroll: props.highlightScroll,
            trackWidth: props.trackWidth,
            shape: props.shape,
          }
        );
        html.value = newSvg;
        svgInitialData.value = newData;
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
          isHorizontal.value,
          wrapperWidth.value,
          wrapperHeight.value,
          svgInitialData.value,
          {
            side: props.side,
            trackWidth: props.trackWidth,
            shape: props.shape,
          }
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
          wrapperRef.value.querySelector("svg"),
          { trackWidth: props.trackWidth }
        );
      },
      { immediate: true }
    );

    // Include feedback icons
    watch(
      () => props.file.icons,
      (newIcons) => {
        if (!wrapperRef.value || !newIcons || !props.file.isMountedAt) return;
        icons.value = makeIcons(newIcons, props.file.isMountedAt, wrapperRef.value);
        console.log(icons.value);
      },
      { immediate: true }
    );

    // Include tooltips
    watch(
      html,
      async () => {
        await nextTick();
        if (!wrapperRef.value) return;

        wrapperRef.value.querySelectorAll(".mm-shape").forEach((shape) => {
          shape.addEventListener("mouseenter", (e) => {
            tooltipReferenceRef.value = e.target;
            tooltipText.value = e.target.dataset.title;
          });
          shape.addEventListener("mouseleave", (e) => {
            tooltipText.value = "";
          });
        });
      },
      { immediate: true, flush: "post" }
    );
  });
</script>

<template>
  <div ref="mm-wrapper" class="mm-wrapper" :class="[orientation, side]">
    <div class="mm-main" v-html="html"></div>
    <div class="mm-icons">
      <component
        :is="classToIconComponent[obj.class]"
        v-for="obj in icons"
        :key="obj.class"
        :class="obj.class"
        :style="{ top: `${obj.pos * 100}%` }"
      />
    </div>
    <div ref="tooltip-ref" class="mm-tooltip" :style="floatingStyles">{{ tooltipText }}</div>
  </div>
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
    position: relative;

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

  .mm-wrapper > .mm-main > svg {
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

  .mm-icons {
    position: absolute;
    width: 32px;
    height: 100%;
    top: 0;
    right: 40px;

    & > svg.tabler-icon {
      position: absolute;
      transform: translateY(-100%);
    }
  }
</style>
