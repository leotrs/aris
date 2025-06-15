<script setup>
  import { ref, onMounted, onUnmounted, useTemplateRef } from "vue";
  import { useFloating, autoUpdate, offset, flip, shift } from "@floating-ui/vue";

  const selfRef = useTemplateRef("self-ref");
  const visible = ref(false);
  const virtualEl = ref(null);

  const colors = {
    purple: "var(--purple-300)",
    orange: "var(--orange-300)",
    green: "var(--green-300)",
  };

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
    visible.value = true;
  };

  const clearSelection = () => {
    visible.value = false;
    virtualEl.value = null;
  };

  onMounted(() => {
    window.addEventListener("selectionchange", updateSelection);
    window.addEventListener("mousedown", (e) => {
      if (!selfRef.value?.contains(e.target)) {
        clearSelection();
      }
    });
  });

  onUnmounted(() => {
    window.removeEventListener("selectionchange", updateSelection);
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
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      ref="self-ref"
      :style="floatingStyles"
      class="floating-menu"
      @mousedown.prevent
    >
      <Button kind="tertiary" size="sm" icon="Message" @click="onAddComment" />
      <Button kind="tertiary" size="sm" icon="Note" @click="onAddNote" />
    </div>
  </Teleport>
</template>

<style scoped>
  .floating-menu {
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 4px 6px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 6px;
  }
</style>
