// General utils
function countLeadingPounds(str) {
  const match = str.match(/^\s*#+/);
  return match ? match[0].trimStart().length : 0;
};

// Section extraction
export function getSectionsFromSource(src) {
  const lines = src.split("\n");
  if (!src || lines.length < 1) return [];

  const regex1 = /:.*?section:/;
  const regex2 = /^\s*?#{1,5}\s*(.*?)$/;

  const sections = lines
    .map((line, idx) => ({
      lineno: idx,
      isSection: regex1.test(line) || regex2.test(line),
      line: line,
      title: line.match(regex2)?.[1] ?? ""
    }))
    .filter((line) => line.isSection)
    .map((obj) => ({
      percent: obj.lineno / lines.length,
      level: countLeadingPounds(obj.line) + 1,
      title: obj.title
    }));

  return sections;
};

export function getSectionsFromHTMLString(html) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, "text/html");
  const sections = [...dom.querySelectorAll("section")].map((s) => s);
  return sections;
};

export function getSectionsFromHTML(file) {
  // The following works by looking at the parent element's height because there are
  // only two cases: if the level is 1, then the parent is the manuscript wrapper, and
  // if the level is more than 1, the parent is the section of level-1. Both this
  // section and its parent have the same height, both equaling the entire height of the
  // manuscript.
  const el = file.isMountedAt;
  const parentEl = el.parentElement;
  const sections = [...el.querySelectorAll("section")].map((s) => {
    const rect = s.getBoundingClientRect();
    const parentRect = el.getBoundingClientRect();
    const percent = (rect.top - parentRect.top) / parentEl.clientHeight;

    const levelClass = [...s.classList].find((c) => c.startsWith("level-"));
    const level = levelClass ? parseInt(levelClass.split("-")[1], 10) : null;

    const titleTag = s.querySelector(".heading.hr .hr-content-zone :is(h1, h2, h3, h4, h5, h6)");
    const title = titleTag?.textContent || "";

    const anchor = s.id ?? "";
    return { percent, level, title, anchor };
  });

  return sections;
}


export function getSections(file) {
  let sections = [];

  if (file.isMountedAt) {
    console.log('extracting sections from mounted html');
    sections = getSectionsFromHTML(file);
  } else if (file.html) {
    console.log('extracting sections from html string');
    sections = getSectionsFromHTMLString(file.html);
  } else if (file.source) {
    console.log('extracting sections from source');
    sections = getSectionsFromSource(file.source);
  } else {
    console.warn(`No way to get sections for file with id ${file.id}, skipping`);
  }
  return [{ percent: 0, level: 1 }, ...sections, { percent: 1, level: 1 }];
};

// Shapes
const createShapePath = (cx, cy, r, side, shape, offset = 4) => {
  if (shape === "line") {
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
  } else if (shape === "arc") {
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
    console.error(`Unknown shape ${shape}, must be one of 'line' or 'arc'`);
  }
  return "";
};

const createShapesData = (sections, lineSize, isHorizontal, options) => {
  const { lineX, lineY, radiusDelta } = options;
  return sections.map((s) => ({
    cx: isHorizontal ? s.percent * lineSize : lineX,
    cy: isHorizontal ? lineY : s.percent * lineSize,
    r: radiusDelta * (6 - s.level),
    percent: s.percent,
    level: s.level,
    title: s.title,
    anchor: s.anchor || "",
  }));
};

// SVG Layout
export function getLayoutParametersHorizontal(lineSize, options) {
  const { side, lineY, strokeWidth, trackWidth, offset } = options;
  let minX, maxX, minY, maxY;

  minX = -strokeWidth;
  maxX = lineSize + strokeWidth;
  const width = maxX - minX;

  if (side == "top") {
    minY = lineY - offset - 20; // 20 = 2 * (radiusDelta * (6-1))
    maxY = lineY + trackWidth;
  } else if (side == "bottom") {
    minY = lineY - trackWidth;
    maxY = lineY + offset + 20; // 20 = 2 * (radiusDelta * (6-1))
  } else {
    console.error(`Unknown side ${side}, must be either 'top' or 'bottom'`);
  }
  const height = maxY - minY;

  return {
    viewBox: `${minX} ${minY} ${width} ${height}`,
    track: { x1: "0", y1: lineY, x2: lineSize, y2: lineY },
    scrollLine: { x1: "0", y1: lineY, x2: "0", y2: lineY },
  };
};

export function getLayoutParametersVertical(lineSize, options) {
  const { side, lineX, strokeWidth, trackWidth, offset } = options;
  let minX, maxX, minY, maxY;

  if (side == "left") {
    minX = lineX - offset - 20; // 20 = 2 * (radiusDelta * (6-1))
    maxX = lineX + trackWidth;
  } else if (side == "right") {
    minX = lineX - trackWidth;
    maxX = lineX + offset + 20; // 20 = 2 * (radiusDelta * (6-1))
  } else {
    console.error(`Unknown side ${side}, must be either 'left' or 'right'`);
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

// Global state
let shapePositions = [];

// Public interface
export function makeMinimap(file, isHorizontal, wrapperWidth, wrapperHeight, options = {}) {
  const defaults = { lineX: 12, lineY: 12, strokeWidth: 3, trackWidth: 3, radiusDelta: 2, offset: 4, highlightScroll: true, side: 'left', shape: 'line' };
  options = { ...defaults, ...options };

  // DO NOT use file.minimap -- this is usually the one extracted from the HTMl, we want to make our own
  // if (file.minimap) return file.minimap;
  const currentSize = isHorizontal ? (wrapperWidth || 400) : (wrapperHeight || 400);
  return _makeMinimap(getSections(file), isHorizontal, currentSize, options);
}

export function _makeMinimap(
  sections,
  isHorizontal,
  containerSize = 400,
  options = {}
) {
  const defaults = { lineX: 12, lineY: 12, strokeWidth: 3, trackWidth: 3, radiusDelta: 2, offset: 4, highlightScroll: true, side: 'left', shape: 'line' };
  options = { ...defaults, ...options };

  // Leave some padding between the line and the container
  const lineSize = (containerSize || 400) - 8;

  // Create shapes based on orientation
  let shapes = createShapesData(sections, lineSize, isHorizontal, options);

  // Store initial data for future resizing
  const svgInitialData = {
    initialHeight: isHorizontal ? 0 : lineSize,
    initialWidth: isHorizontal ? lineSize : 0,
    initialShapes: JSON.parse(JSON.stringify(shapes)),
    ...options,
  };
  shapePositions = JSON.parse(JSON.stringify(shapes));

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
     stroke-width="${options.trackWidth}"
     stroke-linecap="round"
    />
    ${shapes
      .map((s, idx) => `
        <g class="mm-shape-group"
           data-index="${idx}"
           data-title="${s.title}"
           data-percent="${s.percent}"
           data-anchor="${s.anchor}"
        >
          <path class="mm-shape-box"
            d="${createShapePath(s.cx, s.cy, s.r + 6, options.side, options.shape, options.offset)}"
            stroke="transparent"
            stroke-width="${options.strokeWidth + 10}"
            fill="transparent"
            pointer-events="stroke"
          />
          <path class="mm-shape"
            d="${createShapePath(s.cx, s.cy, s.r, options.side, options.shape, options.offset)}"
            stroke-width="${options.strokeWidth}"
            stroke-linecap="round"
            pointer-events="none"
          />
        </g>
      `)
      .join("\n")}
    ${options.highlightScroll
      ? `<line class="scroll-indicator"
          x1="${layout.scrollLine.x1}"
          y1="${layout.scrollLine.y1}"
          x2="${layout.scrollLine.x2}"
          y2="${layout.scrollLine.y2}"
          stroke-width="${options.strokeWidth}"
          stroke-linecap="round"
         />`
      : ""}
  </svg>`;

  return { svg, svgInitialData };
};

export function resizeMinimap(
  svg,
  isHorizontal,
  wrapperWidth,
  wrapperHeight,
  svgInitialData,
  options = {}
) {
  const defaults = {
    lineX: 12,
    lineY: 12,
    strokeWidth: 3,
    trackWidth: 3,
    radiusDelta: 2,
    offset: 4,
    minSizeForSubsections: 250,
    side: 'left',
    shape: 'line'
  };
  options = { ...defaults, ...options };

  if (!svg) return;
  const { initialHeight, initialWidth, initialShapes } = svgInitialData;

  // Get dimensions based on orientation
  const containerDimension = isHorizontal ? wrapperWidth : wrapperHeight;
  const initialDimension = isHorizontal ? initialWidth : initialHeight;
  if (containerDimension <= 0 || initialDimension <= 0) return;
  const scaleFactor = containerDimension / initialDimension;

  // Update track
  const line = svg.querySelector("line.track");
  if (line) {
    const lineAttr = isHorizontal ? "x2" : "y2";
    line.setAttribute(lineAttr, initialDimension * scaleFactor);
  }

  // Update shape positions
  const paths = svg.querySelectorAll("path.mm-shape");
  // console.log([...paths].map((s) => s.dataset), initialShapes);
  paths.forEach((path, index) => {
    const shape = initialShapes[index];
    let newCx = isHorizontal ? shape.cx * scaleFactor : shape.cx;
    let newCy = isHorizontal ? shape.cy : shape.cy * scaleFactor;
    path.setAttribute("d", createShapePath(newCx, newCy, shape.r, options.side, options.shape, options.offset));

    // Hide small subsections if container is too small
    const shouldHide = containerDimension < options.minSizeForSubsections && shape.level > 2;
    path.style.visibility = shouldHide ? "hidden" : "visible";
  });

  const layout = isHorizontal
    ? getLayoutParametersHorizontal(containerDimension, options)
    : getLayoutParametersVertical(containerDimension, options);
  svg.setAttribute("viewBox", layout.viewBox);
};

export function highlightScrollPos(pos, isHorizontal, wrapperWidth, wrapperHeight, svg, options = { trackWidth: 3 }) {
  if (!svg) return;
  const scrollPercent = pos / 100;
  const containerDimension = isHorizontal ? wrapperWidth : wrapperHeight;
  const scrollPos = scrollPercent * containerDimension;
  const paths = svg.querySelectorAll("path.mm-shape-group");
  const scrollIndicator = svg.querySelector(".scroll-indicator");

  // Set the position of the scroll indicator
  if (scrollIndicator) {
    if (isHorizontal) {
      scrollIndicator.setAttribute("x1", scrollPos);
      scrollIndicator.setAttribute("x2", scrollPos);
    } else {
      scrollIndicator.setAttribute("y1", `${pos}%`);
      scrollIndicator.setAttribute("y2", `${pos}%`);
    }
  }
  // Reset classes and existing current-section line
  paths.forEach((path) => path.classList.remove("section-start", "section-end"));
  svg.querySelector(".current-section")?.remove();

  // Get path data with positions and percentages
  const pathData = Array.from(paths).map((path) => {
    const percent = parseFloat(path.getAttribute("data-percent")) * 100;
    const idx = parseInt(path.getAttribute("data-index"));
    const shape = shapePositions[idx];
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
  line.setAttribute("stroke-width", options.trackWidth);
  line.setAttribute("stroke-linecap", "round");
  line.setAttribute("x1", sectionStart.cx);
  line.setAttribute("y1", sectionStart.cy);
  line.setAttribute("x2", sectionEnd.cx);
  line.setAttribute("y2", sectionEnd.cy);
  svg.insertBefore(line, scrollIndicator || null);
};


export function makeIcons(newIcons, totalHeightEl) {
  // totalHeightEl must be an element whose height equals that of the entire manuscript,
  // e.g. the .manuscriptwrapper, .manuscrupt, or even .middle-column or
  // section.level-1.
  if (!totalHeightEl || !newIcons) return [];
  const totalHeight = totalHeightEl.scrollHeight;
  const containerTop = totalHeightEl.offsetTop;

  const data = [];
  for (const obj of Object.values(newIcons)) {
    const top = obj.element.parentElement.offsetTop - containerTop;
    const yPos = top / totalHeight;
    data.push({ class: obj.class, pos: yPos });
  }

  return data;
}
