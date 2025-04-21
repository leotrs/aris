<script setup>
  import { ref, watch, computed, onMounted, useTemplateRef, nextTick } from "vue";
  import { useElementSize, useDebounceFn } from "@vueuse/core";
  import axios from "axios";

  const props = defineProps({
    doc: { type: Object, required: true },
    orientation: { type: String, default: "vertical" },
  });

  const orientationClass = computed(() =>
    props.orientation == "horizontal" ? "horizontal" : "vertical"
  );
  const html = ref('<div class="loading">loading minimap...</div>');
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

  const visibility = ref("hidden");

  const doTransformSVG = () => {
    return new Promise((resolve) => {
      if (props.orientation == "vertical") {
        resolve();
        return;
      }
      if (!html.value || !wrapperWidth.value || !wrapper.value) {
        resolve();
        return;
      }

      const svg = wrapper.value.querySelector("svg");
      if (!svg) {
        resolve();
        return;
      }

      // only modify the viewBox the first time
      if (!originalHeight.value) {
        const regex = /viewBox="0 0 \d+ (\d+)"/i;
        const match = regex.exec(svg.outerHTML);
        originalHeight.value = match?.[1] ? parseFloat(match[1]) : null;
      }
      if (!originalHeight.value) return;

      const scale = wrapperWidth.value / (originalHeight.value + 48);
      const padding = 14; // the rect starts at x=14 in the original coordinates

      svg.style.setProperty("--minimap-width", `${wrapperWidth.value}px`);
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

      resolve();
    });
  };

  const transformSVG = useDebounceFn(async () => await doTransformSVG(), 50);

  try {
    const url = `http://localhost:8000/documents/${props.doc.id}/content/minimap`;
    const response = await axios.get(url);
    if (response.status == 200 && !response.data) {
      html.value = '<div class="minimap error">-</div>';
      visibility.value = "visible";
    } else {
      html.value = response.data;
      originalHeight.value = null;
      html.value = response.data;
    }
  } catch (error) {
    console.error(error);
    html.value = '<div class="minimap error">error when retrieving minimap!</div>';
  }

  onMounted(async () => {
    if (!props.doc) return;
    await waitForSvgRender();
    await transformSVG();
    visibility.value = "visible";
  });

  watch(wrapperWidth, async () => await transformSVG(), { immediate: true });
</script>

<template>
  <div
    ref="wrapper"
    class="mm-wrapper"
    :class="orientationClass"
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

  .mm-wrapper.horizontal,
  .mm-wrapper.horizontal :deep(.minimap) {
    display: flex;
    align-items: center;
    height: 48px;
    margin-block: auto;
  }

  .mm-wrapper.vertical {
    & :deep(.minimap) {
      width: 48px;
      display: flex;
      justify-content: center;
    }
  }
</style>
