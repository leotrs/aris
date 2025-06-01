<script setup>
  import {
    ref,
    watch,
    watchEffect,
    inject,
    computed,
    onMounted,
    useTemplateRef,
    nextTick,
  } from "vue";
  import { useElementSize } from "@vueuse/core";
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
  import Tooltip from "./Tooltip.vue";

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

  // Tooltip state
  const hoveredElement = ref(null);
  const tooltipContent = ref("");

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

    // Remake when necessary
    watchEffect(async () => {
      if (!wrapperRef.value || !props.file) return;
      const { svg: newSvg, svgInitialData: newData } = await makeMinimap(
        props.file,
        isHorizontal.value,
        wrapperWidth.value,
        wrapperHeight.value,
        {
          side: props.side,
          highlightScroll: props.highlightScroll,
          trackWidth: props.trackWidth,
          shape: props.shape,
          html: props.file.html,
        }
      );
      html.value = newSvg;
      svgInitialData.value = newData;
    });

    // Responsiveness
    watch(
      () => (isHorizontal.value ? wrapperWidth.value : wrapperHeight.value),
      async (newDimension) => {
        if (newDimension <= 0 || !wrapperRef.value) return;
        await resizeMinimap(
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
      async (newVal) => {
        if (!wrapperRef.value || !props.highlightScroll) return;
        await highlightScrollPos(
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
      async (newIcons) => {
        if (!wrapperRef.value || !newIcons || !props.file.isMountedAt) return;
        icons.value = await makeIcons(newIcons, props.file.isMountedAt, wrapperRef.value);
        console.log(icons.value);
      },
      { immediate: true }
    );

    // Setup tooltips for dynamically created elements
    watch(
      html,
      () => {
        if (!wrapperRef.value) return;

        wrapperRef.value.querySelectorAll(".mm-shape-group").forEach((shape) => {
          shape.addEventListener("mouseenter", () => {
            hoveredElement.value = shape;
            tooltipContent.value = shape.dataset.title || "";
          });
          shape.addEventListener("click", () => {
            const anchorId = shape.dataset.anchor;
            if (!anchorId) return;

            // try to go to the header, not to the section itself
            let targetEl = document.getElementById(anchorId);
            const header = targetEl.querySelector("& > .hr");
            if (header) targetEl = header;
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          });
          shape.addEventListener("mouseleave", () => {
            hoveredElement.value = null;
            tooltipContent.value = "";
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
    <Tooltip :anchor="hoveredElement" :content="tooltipContent" placement="left" />
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

  .mm-main > svg {
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

    & g.mm-shape-group:hover {
      cursor: pointer;
    }

    & g.mm-shape-group > path.mm-shape-box {
      stroke: transparent;
    }

    & g.mm-shape-group > path.mm-shape {
      stroke: var(--border-primary);
    }

    & g.mm-shape-group:hover > path.mm-shape {
      stroke: var(--border-action);
    }

    & path.mm-shape {
      fill: var(--surface-page);
      stroke: var(--mm-gray);
      transition:
        fill 0.3s ease,
        stroke 0.3s ease;

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
