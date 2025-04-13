<script setup>
import { ref, computed, watch, nextTick, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  doc: { type: Object, required: true },
});
const html = ref('<div class="minimap loading">loading minimap...</div>');

const swapViewBox = (html) => {
  const regex = /viewbox="(\b0\b)\s+(\b0\b)\s+(\d+)\s+(\d+)"/g;
  return html.replace(regex, (_, x, y, w, h) => `viewbox="${y} ${x} ${h} ${w}"`);
};

const waitForSvgRender = () =>
  new Promise((resolve) => {
    const interval = setInterval(() => {
      const svg = document.querySelector(".mm-wrapper svg");
      if (svg) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });

onMounted(async () => {
  try {
    const url = `http://localhost:8000/documents/${props.doc.id}/sections/minimap`;
    const response = await axios.get(url);
    if (response.status == 200 && !response.data) {
      html.value = '<div class="minimap error">-</div>';
    } else {
      html.value = swapViewBox(response.data);
      await nextTick();
      await waitForSvgRender();
      setRectHeight();
      positionCircles();
    }
  } catch (error) {
    console.error(error);
    html.value = '<div class="minimap error">error when retrieving minimap!</div>';
  }
});

const wrapperWidth = computed(
  () => document.querySelector(".mm-wrapper")?.getBoundingClientRect()?.width || null,
);

watch(wrapperWidth, () => setRectHeight());

const setRectHeight = () => {
  if (!wrapperWidth.value) return;
  const svg = document.querySelector(".mm-wrapper svg");
  if (!svg) return;
  svg.setAttribute("viewBox", `0 0 ${wrapperWidth.value} 32`);
  const rects = document.querySelectorAll(".mm-wrapper svg rect");
  rects.forEach((rect) => rect.setAttribute("height", wrapperWidth.value));
};

const positionCircles = () => {
  if (!html.value) return;
  const circles = document.querySelectorAll(".mm-wrapper svg circle");
  if (!circles) return;
  const match = html.value.match(/height="(\d+)"/);
  if (!match) return;

  const originalLength = parseFloat(match[1]);
  const scale = wrapperWidth.value / originalLength;

  circles.forEach((circle) => {
    const pos = parseFloat(circle.getAttribute("data-pos"));
    if (!isNaN(pos)) {
      circle.style.transform = `translateY(${10 - pos * (1 - scale)}px)`;
    }
  });
};
watch(wrapperWidth, () => positionCircles());
</script>

<template>
  <div class="mm-wrapper" v-html="html"></div>
</template>

<style>
.minimap {
  &.loading {
    color: var(--light);
    background-color: var(--information-500);
  }

  &.error {
    background-color: var(--error-500);
  }
}

.minimap:not(.loading),
.minimap:not(.error) {
  background-color: transparent;
  width: 100%;

  & svg {
    overflow: visible;
    height: 48px;
  }
}

.minimap svg g {
  transform: rotate(270deg);
  transform-origin: calc(14px) calc(16px + 4px);
  /* now everything is rotated: height becomes width, translateY becomes translateX, etc */
}
</style>
