<script setup>
  import { ref, toRef, onMounted, onUnmounted, useTemplateRef } from "vue";
  import { useFloating, autoUpdate, offset, flip, shift } from "@floating-ui/vue";

  const selfRef = useTemplateRef("self-ref");
  const range = ref(null);
  const visible = ref(false);

  // Floating UI setup
  const { floatingStyles } = useFloating(
    toRef(() => range),
    selfRef,
    {
      whileElementsMounted: autoUpdate,
      placement: "top",
      middleware: [offset(8), shift(), flip()],
      anchor: () => range,
    }
  );

  // Show menu when user selects non-collapsed text
  const updateSelection = () => {
    console.log("updating");
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      visible.value = false;
      range.value = null;
      return;
    }

    const selectedRange = sel.getRangeAt(0);
    if (!selectedRange || selectedRange.collapsed) {
      visible.value = false;
      range.value = null;
      return;
    }

    console.log(selectedRange);
    range.value = selectedRange;
    visible.value = true;
  };

  const clearSelection = () => {
    console.log("clearing");
    visible.value = false;
    range.value = null;
  };

  // Component life cycle
  onMounted(() => {
    if (!selfRef) return;
    console.log("setting");
    document.addEventListener("selectionchange", updateSelection);
    document.addEventListener("mousedown", (e) => {
      if (!selfRef.value?.contains(e.target)) clearSelection();
    });
  });
  onUnmounted(() => {
    document.removeEventListener("selectionchange", updateSelection);
    document.removeEventListener("mousedown", clearSelection);
  });

  // Main action callbacks
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
