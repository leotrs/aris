<script setup>
  import { ref, watch, computed, onMounted, useTemplateRef } from "vue";
  import { useElementSize, useDebounceFn } from "@vueuse/core";

  const props = defineProps({
    doc: { type: Object, required: true },
    orientation: { type: String, default: "vertical" },
  });

  const orientationClass = computed(() =>
    props.orientation == "horizontal" ? "horizontal" : "vertical"
  );

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

  const countLeadingPounds = (str) => {
    const match = str.match(/^\s*#+/);
    return match ? match[0].trimStart().length : 0;
  };

  const getSectionsFromSource = (src) => {
    const lines = src.split("\n");
    if (!src || lines.length < 1) return [];

    const regex1 = /:.*?section:/;
    const regex2 = /^\s*?#{1,5}\s*?.*?$/;
    const sections = lines
      .map((line, idx) => ({
        lineno: idx,
        isSection: regex1.test(line) || regex2.test(line),
        line: line,
      }))
      .filter((line) => line.isSection)
      .map((obj) => ({
        percent: obj.lineno / lines.length,
        level: countLeadingPounds(obj.line) + 1,
      }));

    return [{ percent: 0, level: 1 }, ...sections];
  };

  const adjustCirclePositions = (circles, initialLineHeight, minGap) => {
    circles.sort((a, b) => a.cy - b.cy);

    // First pass: identify overlaps and calculate total needed shift
    let totalOverlap = 0;
    const overlaps = [];

    for (let i = 1; i < circles.length; i++) {
      const prev = circles[i - 1];
      const curr = circles[i];
      const minDistance = prev.r + curr.r + minGap;
      const actualDistance = curr.cy - prev.cy;

      if (actualDistance < minDistance) {
        const overlap = minDistance - actualDistance;
        overlaps.push({ index: i, overlap });
        totalOverlap += overlap;
      } else {
        overlaps.push({ index: i, overlap: 0 });
      }
    }

    // Second pass: distribute remaining space
    if (totalOverlap > 0) {
      const availableSpace = initialLineHeight - circles[0].cy - circles[circles.length - 1].cy;
      const spaceToUse = Math.min(availableSpace * 0.8, totalOverlap); // Use at most 80% of available space

      let cumulativeShift = 0;
      for (let i = 1; i < circles.length; i++) {
        // Apply the shift proportionally to each circle's original overlap
        const shiftRatio = overlaps[i - 1].overlap / totalOverlap;
        cumulativeShift += shiftRatio * spaceToUse;
        circles[i].cy += cumulativeShift;
      }
    }

    // Final pass: fix any remaining overlaps with direct adjustments
    if (totalOverlap > 0) {
      for (let i = 1; i < circles.length; i++) {
        const prev = circles[i - 1];
        const curr = circles[i];
        const minDistance = prev.r + curr.r + minGap;

        if (curr.cy - prev.cy < minDistance) {
          curr.cy = prev.cy + minDistance;
        }
      }
    }

    // Calculate the new required line height
    const lastCircle = circles[circles.length - 1];
    const newLineHeight = Math.max(
      initialLineHeight,
      lastCircle.cy + lastCircle.r + 10 // Add some padding at the bottom
    );

    return { circles, newLineHeight };
  };

  const makeMinimap = (
    sections,
    options = { lineHeight: 400, lineX: 12, strokeWidth: 3, radiusDelta: 2, minGap: -4 }
  ) => {
    const { lineHeight, lineX, strokeWidth, radiusDelta, minGap } = options;
    let circles = sections.map(({ percent, level }) => ({
      cx: lineX,
      cy: percent * lineHeight,
      r: radiusDelta * (6 - level),
    }));
    const { circles: adjustedCircles, newLineHeight } = adjustCirclePositions(
      circles,
      lineHeight,
      minGap
    );
    circles = adjustedCircles;

    const minY = Math.min(...circles.map((c) => c.cy - c.r - strokeWidth));
    const maxY = Math.max(newLineHeight, ...circles.map((c) => c.cy + c.r + strokeWidth));
    const maxX = Math.max(...circles.map((c) => c.r + strokeWidth));
    const width = lineX + maxX;
    const height = maxY - minY;

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${minY} ${width} ${height}" width="${width}" height="${height}">
      <line x1="${lineX}" y1="0" x2="${lineX}" y2="${newLineHeight}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
      ${circles.map((c) => `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="white" stroke-width="${strokeWidth}" />`).join("\n  ")}
    </svg>`;
    return svg;
  };

  const html = ref("");
  onMounted(async () => {
    if (!props.doc) return;
    html.value = '<div class="minimap error">-<svg></svg></div>';

    if (props.doc.html) {
      console.log("html found");
    } else if (props.doc.source) {
      console.log("source found");
      const sections = getSectionsFromSource(props.doc.source);
      const minimapHTML = makeMinimap(sections);
      html.value = `<div class="minimap">${minimapHTML}</div>`;
    } else if (props.doc.minimap) {
      html.value = props.doc.minimap;
    }

    await waitForSvgRender();
    /* await transformSVG(); */
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

<style>
  .mm-wrapper .minimap svg line {
    stroke: var(--gray-400);
  }

  .mm-wrapper .minimap svg circle {
    fill: var(--surface-page);
    stroke: var(--gray-400);
    transition:
      fill 0.2s ease,
      stroke 0.2s ease;
  }

  .mm-wrapper .minimap svg circle:hover {
    fill: var(--surface-information);
    stroke: var(--border-action);
    z-index: 999;
  }
</style>
