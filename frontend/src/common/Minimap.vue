<script setup>
  import { ref, watch, inject, onMounted, useTemplateRef, nextTick } from "vue";
  import { useElementSize } from "@vueuse/core";

  const props = defineProps({
    doc: { type: Object, required: true },
    orientation: { type: String, default: "vertical" },
    side: { type: String, default: "right" },
    highlightScroll: { type: Boolean, default: true },
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

  /* Generate semi-circle path for SVG - enhanced to support all four sides */
  const createSemiCirclePath = (cx, cy, r, side) => {
    // Determine the arc parameters based on side
    switch (side) {
      case "left":
        // Left semi-circle
        return `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r}`;
      case "right":
        // Right semi-circle
        return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r}`;
      case "top":
        // Top semi-circle
        return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
      case "bottom":
        // Bottom semi-circle
        return `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}`;
      default:
        // Default to right side
        return `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r}`;
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
  const getLayoutParameters = (shapes, lineSize, options, isHorizontal, side) => {
    const { lineX, lineY } = options;
    const isHorizontalSide = side === "top" || side === "bottom";

    // Determine if we're dealing with horizontal or vertical sides
    const isNormalOrientation =
      (isHorizontal && !isHorizontalSide) || (!isHorizontal && isHorizontalSide);

    if (isHorizontal) {
      // Horizontal orientation
      const sideOffset = isHorizontalSide ? (side === "top" ? -1 : 1) : side === "left" ? -1 : 1;

      const minX = Math.min(
        0,
        ...shapes.map((s) =>
          isHorizontalSide ? s.cx - s.r : side === "left" ? s.cx - s.r : s.cx - s.r / 4
        )
      );
      const maxX = Math.max(
        lineSize,
        ...shapes.map((s) =>
          isHorizontalSide ? s.cx + s.r : side === "right" ? s.cx + s.r : s.cx + s.r / 4
        )
      );

      const minY = Math.min(
        0,
        ...shapes.map((s) => (isHorizontalSide && side === "top" ? s.cy - s.r : 0))
      );
      const maxY = Math.max(
        lineY,
        ...shapes.map((s) => (isHorizontalSide && side === "bottom" ? s.cy + s.r : s.cy + s.r))
      );

      const width = maxX - minX;
      const height = maxY - minY;

      return {
        viewBox: `${minX} ${minY} ${width} ${height}`,
        mainLine: { x1: "0", y1: lineY, x2: lineSize, y2: lineY },
        scrollLine: { x1: "0", y1: lineY, x2: "0", y2: lineY },
      };
    } else {
      // Vertical orientation
      const minY = Math.min(
        0,
        ...shapes.map((s) =>
          isHorizontalSide ? (side === "top" ? s.cy - s.r : s.cy - s.r / 4) : s.cy - s.r
        )
      );
      const maxY = Math.max(
        lineSize,
        ...shapes.map((s) =>
          isHorizontalSide ? (side === "bottom" ? s.cy + s.r : s.cy + s.r / 4) : s.cy + s.r
        )
      );

      const minX = Math.min(
        0,
        ...shapes.map((s) => (!isHorizontalSide && side === "left" ? s.cx - s.r : 0))
      );
      const maxX = Math.max(
        lineX,
        ...shapes.map((s) => (!isHorizontalSide && side === "right" ? s.cx + s.r : s.cx + s.r))
      );

      const width = maxX - minX;
      const height = maxY - minY;

      return {
        viewBox: `${minX} ${minY} ${width} ${height}`,
        mainLine: { x1: lineX, y1: "0", x2: lineX, y2: lineSize },
        scrollLine: { x1: lineX, y1: "0", x2: lineX, y2: "0" },
      };
    }
  };

  /* Universal overlap resolution for both orientations */
  const adjustShapePositions = (shapes, initialSize, minGap, isHorizontal) => {
    const axisProp = isHorizontal ? "cx" : "cy";

    // Sort by position
    shapes.sort((a, b) => a[axisProp] - b[axisProp]);

    // First pass: identify overlaps and calculate total needed shift
    let totalOverlap = 0;
    const overlaps = [];

    for (let i = 1; i < shapes.length; i++) {
      const prev = shapes[i - 1];
      const curr = shapes[i];
      const minDistance = prev.r + curr.r + minGap;
      const actualDistance = curr[axisProp] - prev[axisProp];

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
      const availableSpace =
        initialSize - shapes[0][axisProp] - shapes[shapes.length - 1][axisProp];
      const spaceToUse = Math.min(availableSpace * 0.8, totalOverlap);
      let cumulativeShift = 0;

      for (let i = 1; i < shapes.length; i++) {
        const shiftRatio = overlaps[i - 1].overlap / totalOverlap;
        cumulativeShift += shiftRatio * spaceToUse;
        shapes[i][axisProp] += cumulativeShift;
      }
    }

    // Final pass: fix any remaining overlaps with direct adjustments
    if (totalOverlap > 0) {
      for (let i = 1; i < shapes.length; i++) {
        const prev = shapes[i - 1];
        const curr = shapes[i];
        const minDistance = prev.r + curr.r + minGap;

        if (curr[axisProp] - prev[axisProp] < minDistance) {
          curr[axisProp] = prev[axisProp] + minDistance;
        }
      }
    }

    // Calculate the new required line size
    const lastShape = shapes[shapes.length - 1];
    const newSize = Math.max(initialSize, lastShape[axisProp] + lastShape.r);

    return { shapes, newSize };
  };

  const svgInitialData = ref(null);
  const shapePositions = ref([]);

  const makeMinimap = (
    sections,
    containerSize = 400,
    options = { lineX: 12, lineY: 12, strokeWidth: 3, radiusDelta: 2, minGap: -4 }
  ) => {
    const isHorizontal = props.orientation === "horizontal";
    // Adjust lineY or lineX based on side for top/bottom orientations
    const isHorizontalSide = props.side === "top" || props.side === "bottom";

    if (isHorizontalSide) {
      if (props.side === "top") {
        options.lineY = options.lineY * 2; // Move line down to make room for top semi-circles
      } else if (props.side === "bottom") {
        options.lineY = options.lineY / 2; // Move line up to make room for bottom semi-circles
      }
    } else {
      if (props.side === "left") {
        options.lineX = options.lineX * 2; // Move line right to make room for left semi-circles
      } else if (props.side === "right") {
        options.lineX = options.lineX / 2; // Move line left to make room for right semi-circles
      }
    }

    const lineSize = containerSize || 400;

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

    // Adjust shape positions to prevent overlaps
    const { shapes: newShapes } = adjustShapePositions(
      shapes,
      lineSize,
      options.minGap,
      isHorizontal
    );
    shapes = newShapes;

    // Get layout parameters based on orientation and side
    const layout = getLayoutParameters(shapes, lineSize, options, isHorizontal, props.side);

    // Create the SVG markup
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${layout.viewBox}" preserveAspectRatio="xMidYMid meet">
      <line
        x1="${layout.mainLine.x1}"
        y1="${layout.mainLine.y1}"
        x2="${layout.mainLine.x2}"
        y2="${layout.mainLine.y2}"
        stroke-width="${options.strokeWidth}"
        stroke-linecap="round"
      />
      ${shapes
        .map(
          (s, idx) =>
            `<path class="mm-shape" data-index="${idx}" data-percent="${s.percent}"
              d="${createSemiCirclePath(s.cx, s.cy, s.r, props.side)}"
              stroke-width="${options.strokeWidth}" />`
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

  const resizeMinimap = (wrapper, initialData, options = { minSizeForSubsections: 250 }) => {
    const svg = wrapper.querySelector("svg");
    if (!svg) return;

    const { minSizeForSubsections } = options;
    const isHorizontal = props.orientation === "horizontal";
    const { initialHeight, initialWidth, initialShapes, lineX, lineY, strokeWidth } = initialData;
    const isHorizontalSide = props.side === "top" || props.side === "bottom";

    // Get container dimension based on orientation
    const containerDimension = isHorizontal ? wrapper.clientWidth : wrapper.clientHeight;
    if (containerDimension <= 0) return;

    // Calculate scale factor
    const initialDimension = isHorizontal ? initialWidth : initialHeight;
    const scaleFactor = containerDimension / initialDimension;

    // Update main line
    const line = svg.querySelector("line:not(.scroll-indicator)");
    if (line) {
      const lineAttr = isHorizontal ? "x2" : "y2";
      line.setAttribute(lineAttr, initialDimension * scaleFactor);
    }

    // Update semi-circle positions
    const paths = svg.querySelectorAll("path.mm-shape");
    paths.forEach((path, index) => {
      const shape = initialShapes[index];

      // Update position based on orientation
      if (isHorizontal) {
        const newCx = shape.cx * scaleFactor;
        const newPath = createSemiCirclePath(newCx, shape.cy, shape.r, props.side);
        path.setAttribute("d", newPath);

        // Hide small subsections if container is too small
        if (containerDimension < minSizeForSubsections && shape.level > 2) {
          path.style.visibility = "hidden";
        } else {
          path.style.visibility = "visible";
        }
      } else {
        const newCy = shape.cy * scaleFactor;
        const newPath = createSemiCirclePath(shape.cx, newCy, shape.r, props.side);
        path.setAttribute("d", newPath);
      }
    });

    // Calculate bounds for the shapes
    const allBBoxes = [...paths].map((path) => path.getBBox());

    // Update viewBox based on orientation and side
    if (isHorizontal) {
      const minX = Math.min(0, ...allBBoxes.map((box) => box.x));
      const maxX = Math.max(
        initialWidth * scaleFactor,
        ...allBBoxes.map((box) => box.x + box.width)
      );

      const minY = Math.min(0, ...allBBoxes.map((box) => box.y));
      const maxY = Math.max(
        isHorizontalSide ? initialHeight * scaleFactor : 0,
        ...allBBoxes.map((box) => box.y + box.height)
      );

      const width = maxX - minX;
      const height = maxY - minY;

      svg.setAttribute("viewBox", `${minX} ${minY} ${width} ${height}`);
    } else {
      const minX = Math.min(0, ...allBBoxes.map((box) => box.x));
      const maxX = Math.max(
        isHorizontalSide ? 0 : initialWidth * scaleFactor,
        ...allBBoxes.map((box) => box.x + box.width)
      );

      const minY = Math.min(0, ...allBBoxes.map((box) => box.y));
      const maxY = Math.max(
        initialHeight * scaleFactor,
        ...allBBoxes.map((box) => box.y + box.height)
      );

      const width = maxX - minX;
      const height = maxY - minY;

      svg.setAttribute("viewBox", `${minX} ${minY} ${width} ${height}`);
    }

    svg.style.width = "100%";
    svg.style.height = "100%";
  };

  const highlightScrollPos = (pos) => {
    if (!wrapperRef.value || pos < 0.5) return;

    const svg = wrapperRef.value.querySelector("svg");
    const paths = svg.querySelectorAll("path.mm-shape");
    const scrollIndicator = svg.querySelector(".scroll-indicator");
    const isHorizontal = props.orientation === "horizontal";
    const isHorizontalSide = props.side === "top" || props.side === "bottom";

    // Get container dimension
    const containerDimension = isHorizontal
      ? wrapperRef.value.clientWidth
      : wrapperRef.value.clientHeight;

    // Calculate scroll position
    const scrollPercent = pos / 100;
    const scrollPos = scrollPercent * containerDimension;

    // Set the position of the scroll indicator
    if (isHorizontal) {
      scrollIndicator.setAttribute("x1", scrollPos);
      scrollIndicator.setAttribute("x2", scrollPos);
    } else {
      const halfHeight = (3 / containerDimension) * 100;
      scrollIndicator.setAttribute("y1", `${pos - halfHeight}%`);
      scrollIndicator.setAttribute("y2", `${pos + halfHeight}%`);
    }

    // Reset all classes first
    paths.forEach((path) => path.classList.remove("current-section", "section-end"));

    // Remove any existing section-line highlight
    const existingHighlightLine = svg.querySelector(".section-line-highlight");
    if (existingHighlightLine) {
      existingHighlightLine.remove();
    }

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

    // Sort by percentage (vertical scroll position)
    pathData.sort((a, b) => a.percent - b.percent);

    // Find the innermost section where the scroll is positioned
    let currentSectionIndex = -1;
    for (let i = pathData.length - 1; i >= 0; i--) {
      if (pathData[i].percent <= pos) {
        currentSectionIndex = i;
        break;
      }
    }

    // If we found a current section, highlight it and the section line
    if (currentSectionIndex >= 0) {
      const currentSection = pathData[currentSectionIndex];
      currentSection.element.classList.add("current-section");

      // Find the end of the current section (next shape of same size or larger)
      const currentRadius = currentSection.r;
      let sectionEndIndex = -1;

      for (let i = currentSectionIndex + 1; i < pathData.length; i++) {
        if (pathData[i].r <= currentRadius) {
          sectionEndIndex = i;
          pathData[i].element.classList.add("section-end");
          break;
        }
      }

      // If we found both the start and end, highlight the line segment between them
      if (sectionEndIndex >= 0) {
        const sectionEnd = pathData[sectionEndIndex];
        const mainLine = svg.querySelector("line:not(.scroll-indicator)");

        if (mainLine) {
          const lineStrokeWidth = parseFloat(mainLine.getAttribute("stroke-width")) || 3;
          const highlightLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
          highlightLine.setAttribute("class", "section-line-highlight");
          highlightLine.setAttribute("stroke-width", lineStrokeWidth);
          highlightLine.setAttribute("stroke", "var(--primary-300, #a5b4fc)");
          highlightLine.setAttribute("stroke-linecap", "round");

          if (isHorizontal) {
            const lineY = currentSection.cy;
            highlightLine.setAttribute("x1", currentSection.cx);
            highlightLine.setAttribute("y1", lineY);
            highlightLine.setAttribute("x2", sectionEnd.cx);
            highlightLine.setAttribute("y2", lineY);
          } else {
            const lineX = currentSection.cx;
            highlightLine.setAttribute("x1", lineX);
            highlightLine.setAttribute("y1", currentSection.cy);
            highlightLine.setAttribute("x2", lineX);
            highlightLine.setAttribute("y2", sectionEnd.cy);
          }

          svg.insertBefore(highlightLine, scrollIndicator || null);
        }
      }
    }
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
      stroke: var(--gray-400);
    }

    & .scroll-indicator {
      stroke: var(--secondary-800);
    }

    & .section-line-highlight {
      stroke: var(--secondary-300);
      transition: stroke 0.3s ease;
    }

    & path.mm-shape {
      fill: var(--surface-page);
      stroke: var(--gray-400);
      transition:
        fill 0.2s ease,
        stroke 0.2s ease;

      &:hover {
        fill: var(--surface-information);
        stroke: var(--border-action);
      }

      &.current-section {
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
