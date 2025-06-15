<script setup>
  import { ref, computed, toRef, onMounted, onUnmounted, useTemplateRef } from "vue";
  import { useFloating, autoUpdate, offset, flip, shift } from "@floating-ui/vue";

  const selfRef = useTemplateRef("self-ref");
  const visible = ref(false);
  const virtualEl = ref(null);

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

  // Create a virtual element for Floating UI
  const getVirtualElementFromRange = (range) => {
    const rect = range.getBoundingClientRect();
    return {
      getBoundingClientRect: () => rect,
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
      return;
    }

    const selectedRange = sel.getRangeAt(0);
    if (!selectedRange || selectedRange.collapsed) {
      visible.value = false;
      virtualEl.value = null;
      return;
    }

    virtualEl.value = getVirtualElementFromRange(selectedRange);
    console.log(virtualEl.value.getBoundingClientRect());
    console.log(floatingStyles.value);
    visible.value = true;
  };

  const clearSelection = () => {
    console.log("clearing");
    visible.value = false;
    virtualEl.value = null;
  };

  onMounted(() => {
    document.addEventListener("selectionchange", updateSelection);
    window.addEventListener("mousedown", (e) => {
      if (!selfRef.value?.contains(e.target)) {
        clearSelection();
      }
    });
  });

  onUnmounted(() => {
    document.removeEventListener("selectionchange", updateSelection);
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
    <div v-if="!visible" ref="self-ref" :style="floatingStyles" class="hl-menu">
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
    z-index: 999;

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
