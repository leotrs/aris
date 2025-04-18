<script setup>
import { ref, watch, computed, onMounted, useTemplateRef, nextTick } from "vue";
import { useElementSize, useDebounceFn } from "@vueuse/core";
import axios from "axios";

const props = defineProps({
  doc: { type: Object, required: true },
  orientation: { type: String, default: "vertical" },
});

const orientationClass = computed(() => props.orientation == "horizontal" ? "horizontal" : "vertical");
const html = ref('<div class="minimap loading">loading minimap...</div>');
const wrapper = useTemplateRef("wrapper");
const originalHeight = ref(null);
const { width: wrapperWidth } = useElementSize(wrapper);

const waitForSvgRender = () =>
  new Promise((resolve) => {
    const interval = setInterval(() => {
      const svg = wrapper.value?.querySelector("svg");
      if (svg) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });

const transformSVG = useDebounceFn(() => {
  if (props.orientation == "vertical") return;
  if (!html.value || !wrapperWidth.value || !wrapper.value) return;

  const svg = wrapper.value.querySelector("svg");
  if (!svg) return;

  // only modify the viewBox the first time
  if (!originalHeight.value) {
    const regex = /viewBox="0 0 \d+ (\d+)"/i;
    const match = regex.exec(svg.outerHTML);
    originalHeight.value = match?.[1] ? parseFloat(match[1]) : null;
  }
  if (!originalHeight.value) return;

  const scale = wrapperWidth.value / (originalHeight.value + 48);
  const padding = 14; // the rect starts at x=14 in the original coordinates

  svg.style.width = `${wrapperWidth.value}px`;
  svg.setAttribute("viewBox", `0 0 ${wrapperWidth.value} 32`);
  svg.style.transform = `rotate(270deg)`;
  svg.style.transformOrigin = `14px 20px`;

  const rects = svg.querySelectorAll("rect");
  rects?.forEach((rect) =>
    rect.setAttribute("height", originalHeight.value * scale - padding * 2)
  );

  const circles = svg.querySelectorAll("circle");
  circles?.forEach((circle) => {
    const pos = parseFloat(circle.getAttribute("data-pos"));
    if (!isNaN(pos)) {
      circle.style.transform = `translateY(${(padding - pos) * (1 - scale)}px)`;
    }
  });
}, 50);

onMounted(async () => {
  if (!props.doc) return;
  try {
    const url = `http://localhost:8000/documents/${props.doc.id}/content/minimap`;
    const response = await axios.get(url);
    if (response.status == 200 && !response.data) {
      html.value = '<div class="minimap error">-</div>';
    } else {
      html.value = response.data;
      await nextTick();
      await waitForSvgRender();
      originalHeight.value = null;
      transformSVG();
      html.value = response.data;
    }
  } catch (error) {
    console.error(error);
    html.value = '<div class="minimap error">error when retrieving minimap!</div>';
  }
});

watch(wrapperWidth, () => transformSVG(), { immediate: true });
</script>

<template>
  <div class="mm-wrapper" :class="orientationClass" ref="wrapper" v-html="html"></div>
</template>

<style scoped>
:deep(.minimap) {
  &.loading {
    color: var(--light);
    background-color: var(--information-500);
  }

  &.error {
    background-color: var(--error-500);
  }
}

:deep(.minimap:not(.loading)),
:deep(.minimap:not(.error)) {
  background-color: transparent;
  width: 100%;

  & svg {
    overflow: visible;
  }
}

.mm-wrapper.horizontal,
.mm-wrapper.horizontal :deep(.minimap) {
  height: 48px;
}

.mm-wrapper.vertical {
  & :deep(.minimap) {
    width: 48px;
    display: flex;
    justify-content: center;
  }
}
</style>
