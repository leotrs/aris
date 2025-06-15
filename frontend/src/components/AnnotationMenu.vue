<script setup>
  import { ref, computed, toRef, onMounted, onUnmounted, useTemplateRef } from "vue";
  import { useFloating, autoUpdate, offset, flip, shift } from "@floating-ui/vue";

  const selfRef = useTemplateRef("self-ref");
  const visible = ref(false);
  const virtualEl = ref(null);
  const currentRange = ref(null); // Store the current range

  const colors = computed(() => {
    if (!expanded.value)
      return {
        purple: "var(--purple-300)",
        orange: "var(--orange-300)",
        green: "var(--green-300)",
      };
    else {
      return {
        purple: "var(--purple-300)",
        orange: "var(--orange-300)",
        green: "var(--green-300)",
        red: "var(--red-300)",
        pink: "var(--pink-300)",
        yellow: "var(--yellow-300)",
      };
    }
  });

  // Create a virtual element that updates dynamically with the range position
  const getVirtualElementFromRange = (range) => {
    return {
      getBoundingClientRect: () => {
        // Always get fresh bounding rect when called
        return range.getBoundingClientRect();
      },
      contextElement: document.body,
    };
  };

  // Floating UI setup
  const { floatingStyles } = useFloating(virtualEl, selfRef, {
    whileElementsMounted: autoUpdate,
    placement: "top",
    middleware: [offset(8), shift(), flip()],
  });

  // Show menu when user selects non-collapsed text
  const updateSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      console.log("nothing to show");
      visible.value = false;
      virtualEl.value = null;
      currentRange.value = null;
      return;
    }

    const selectedRange = sel.getRangeAt(0);
    if (!selectedRange || selectedRange.collapsed) {
      visible.value = false;
      virtualEl.value = null;
      currentRange.value = null;
      return;
    }

    currentRange.value = selectedRange;
    virtualEl.value = getVirtualElementFromRange(selectedRange);
    console.log(virtualEl.value.getBoundingClientRect());
    console.log(floatingStyles.value);
    visible.value = true;
  };

  const clearSelection = () => {
    console.log("clearing");
    visible.value = false;
    virtualEl.value = null;
    currentRange.value = null;
  };

  // Check if range is visible in viewport
  const isRangeInViewport = (range) => {
    const rect = range.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <= viewportHeight &&
      rect.left <= viewportWidth
    );
  };

  // Force floating UI to update position when scrolling
  const updateFloatingPosition = () => {
    if (visible.value && currentRange.value) {
      // Check if the selected range is still visible
      if (!isRangeInViewport(currentRange.value)) {
        clearSelection();
        return;
      }

      // Force a re-computation by updating the virtual element
      virtualEl.value = getVirtualElementFromRange(currentRange.value);
    }
  };

  onMounted(() => {
    document.addEventListener("selectionchange", updateSelection);
    document.addEventListener("scroll", updateFloatingPosition, true); // Use capture phase
    window.addEventListener("resize", updateFloatingPosition);
    window.addEventListener("mousedown", (e) => {
      if (!selfRef.value?.contains(e.target)) {
        clearSelection();
      }
    });
  });

  onUnmounted(() => {
    document.removeEventListener("selectionchange", updateSelection);
    document.removeEventListener("scroll", updateFloatingPosition, true);
    window.removeEventListener("resize", updateFloatingPosition);
    window.removeEventListener("mousedown", clearSelection);
  });

  function onAddComment() {
    console.log("Add Comment");
    clearSelection();
  }

  function onAddNote() {
    console.log("Add Note");
    clearSelection();
  }

  const expanded = ref(false);
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" ref="self-ref" :style="floatingStyles" class="hl-menu">
      <div class="left">
        <ColorPicker :colors="colors" :labels="false" />
      </div>
      <div class="middle">
        <AnnotationInputBox :expanded="expanded" />
      </div>
      <div class="right">
        <Button
          kind="tertiary"
          size="sm"
          :icon="expanded ? 'ChevronUp' : 'ChevronDown'"
          @click="expanded = !expanded"
        />
        <ButtonClose />
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
    gap: 24px;
    z-index: 1;

    & > * {
      display: flex;
      align-items: center;
    }
  }

  .left {
    width: 76px;
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

  .cp-wrapper :deep(.swatch) {
    height: fit-content;
    width: fit-content;
    gap: 4px;
    padding-inline: 2px;

    & > button {
      height: 16px;
      width: 16px;
    }
  }
</style>
