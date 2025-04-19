/**
 * Highlights text matches across multiple DOM nodes
 * @param {Element} rootEl - The root element to search within
 * @param {string} searchTerm - The text to search for
 * @param {Object} options - Configuration options
 * @param {boolean} options.caseSensitive - Whether search should be case-sensitive (default: false)
 * @param {string} options.highlightClass - CSS class for highlights (default: "highlight")
 * @param {string} options.highlightColor - Background color for highlights (default: "yellow")
 * @param {boolean} options.wholeWord - Match whole words only (default: false)
 * @returns {number} - Count of matches found
 */
export default function highlightSearchMatches(rootEl, searchTerm, options = {}) {
  if (!rootEl) return 0;
  const {
    caseSensitive = false,
    highlightClass = "search-result",
    wholeWord = false
  } = options;

  // Remove previous highlights
  const highlightMatches = () => {
    const marks = rootEl.querySelectorAll(`mark.${highlightClass}`);
    for (const mark of marks) {
      const parent = mark.parentNode;
      // Use document fragment for better performance
      const fragment = document.createDocumentFragment();
      while (mark.firstChild) {
        fragment.appendChild(mark.firstChild);
      }
      parent.replaceChild(fragment, mark);
    }
    // Normalize at the root level once rather than per node
    rootEl.normalize();
  };
  highlightMatches();
  if (!searchTerm || searchTerm.trim() === "") return 0;

  // Setup TreeWalker to find all text nodes
  const treeWalker = document.createTreeWalker(
    rootEl,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: node => {
        // Skip empty text nodes and script/style content
        const parent = node.parentNode;
        if (!node.textContent.trim() ||
          parent.nodeName === 'SCRIPT' ||
          parent.nodeName === 'STYLE' ||
          parent.nodeName === 'MARK') {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  // Collect all text nodes and their position data
  const nodeInfo = [];
  let currentPosition = 0;
  let node;
  while ((node = treeWalker.nextNode())) {
    const length = node.textContent.length;
    nodeInfo.push({
      node,
      start: currentPosition,
      end: currentPosition + length
    });
    currentPosition += length;
  }

  // If no text nodes found, exit
  if (nodeInfo.length === 0) {
    return 0;
  }

  // Combine all text for searching
  const fullText = nodeInfo.map(info => info.node.textContent).join("");

  // Prepare search term and text for matching
  const searchFor = caseSensitive ? searchTerm : searchTerm.toLowerCase();
  const searchIn = caseSensitive ? fullText : fullText.toLowerCase();

  // Create regex pattern for whole word search if needed
  let searchRegex = null;
  if (wholeWord) {
    const escapedTerm = searchFor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    searchRegex = new RegExp(`\\b${escapedTerm}\\b`, caseSensitive ? 'g' : 'gi');
  }

  // Find all matches
  const matches = [];

  if (wholeWord && searchRegex) {
    let match;
    while ((match = searchRegex.exec(searchIn)) !== null) {
      matches.push([match.index, match.index + match[0].length]);
    }
  } else {
    let startIndex = 0;
    while ((startIndex = searchIn.indexOf(searchFor, startIndex)) !== -1) {
      matches.push([startIndex, startIndex + searchFor.length]);
      startIndex += searchFor.length;
    }
  }

  // Early return if no matches
  if (matches.length === 0) {
    return 0;
  }

  // Process matches in reverse order to avoid offset issues when modifying the DOM
  matches.sort((a, b) => b[0] - a[0]);

  for (const [start, end] of matches) {
    try {
      // Find nodes containing the start and end of match
      let startNodeInfo = null;
      let endNodeInfo = null;

      for (const info of nodeInfo) {
        if (start >= info.start && start < info.end) {
          startNodeInfo = info;
        }
        if (end > info.start && end <= info.end) {
          endNodeInfo = info;
        }
        if (startNodeInfo && endNodeInfo) {
          break;
        }
      }

      if (!startNodeInfo || !endNodeInfo) {
        continue; // Skip if we can't find the nodes
      }

      // Create a range for the match
      const range = document.createRange();
      range.setStart(startNodeInfo.node, start - startNodeInfo.start);
      range.setEnd(endNodeInfo.node, end - endNodeInfo.start);

      // Skip if the range is collapsed or invalid
      if (range.collapsed) {
        continue;
      }

      // Create highlight element
      const mark = document.createElement("mark");
      mark.className = highlightClass;

      // Try to surround with the highlight
      try {
        range.surroundContents(mark);
      } catch (e) {
        // Handle case where match spans multiple nodes
        if (startNodeInfo !== endNodeInfo) {
          // Extract and highlight content in multiple fragments
          const fragment = range.extractContents();
          mark.appendChild(fragment);
          range.insertNode(mark);
        }
      }

      // Update node info to reflect changes to the DOM
      // We're processing in reverse order, so only need to update the current match
      const markLength = mark.textContent.length;
      for (let i = 0; i < nodeInfo.length; i++) {
        const info = nodeInfo[i];
        if (info.end > start) {
          // Update any node whose range is affected by this match
          if (info === startNodeInfo) {
            info.node = mark.firstChild || mark.nextSibling || mark.previousSibling;
          } else if (info === endNodeInfo && startNodeInfo !== endNodeInfo) {
            info.node = mark.lastChild || mark.nextSibling || mark.previousSibling;
          }
        }
      }
    } catch (e) {
      console.error("Error highlighting match:", e);
    }
  }

  return matches.length;
}

// Example usage:
/*
highlightMultiNodeMatch(document.body, "search term");

// With options
highlightMultiNodeMatch(document.body, "search term", {
  caseSensitive: true,
  highlightClass: "custom-highlight",
  highlightColor: "#ffcc00",
  wholeWord: true
});
*/
