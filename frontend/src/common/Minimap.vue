<script setup>
  import { ref, watch, inject, onMounted, useTemplateRef, nextTick } from "vue";
  import { useElementSize } from "@vueuse/core";

  const props = defineProps({
    doc: { type: Object, required: true },
    orientation: { type: String, default: "vertical" },
    side: { type: String, default: "right" },
    highlightScroll: { type: Boolean, default: true },
    shape: { type: String, default: "arc" },
    trackWidth: { type: Number, default: 3 },
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

    const offset = 1 / lines.length;
    return [{ percent: offset, level: 1 }, ...sections, { percent: 1 - offset, level: 1 }];
  };

  /* Generate semi-circle path for SVG - enhanced to support all four sides */
  const createShapePath = (cx, cy, r, side, options = { offset: 4 }) => {
    const { offset } = options;
    if (props.shape === "line") {
      const len = 2 * r;
      switch (side) {
        case "left":
          return `M ${cx - offset} ${cy} L ${cx - offset - len} ${cy}`;
        case "right":
          return `M ${cx + offset} ${cy} L ${cx + offset + len} ${cy}`;
        case "top":
          return `M ${cx - offset} ${cy} L ${cx - offset} ${cy - len}`;
        case "bottom":
          return `M ${cx + offset} ${cy} L ${cx + offset} ${cy + len}`;
      }
    } else if (props.shape === "arc") {
      switch (side) {
        case "left":
          return `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r}`;
        case "right":
          return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r}`;
        case "top":
          return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
        case "bottom":
          return `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}`;
      }
    } else {
      console.error(`Unknown shape ${props.shape}, must be one of 'line' or 'arc'`);
    }
  };

  /* Common layout logic for both orientations */
  const createShapes = (sections, lineSize, options, isHorizontal) => {
    const { lineX, lineY, radiusDelta } = options;
    return sections.map(({ percent, level }) => ({
      cx: isHorizontal ? percent * lineSize : lineX,
      cy: isHorizontal ? lineY : percent * lineSize,
      r: radiusDelta * (6 - level),
      percent,
      level,
    }));
  };

  /* SVG manipulation - handle orientation differences and all sides */
  const getLayoutParametersHorizontal = (lineSize, options) => {
    const { lineY, strokeWidth, offset } = options;
    let minX, maxX, minY, maxY;

    minX = -strokeWidth;
    maxX = lineSize + strokeWidth;
    const width = maxX - minX;

    if (props.side == "top") {
      minY = lineY - offset - 20; // 20 = 2 * (radiusDelta * (6-1))
      maxY = lineY + props.trackWidth;
    } else if (props.side == "bottom") {
      minY = lineY - props.trackWidth;
      maxY = lineY + offset + 20; // 20 = 2 * (radiusDelta * (6-1))
    } else {
      console.error(`Unknown side ${props.side}, must be either 'top' or 'bottom'`);
    }
    const height = maxY - minY;

    return {
      viewBox: `${minX} ${minY} ${width} ${height}`,
      track: { x1: "0", y1: lineY, x2: lineSize, y2: lineY },
      scrollLine: { x1: "0", y1: lineY, x2: "0", y2: lineY },
    };
  };

  const getLayoutParametersVertical = (lineSize, options) => {
    const { lineX, strokeWidth, offset } = options;
    let minX, maxX, minY, maxY;

    if (props.side == "left") {
      minX = lineX - offset - 20; // 20 = 2 * (radiusDelta * (6-1))
      maxX = lineX + props.trackWidth;
    } else if (props.side == "right") {
      minX = lineX - props.trackWidth;
      maxX = lineX + offset + 20; // 20 = 2 * (radiusDelta * (6-1))
    } else {
      console.error(`Unknown side ${props.side}, must be either 'left' or 'right'`);
    }
    const width = maxX - minX;

    minY = -strokeWidth;
    maxY = lineSize + strokeWidth;
    const height = maxY - minY;

    return {
      viewBox: `${minX} ${minY} ${width} ${height}`,
      track: { x1: lineX, y1: "0", x2: lineX, y2: lineSize },
      scrollLine: { x1: lineX, y1: "0", x2: lineX, y2: "0" },
    };
  };

  const svgInitialData = ref(null);
  const shapePositions = ref([]);

  const makeMinimap = (
    sections,
    containerSize = 400,
    options = { lineX: 12, lineY: 12, strokeWidth: 3, radiusDelta: 2, offset: 4 }
  ) => {
    const isHorizontal = props.orientation === "horizontal";

    // Leave some padding between the line and the container
    const lineSize = (containerSize || 400) - 8;

    // Create shapes based on orientation
    let shapes = createShapes(sections, lineSize, options, isHorizontal);

    // Store initial data for future resizing
    svgInitialData.value = {
      initialHeight: isHorizontal ? 0 : lineSize,
      initialWidth: isHorizontal ? lineSize : 0,
      initialShapes: JSON.parse(JSON.stringify(shapes)),
      ...options,
    };
    shapePositions.value = JSON.parse(JSON.stringify(shapes));

    // Get layout parameters based on orientation and side
    const layout = isHorizontal
      ? getLayoutParametersHorizontal(lineSize, options)
      : getLayoutParametersVertical(lineSize, options);

    // Create the SVG markup
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${layout.viewBox}" preserveAspectRatio="xMidYMid meet">
      <line class="track"
        x1="${layout.track.x1}"
        y1="${layout.track.y1}"
        x2="${layout.track.x2}"
        y2="${layout.track.y2}"
        stroke-width="${props.trackWidth}"
        stroke-linecap="round"
      />
      ${shapes
        .map(
          (s, idx) =>
            `<path class="mm-shape" data-index="${idx}" data-percent="${s.percent}"
   d="${createShapePath(s.cx, s.cy, s.r, props.side)}"
   stroke-width="${options.strokeWidth - 1}"
   stroke-linecap="round" />`
        )
        .join("\n  ")}
      ${
        props.highlightScroll
          ? `<line class="scroll-indicator"
   x1="${layout.scrollLine.x1}"
   y1="${layout.scrollLine.y1}"
   x2="${layout.scrollLine.x2}"
   y2="${layout.scrollLine.y2}"
   stroke-width="${options.strokeWidth}"
   stroke-linecap="round"
   />`
          : ""
      }
    </svg>`;

    return svg;
  };

  const resizeMinimap = (
    wrapper,
    initialData,
    options = {
      lineX: 12,
      lineY: 12,
      strokeWidth: 3,
      radiusDelta: 2,
      offset: 4,
      minSizeForSubsections: 250,
    }
  ) => {
    const svg = wrapper.querySelector("svg");
    if (!svg) return;

    const { minSizeForSubsections } = options;
    const isHorizontal = props.orientation === "horizontal";
    const { initialHeight, initialWidth, initialShapes } = initialData;

    // Get container dimension based on orientation
    const containerDimension = isHorizontal ? wrapper.clientWidth : wrapper.clientHeight;
    if (containerDimension <= 0) return;

    // Calculate scale factor
    const initialDimension = isHorizontal ? initialWidth : initialHeight;
    const scaleFactor = containerDimension / initialDimension;

    // Update track
    const line = svg.querySelector("line.track");
    if (line) {
      const lineAttr = isHorizontal ? "x2" : "y2";
      line.setAttribute(lineAttr, initialDimension * scaleFactor);
    }

    // Update shape positions
    const paths = svg.querySelectorAll("path.mm-shape");
    paths.forEach((path, index) => {
      const shape = initialShapes[index];
      let newCx = isHorizontal ? shape.cx * scaleFactor : shape.cx;
      let newCy = isHorizontal ? shape.cy : shape.cy * scaleFactor;
      path.setAttribute("d", createShapePath(newCx, newCy, shape.r, props.side));

      // Hide small subsections if container is too small
      const shouldHide = containerDimension < minSizeForSubsections && shape.level > 2;
      path.style.visibility = shouldHide ? "hidden" : "visible";
    });

    const layout = isHorizontal
      ? getLayoutParametersHorizontal(containerDimension, options)
      : getLayoutParametersVertical(containerDimension, options);
    svg.setAttribute("viewBox", layout.viewBox);
    svg.style.width = "100%";
    svg.style.height = "100%";
  };

  const highlightScrollPos = (pos) => {
    if (!wrapperRef.value) return;

    const scrollPercent = pos / 100;
    const containerDimension =
      props.orientation === "horizontal"
        ? wrapperRef.value.clientWidth
        : wrapperRef.value.clientHeight;
    const scrollPos = scrollPercent * containerDimension;
    const svg = wrapperRef.value.querySelector("svg");
    const paths = svg.querySelectorAll("path.mm-shape");
    const scrollIndicator = svg.querySelector(".scroll-indicator");

    // Set the position of the scroll indicator
    if (props.orientation === "horizontal") {
      scrollIndicator.setAttribute("x1", scrollPos);
      scrollIndicator.setAttribute("x2", scrollPos);
    } else {
      scrollIndicator.setAttribute("y1", `${pos}%`);
      scrollIndicator.setAttribute("y2", `${pos}%`);
    }

    // Reset classes and existing current-section line
    paths.forEach((path) => path.classList.remove("section-start", "section-end"));
    svg.querySelector(".current-section")?.remove();

    // Get path data with positions and percentages
    const pathData = Array.from(paths).map((path) => {
      const percent = parseFloat(path.getAttribute("data-percent")) * 100;
      const idx = parseInt(path.getAttribute("data-index"));
      const shape = shapePositions.value[idx];
      return {
        element: path,
        cx: shape.cx,
        cy: shape.cy,
        r: shape.r,
        percent,
      };
    });

    // Sort by percentage (scroll position)
    pathData.sort((a, b) => a.percent - b.percent);

    // Find and highlight the start: the innermost section where the scroll is positioned
    let sectionStartIndex = -1;
    for (let i = pathData.length - 1; i >= 0; i--) {
      if (pathData[i].percent <= pos) {
        sectionStartIndex = i;
        break;
      }
    }
    if (sectionStartIndex < 0) return;
    const sectionStart = pathData[sectionStartIndex];
    sectionStart.element.classList.add("section-start");

    // Find and highlight the end: the next shape of same size or larger
    const currentRadius = sectionStart.r;
    let sectionEndIndex = -1;
    for (let i = sectionStartIndex + 1; i < pathData.length; i++) {
      if (pathData[i].r >= currentRadius) {
        sectionEndIndex = i;
        break;
      }
    }
    if (sectionEndIndex < 0 || sectionEndIndex >= pathData.length) return;
    const sectionEnd = pathData[sectionEndIndex];
    sectionEnd.element.classList.add("section-end");

    // If we found both the start and end, highlight the line segment between them
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("class", "current-section");
    line.setAttribute("stroke-width", props.trackWidth);
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("x1", sectionStart.cx);
    line.setAttribute("y1", sectionStart.cy);
    line.setAttribute("x2", sectionEnd.cx);
    line.setAttribute("y2", sectionEnd.cy);
    svg.insertBefore(line, scrollIndicator || null);
  };

  /* Make, mount, display */
  const wrapperRef = useTemplateRef("mm-wrapper");
  const { width: wrapperWidth, height: wrapperHeight } = useElementSize(wrapperRef);
  const html = ref("");
  const visibility = ref("hidden");

  onMounted(async () => {
    if (!props.doc) return;
    await nextTick();

    const isHorizontal = props.orientation === "horizontal";
    const currentSize = isHorizontal
      ? wrapperRef.value?.clientWidth || 400
      : wrapperRef.value?.clientHeight || 400;

    if (props.doc.source) {
      const sections = getSectionsFromSource(props.doc.source);
      const minimapSVG = makeMinimap(sections, currentSize);
      html.value = minimapSVG;
    } else if (props.doc.minimap) {
      html.value = props.doc.minimap;
    } else {
      html.value = "<svg></svg>";
    }

    visibility.value = "visible";

    // Setup responsive behavior
    const dimensionWatcher = isHorizontal ? wrapperWidth : wrapperHeight;
    watch(
      dimensionWatcher,
      (newDimension) => {
        if (newDimension > 0 && svgInitialData.value && wrapperRef.value) {
          resizeMinimap(wrapperRef.value, svgInitialData.value);
        }
      },
      { immediate: true }
    );

    // Watch for side changes
    watch(
      () => props.side,
      () => {
        if (svgInitialData.value && wrapperRef.value && props.doc.source) {
          const currentSize = isHorizontal
            ? wrapperRef.value?.clientWidth || 400
            : wrapperRef.value?.clientHeight || 400;
          const sections = getSectionsFromSource(props.doc.source);
          html.value = makeMinimap(sections, currentSize);
        }
      }
    );
  });

  /* Highlight scroll position */
  const yScroll = inject("yScroll", ref(null));
  watch(yScroll, (newVal) => props.highlightScroll && highlightScrollPos(newVal));
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
