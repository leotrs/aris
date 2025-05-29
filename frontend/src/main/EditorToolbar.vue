<script setup>
  import { useScrollShadows } from "@/composables/useScrollShadows.js";

  const emit = defineEmits(["insert", "compile"]);

  const { scrollElementRef: toolbarRef, showLeftShadow, showRightShadow } = useScrollShadows();
</script>

<template>
  <div class="toolbar-container">
    <div ref="toolbarRef" class="toolbar">
      <Button kind="tertiary" size="sm" icon="Heading" />
      <Button kind="tertiary" size="sm" icon="Bold" />
      <Button kind="tertiary" size="sm" icon="Italic" />
      <Button kind="tertiary" size="sm" text=":B:" />
      <Button kind="tertiary" size="sm" text=":I:" />
      <HSeparator />
      <ContextMenu icon="" text="Insert">
        <ContextMenuItem caption="List" icon="List" />
        <ContextMenuItem caption="Numbered List" icon="ListNumbers" />
        <ContextMenuItem caption="Figure" icon="Photo" />
        <ContextMenuItem caption="Table" icon="Table" />
        <ContextMenuItem caption="Code Inline" icon="Code" />
        <ContextMenuItem caption="Code Block" icon="SourceCode" />
        <ContextMenuItem caption="Comment" icon="MessageCode" />
      </ContextMenu>
      <ContextMenu icon="" text="Link">
        <ContextMenuItem caption="Cross-Reference" icon="FileSymlink" />
        <ContextMenuItem caption="Citation" icon="Quote" />
        <ContextMenuItem caption="URL" icon="Link" />
      </ContextMenu>
      <ContextMenu icon="" text="Sections">
        <ContextMenuItem caption="Heading" icon="Heading" />
        <ContextMenuItem caption="Author" icon="UserEdit" />
        <ContextMenuItem caption="References" icon="List" />
        <ContextMenuItem caption="Bibliography" icon="Books" />
        <ContextMenuItem caption="Bibliography Item" icon="Book2" />
        <ContextMenuItem caption="Abstract" icon="SectionSign" />
        <ContextMenuItem caption="Appendix" icon="SectionSign" />
      </ContextMenu>
      <ContextMenu icon="" text="Math">
        <ContextMenuItem caption="Math Block" icon="" />
        <ContextMenuItem caption="Math Inline" icon="" />
        <ContextMenuItem caption="Theorem" icon="" />
        <ContextMenuItem caption="Proposition" icon="" />
        <ContextMenuItem caption="Lemma" icon="" />
        <ContextMenuItem caption="Corollary" icon="" />
        <ContextMenuItem caption="Proof" icon="" />
        <ContextMenuItem caption="Proof Step" icon="" />
        <ContextMenuItem caption="Subproof" icon="" />
        <ContextMenuItem caption="Assumption" icon="" />
        <ContextMenuItem caption="Case" icon="" />
        <ContextMenuItem caption="Claim" icon="" />
        <ContextMenuItem caption="Definition" icon="" />
        <ContextMenuItem caption="Let" icon="" />
        <ContextMenuItem caption="New" icon="" />
        <ContextMenuItem caption="Pick" icon="" />
        <ContextMenuItem caption="Prove" icon="" />
        <ContextMenuItem caption="Such That" icon="" />
        <ContextMenuItem caption="Suffices" icon="" />
        <ContextMenuItem caption="Suppose" icon="" />
        <ContextMenuItem caption="Then" icon="" />
        <ContextMenuItem caption="WLOG" icon="" />
        <ContextMenuItem caption="Write" icon="" />
      </ContextMenu>
    </div>

    <div class="shadow-overlay shadow-left" :class="{ active: showLeftShadow }"></div>
    <div class="shadow-overlay shadow-right" :class="{ active: showRightShadow }"></div>
  </div>
</template>

<style scoped>
  .toolbar-container {
    position: relative;
    flex: 0;
    min-height: var(--toolbar-height);
    max-height: calc(var(--toolbar-height) * 2 + 8px);
    border-radius: 0 8px 0 0;
    background-color: var(--surface-hover);
    overflow: hidden;
  }

  .toolbar {
    display: flex;
    justify-content: flex-start;
    min-height: var(--toolbar-height);
    max-height: calc(var(--toolbar-height) * 2 + 8px);
    padding: 4px;
    gap: 2px;
    flex-wrap: nowrap;
    overflow-x: auto;
    white-space: nowrap;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .toolbar .h-sep {
    margin: 4px;
    height: 24px;
  }

  .toolbar > button.tertiary,
  .toolbar > .cm-wrapper > :deep(button.cm-btn) {
    height: 32px;
  }

  .toolbar > :deep(button:has(> .btn-text)) {
    padding-inline: 0px !important;
    width: 32px !important;
  }

  .toolbar > button > :deep(.btn-text) {
    margin: 0 auto;
    font-family: "Source Code Pro", monospace !important;
    font-size: 16px;
  }

  .toolbar > .cm-wrapper > :deep(.cm-btn) {
    padding-inline: 6px;
    font-size: 16px;
    font-weight: var(--weight-regular);
    font-family: "Source Sans 3", sans-serif;
    text-transform: none;
  }

  .toolbar > .cm-wrapper {
    align-content: center;
  }

  .toolbar > .cm-wrapper :deep(> button) {
    color: var(--extra-dark);
  }

  .cm-menu {
    max-height: 400px;
    overflow-y: auto;
  }
</style>
