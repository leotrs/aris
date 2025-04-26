<script setup>
  import { ref, watch, inject, onMounted, useTemplateRef, nextTick } from "vue";
  import { useElementSize } from "@vueuse/core";

  const props = defineProps({
    doc: { type: Object, required: true },
    orientation: { type: String, default: "vertical" },
  });

  /* Utilities */
  const countLeadingPounds = (str) => {
    const match = str.match(/^\s*#+/);
    return match ? match[0].trimStart().length : 0;
  };

  /* Extract information from different sources */
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

  /* SVG manipulation */
  const resizeMinimap = (wrapper, initialData) => {
    const svg = wrapper.querySelector("svg");
    if (!svg) return;
    const { initialHeight, initialCircles, lineX, strokeWidth } = initialData;

    const containerHeight = wrapper.clientHeight;
    if (containerHeight <= 0) return;
    const scaleFactor = containerHeight / initialHeight;
    console.log("Resizing with scale factor:", scaleFactor, "container height:", containerHeight);

    // Update line height
    const line = svg.querySelector("line");
    if (line) line.setAttribute("y2", initialHeight * scaleFactor);

    // Update circle positions
    const circles = svg.querySelectorAll("circle");
    circles.forEach((circle, index) =>
      circle.setAttribute("cy", initialCircles[index].cy * scaleFactor)
    );

    // Update viewBox to match new dimensions
    const cAttr = (c, a) => parseFloat(c.getAttribute(a));
    const maxX = Math.max(...[...circles].map((c) => cAttr(c, "cx") + cAttr(c, "r") + strokeWidth));
    const minY = Math.min(...[...circles].map((c) => cAttr(c, "cy") - cAttr(c, "r") - strokeWidth));
    const maxY = Math.max(
      initialHeight * scaleFactor,
      ...[...circles].map((c) => cAttr(c, "cy") + cAttr(c, "r") + strokeWidth)
    );
    const width = lineX + maxX;
    const height = maxY - minY;
    /* svg.setAttribute("viewBox", `0 ${minY} ${width} ${height}`); */
    /* svg.setAttribute("height", height); */
    svg.setAttribute("viewBox", `0 ${minY} ${width} ${height}`);
    svg.style.width = "100%";
    svg.style.height = "100%";
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
    const newLineHeight = Math.max(initialLineHeight, lastCircle.cy + lastCircle.r);

    return { circles, newLineHeight };
  };

  const svgInitialData = ref(null);
  const circlePositions = ref([]);
  const makeMinimap = (
    sections,
    containerHeight = 400,
    options = { lineX: 12, strokeWidth: 3, radiusDelta: 2, minGap: -4 }
  ) => {
    const { lineX, strokeWidth, radiusDelta, minGap } = options;
    const lineHeight = containerHeight || 400;
    let circles = sections.map(({ percent, level }) => ({
      cx: lineX,
      cy: percent * lineHeight,
      r: radiusDelta * (6 - level),
    }));
    /* const { circles: adjustedCircles, newLineHeight } = adjustCirclePositions(
     *   circles,
     *   lineHeight,
     *   minGap
     * );
     * circles = adjustedCircles;
     * lineHeight = newLineHeight; */

    // Store initial data for future resizing
    svgInitialData.value = {
      initialHeight: lineHeight,
      initialCircles: JSON.parse(JSON.stringify(circles)), // Deep copy to prevent reference issues
      lineX,
      strokeWidth,
    };
    circlePositions.value = JSON.parse(JSON.stringify(circles));

    const minY = Math.min(...circles.map((c) => c.cy - c.r - strokeWidth));
    const maxY = Math.max(lineHeight, ...circles.map((c) => c.cy + c.r + strokeWidth));
    const maxX = Math.max(...circles.map((c) => c.r + strokeWidth));
    const width = lineX + maxX;
    const height = maxY - minY;

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${minY} ${width} ${height}" preserveAspectRatio="xMidYMid meet" >
      <line x1="${lineX}" y1="0" x2="${lineX}" y2="${lineHeight}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
      ${circles.map((c, idx) => `<circle class="mm-circle" data-index="${idx} "cx="${c.cx}" cy="${c.cy}" r="${c.r}" stroke-width="${strokeWidth}" />`).join("\n  ")}
      <line class="scroll-indicator" x1="${lineX}" y1="0" x2="${lineX}" y2="0" stroke-width="${strokeWidth}" stroke-linecap="round"/>
    </svg>`;
    return svg;
  };

  const highlightScrollPos = (pos) => {
    if (!wrapperRef.value) return;

    // Skip if position is too small
    if (pos < 0.5) return;

    const svg = wrapperRef.value.querySelector("svg");
    const circles = svg.querySelectorAll("circle.mm-circle");
    const scrollIndicator = svg.querySelector(".scroll-indicator");
    const containerHeight = wrapperRef.value.clientHeight;

    // Set the position of the scroll indicator
    const halfHeight = (3 / containerHeight) * 100;
    scrollIndicator.setAttribute("y1", `${pos - halfHeight}%`);
    scrollIndicator.setAttribute("y2", `${pos + halfHeight}%`);

    // Calculate the actual Y position in pixels
    const indicatorY = (pos / 100) * containerHeight;

    // Reset all classes first
    circles.forEach((circle) => {
      circle.classList.remove("current-section", "section-end");
    });

    // Remove any existing section-line highlight
    const existingHighlightLine = svg.querySelector(".section-line-highlight");
    if (existingHighlightLine) {
      existingHighlightLine.remove();
    }

    // Get circle data with positions and sizes
    const circleData = Array.from(circles).map((circle) => ({
      element: circle,
      cy: parseFloat(circle.getAttribute("cy")),
      r: parseFloat(circle.getAttribute("r")), // Radius represents hierarchy level
      cx: parseFloat(circle.getAttribute("cx")),
    }));

    // Sort by vertical position
    circleData.sort((a, b) => a.cy - b.cy);

    // Find the innermost section where the scroll is positioned
    let currentSectionIndex = -1;
    for (let i = circleData.length - 1; i >= 0; i--) {
      if (circleData[i].cy <= indicatorY) {
        currentSectionIndex = i;
        break;
      }
    }

    // If we found a current section, highlight it and the section line
    if (currentSectionIndex >= 0) {
      const currentSection = circleData[currentSectionIndex];
      currentSection.element.classList.add("current-section");

      // Find the end of the current section (next circle of same size or larger)
      const currentRadius = currentSection.r;
      let sectionEndIndex = -1;

      for (let i = currentSectionIndex + 1; i < circleData.length; i++) {
        if (circleData[i].r <= currentRadius) {
          // Same level or higher level (smaller or equal radius)
          sectionEndIndex = i;
          circleData[i].element.classList.add("section-end");
          break; // Only highlight the first one we find
        }
      }

      // If we found both the start and end, highlight the line segment between them
      if (sectionEndIndex >= 0) {
        const sectionEnd = circleData[sectionEndIndex];

        // Create a new line element to highlight the section
        const mainLine = svg.querySelector("line:not(.scroll-indicator)");
        if (mainLine) {
          const lineX = currentSection.cx; // Use the x position from the circles
          const lineStrokeWidth = parseFloat(mainLine.getAttribute("stroke-width")) || 3;

          // Create new line element for the highlighted segment
          const highlightLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
          highlightLine.setAttribute("class", "section-line-highlight");
          highlightLine.setAttribute("x1", lineX);
          highlightLine.setAttribute("y1", currentSection.cy);
          highlightLine.setAttribute("x2", lineX);
          highlightLine.setAttribute("y2", sectionEnd.cy);
          highlightLine.setAttribute("stroke-width", lineStrokeWidth);
          highlightLine.setAttribute("stroke", "var(--primary-300, #a5b4fc)");
          highlightLine.setAttribute("stroke-linecap", "round");

          // Insert the highlight line before the scroll indicator so it appears behind it
          const beforeElement = scrollIndicator || null;
          svg.insertBefore(highlightLine, beforeElement);
        }
      }
    }
  };

  /* Make, mount, display */
  const wrapperRef = useTemplateRef("mm-wrapper");
  const { height: wrapperHeight } = useElementSize(wrapperRef);
  const html = ref("");
  const visibility = ref("hidden");
  onMounted(async () => {
    if (!props.doc) return;
    await nextTick();

    const currentHeight = wrapperRef.value?.clientHeight || 400;
    console.log("Initial container height:", currentHeight);

    if (props.doc.source) {
      const sections = getSectionsFromSource(props.doc.source);
      const minimapSVG = makeMinimap(sections, currentHeight);
      html.value = minimapSVG;
    } else if (props.doc.minimap) {
      html.value = props.doc.minimap;
    } else {
      html.value = "<svg></svg>";
    }
    visibility.value = "visible";

    // Watch for height changes and trigger resize
    watch(wrapperHeight, (newHeight) => {
      if (newHeight > 0 && svgInitialData.value && wrapperRef.value) {
        resizeMinimap(wrapperRef.value, svgInitialData.value);
      }
    });
  });

  /* Highlight scroll position */
  const yScroll = inject("yScroll");
  watch(yScroll, (newVal) => highlightScrollPos(newVal));
</script>

<template>
  <div ref="mm-wrapper" class="mm-wrapper" :style="{ visibility }" v-html="html"></div>
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
    position: fixed;
    width: fit-content;
    top: calc(64px + px);
    left: calc(64px + 48px);
    min-height: 200px;
    height: 75%;
    overflow: hidden;
  }

  .mm-wrapper svg line {
    stroke: var(--gray-400);
  }

  .mm-wrapper svg circle {
    fill: var(--surface-page);
    stroke: var(--gray-400);
    transition:
      fill 0.2s ease,
      stroke 0.2s ease;
  }

  .mm-wrapper svg circle:hover {
    fill: var(--surface-information);
    stroke: var(--border-action);
  }

  .mm-wrapper svg .scroll-indicator {
    stroke: var(--secondary-800);
  }

  .mm-wrapper svg circle.mm-circle {
    transition:
      fill 0.3s ease,
      stroke 0.3s ease;
  }

  .mm-wrapper svg circle.mm-circle.current-section {
    fill: var(--surface-primary);
    stroke: var(--primary-500);
  }

  .mm-wrapper svg circle.mm-circle.section-end {
    fill: var(--surface-primary);
    stroke: var(--primary-500);
  }

  .mm-wrapper svg .section-line-highlight {
    stroke: var(--secondary-300);
    transition: stroke 0.3s ease;
  }
</style>
