<script setup>
  import { ref, reactive, computed, inject, onMounted, onUnmounted, useTemplateRef } from "vue";
  import { useFloating, autoUpdate, offset, flip, shift } from "@floating-ui/vue";

  /**
   * AnnotationMenu - Floating annotation menu with color selection
   *
   * A sophisticated floating menu component for creating annotations with color selection.
   * Uses Floating UI for intelligent positioning and supports text selection-based annotation
   * creation with expandable color palettes.
   *
   * Features:
   * - Text selection-based positioning using Floating UI
   * - Expandable color palette (3 colors default, 6 when expanded)
   * - Intelligent viewport-aware positioning
   * - Text range capture and annotation creation
   * - Mouse and keyboard interaction support
   * - Auto-hide on outside clicks and navigation
   *
   * @displayName AnnotationMenu
   * @example
   * // Basic usage (automatically positioned on text selection)
   * <AnnotationMenu />
   *
   * @example
   * // The component automatically handles:
   * // - Text selection detection
   * // - Floating menu positioning
   * // - Color selection interface
   * // - Annotation creation workflow
   */

  const selfRef = useTemplateRef("selfRef");
  const visible = ref(false);
  const virtualEl = ref(null);
  const currentRange = ref(null);
  const expanded = ref(false);

  // Color state
  const colors = computed(() =>
    expanded.value
      ? {
          purple: "var(--purple-300)",
          orange: "var(--orange-300)",
          green: "var(--green-300)",
          red: "var(--red-300)",
          pink: "var(--pink-300)",
          yellow: "var(--yellow-300)",
        }
      : {
          purple: "var(--purple-300)",
          orange: "var(--orange-300)",
          green: "var(--green-300)",
        }
  );

  // Create virtual element for Floating UI
  const getVirtualElementFromRange = (range) => ({
    getBoundingClientRect: () => range.getBoundingClientRect(),
    contextElement: document.body,
  });

  // Floating UI setup
  const { floatingStyles } = useFloating(virtualEl, selfRef, {
    whileElementsMounted: autoUpdate,
    placement: "top",
    middleware: [offset(8), shift(), flip()],
  });

  // Range in viewport check
  const isRangeInViewport = (range) => {
    const rect = range.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;

    return rect.bottom >= 0 && rect.right >= 0 && rect.top <= vh && rect.left <= vw;
  };

  const clearSelection = () => {
    visible.value = false;
    virtualEl.value = null;
    currentRange.value = null;

    const selection = window.getSelection();
    if (selection && selection.removeAllRanges) {
      selection.removeAllRanges();
    }
  };

  // Update floating position and hide if out of bounds
  const updateFloatingPosition = () => {
    if (!currentRange.value) return;

    virtualEl.value = getVirtualElementFromRange(currentRange.value);
    if (!isRangeInViewport(currentRange.value)) {
      clearSelection();
    }
  };

  // Called only after user has finished selecting (mouseup)
  const tryShowMenu = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      clearSelection();
      return;
    }

    const range = sel.getRangeAt(0);
    if (!range || range.collapsed) {
      clearSelection();
      return;
    }

    currentRange.value = range;
    virtualEl.value = getVirtualElementFromRange(range);
    visible.value = true;
    updateFloatingPosition();
  };

  // Listen for when user finishes text selection
  const handleMouseUp = () => {
    // Give time for DOM to update selection state
    setTimeout(() => {
      tryShowMenu();
    }, 0);
  };

  function onAddComment() {
    console.log("Add Comment");
    clearSelection();
  }

  function onAddNote() {
    console.log("Add Note");
    clearSelection();
  }

  onMounted(() => {
    // FIXED: Scope mouseup listener to manuscript container instead of global document
    // This prevents interference with input fields outside the manuscript
    const manuscriptContainer =
      document.querySelector('[data-testid="manuscript-viewer"]') ||
      document.querySelector(".rsm-manuscript") ||
      document.querySelector('[data-testid="manuscript-container"]');

    if (manuscriptContainer) {
      manuscriptContainer.addEventListener("mouseup", handleMouseUp);
    }

    document.addEventListener("scroll", updateFloatingPosition, true);
    window.addEventListener("resize", updateFloatingPosition);
  });

  onUnmounted(() => {
    // FIXED: Remove from scoped container instead of global document
    const manuscriptContainer =
      document.querySelector('[data-testid="manuscript-viewer"]') ||
      document.querySelector(".rsm-manuscript") ||
      document.querySelector('[data-testid="manuscript-container"]');

    if (manuscriptContainer) {
      manuscriptContainer.removeEventListener("mouseup", handleMouseUp);
    }

    document.removeEventListener("scroll", updateFloatingPosition, true);
    window.removeEventListener("resize", updateFloatingPosition);
  });

  const inputText = ref("");
  const annotations = inject("annotations", reactive([]));
  const onSubmit = () => {
    console.log("submit", inputText.value);
    const newAnnotation = { id: 999, content: inputText.value, type: "note" };
    annotations.push(newAnnotation);
    visible.value = false;
  };
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" ref="selfRef" :style="floatingStyles" class="hl-menu" @mouseup.stop>
      <div class="left">
        <ColorPicker :colors="colors" :labels="false" :default-active="Object.keys(colors)[0]" />
      </div>
      <div class="middle">
        <AnnotationInputBox v-model="inputText" :expanded="expanded" @submit="onSubmit" />
      </div>
      <div class="right">
        <Button
          kind="tertiary"
          size="sm"
          :icon="expanded ? 'ChevronUp' : 'ChevronDown'"
          @click="expanded = !expanded"
        />
        <ButtonClose @click="clearSelection" />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
  .hl-menu {
    position: absolute;
    background: var(--surface-page);
    border: var(--border-extrathin) solid var(--border-primary);
    border-radius: 16px;
    padding-block: 4px;
    padding-inline: 8px;
    box-shadow: var(--shadow-soft);
    display: flex;
    gap: 16px;
    z-index: 999;

    & > * {
      display: flex;
      align-items: center;
    }
  }

  .left {
    width: 88px;
  }

  .right {
    display: flex;
    padding-block: 4px;
    align-items: flex-start;
    margin: -4px;

    & :deep(.tabler-icon) {
      color: var(--dark) !important;
    }
  }

  .cp-wrapper {
    gap: 2px !important;
  }

  .cp-wrapper :deep(.swatch) {
    height: fit-content;
    width: fit-content;
    padding-inline: 6px;
    padding-block: 6px;

    & > button {
      height: 16px;
      width: 16px;
    }
  }
</style>
