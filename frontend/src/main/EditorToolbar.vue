<script setup>
  import { ref, reactive, nextTick, onMounted, onUnmounted, computed } from "vue";

  const emit = defineEmits(["insert", "compile"]);

  const btnInfo = [
    { text: "", icon: "Heading", str: "# \n:label: my-lbl\n\n::", tooltip: "Heading" },
    { text: "", icon: "Bold", str: "**", tooltip: "Bold" },
    { text: "", icon: "Italic", str: "//", tooltip: "Italic" },
    { text: ":B:", icon: "", str: ":block:\n\n::", tooltip: "Block Tag" },
    { text: ":I:", icon: "", str: ":inline: ::", tooltip: "Inline Tag" },
    /* { text: "", icon: "MessageCode", str: "% ", tooltip: "Comment" },
     * { text: "sep" }, */
    /* { text: "", icon: "List", str: ":itemize:\n\n:item:\n\n::", tooltip: "List" },
     * { text: "", icon: "ListNumbers", str: ":enumerate:\n\n:item:\n\n::", tooltip: "Numbered List" },
     * { text: "", icon: "Photo", str: ":figure:\n:path:filepath.jpg\n\n::", tooltip: "Figure" },
     * { text: "", icon: "Table", str: ":table:\n::", tooltip: "Table" },
     * { text: "", icon: "Code", str: "``", tooltip: "Code" },
     * { text: "", icon: "SourceCode", str: "```\n\n```", tooltip: "Code Block" }, */
    /* { text: "sep" },
     * { text: "", icon: "FileSymlink", str: ":ref:my-lbl::", tooltip: "Internal Cross-Reference" },
     * { text: "", icon: "Quote", str: ":cite:my-lbl::", tooltip: "Citation" },
     * { text: "", icon: "Link", str: ":url:foo,bar::", tooltip: "URL" }, */
    /* { text: "sep" },
     * {
     *   text: "AUT",
     *   icon: "",
     *   str: ":author:\n:name:\n:email:\n:affiliation:\n::",
     *   tooltip: "Author",
     * },
     * { text: "ABS", icon: "", str: ":abstract:\n\n::", tooltip: "Abstract" },
     * { text: "TOC", icon: "", str: ":toc:", tooltip: "Toable of Contents" },
     * { text: "BIB", icon: "", str: ":bibliography: ::", tooltip: "Insert References" },
     * { text: "APP", icon: "", str: ":appendix:", tooltip: "Start Appendix" },
     * { text: "sep" },
     * { text: "", icon: "Books", str: ":bibtex: ::", tooltip: "Bibliography" },
     * {
     *   text: "",
     *   icon: "Book2",
     *   str: "@article{my-lbl\ntitle={},\nauthor={}\nyear={},\njournal={},\ndoi={},\n}\n}",
     *   tooltip: "Bibliography Item",
     * }, */
    /* { text: "sep" },
     * { text: "$B", icon: "", str: "${:label: my-lbl }  $", tooltip: "Math Block" },
     * { text: "$I", icon: "", str: "$$\n:label: my-lbl\n\n$$", tooltip: "Math Inline" },
     * { text: "THM", icon: "", str: "$$\n:label: my-lbl\n\n$$", tooltip: "Theorem" },
     * { text: "PRP", icon: "", str: "$$\n:label: my-lbl\n\n$$", tooltip: "Proposition" },
     * { text: "LEM", icon: "", str: "$$\n:label: my-lbl\n\n$$", tooltip: "Lemma" },
     * { text: "COR", icon: "", str: "$$\n:label: my-lbl\n\n$$", tooltip: "Corollary" },
     * { text: "PRF", icon: "", str: "$$\n:label: my-lbl\n\n$$", tooltip: "Proof" },
     * { text: "STP", icon: "", str: "$$\n:label: my-lbl\n\n$$", tooltip: "Proof Step" },
     * { text: ":P:", icon: "", str: "$$\n:label: my-lbl\n\n$$", tooltip: "Sub-Proof" },
     * { text: "sep" },
     * { text: ":assume:", icon: "", tooltip: "Heading" },
     * { text: ":case:", icon: "", tooltip: "Heading" },
     * { text: ":claim:", icon: "", tooltip: "Heading" },
     * { text: ":define:", icon: "", tooltip: "Heading" },
     * { text: ":let:", icon: "", tooltip: "Heading" },
     * { text: ":new:", icon: "", tooltip: "Heading" },
     * { text: ":pick:", icon: "", tooltip: "Heading" },
     * { text: ":prove:", icon: "", tooltip: "Heading" },
     * { text: ":st:", icon: "", tooltip: "Heading" },
     * { text: ":suffices:", icon: "", tooltip: "Heading" },
     * { text: ":suppose:", icon: "", tooltip: "Heading" },
     * { text: ":then:", icon: "", tooltip: "Heading" },
     * { text: ":wlog:", icon: "", tooltip: "Heading" },
     * { text: ":write:", icon: "", tooltip: "Heading" }, */
  ];

  const btnEls = reactive({});
  const toolbarRef = ref(null);
  const leftRef = ref(null);
  const contextMenuRef = ref(null);
  const visibleItems = ref([]);
  const overflowItems = ref([]);

  const getRefKey = (obj) => obj.text || obj.icon;
  const setRef = (el, obj) => {
    if (!el) return;
    btnEls[getRefKey(obj)] = el.btn;
  };
  const getBtnEl = (obj) => btnEls[getRefKey(obj)] || null;

  const calculateOverflow = () => {
    if (!leftRef.value || !toolbarRef.value) return;

    const containerWidth = leftRef.value.clientWidth;
    const overflowBtnWidth = 32; // Match button width
    const availableWidth = containerWidth - overflowBtnWidth;

    let currentWidth = 0;
    const visible = [];
    const overflow = [];

    for (const item of btnInfo) {
      if (item.text === "sep") {
        const sepWidth = 18;
        if (currentWidth + sepWidth <= availableWidth) {
          currentWidth += sepWidth;
          visible.push(item);
        } else {
          overflow.push(item);
        }
      } else {
        const btnWidth = 32;
        if (currentWidth + btnWidth <= availableWidth) {
          currentWidth += btnWidth;
          visible.push(item);
        } else {
          overflow.push(item);
        }
      }
    }

    visibleItems.value = visible;
    overflowItems.value = overflow;
  };

  const handleResize = () => {
    nextTick(() => calculateOverflow());
  };

  const handleOverflowItemClick = (str) => {
    emit("insert", str);
  };

  onMounted(() => {
    nextTick(() => {
      calculateOverflow();
      window.addEventListener("resize", handleResize);
    });
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });

  const hasOverflow = computed(() => overflowItems.value.length > 0);
</script>

<template>
  <div ref="toolbarRef" class="toolbar">
    <div ref="leftRef" class="left">
      <template v-for="obj in visibleItems" :key="obj.text || obj.icon">
        <HSeparator v-if="obj.text == 'sep'" />
        <Button
          v-else
          :ref="(el) => setRef(el, obj)"
          kind="tertiary"
          size="sm"
          :text="obj.text"
          :icon="obj.icon"
          @click="() => emit('insert', obj.str)"
        />
        <Tooltip v-if="obj.tooltip" :anchor="getBtnEl(obj)" placement="top">
          {{ obj.tooltip }}
        </Tooltip>
      </template>
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

    <!-- <div class="right">
         <ContextMenu
         v-if="hasOverflow"
         ref="contextMenuRef"
         icon="Dots"
         button-size="btn-sm"
         placement="bottom-end"
         >
         <template v-for="obj in overflowItems" :key="obj.text || obj.icon">
         <div v-if="obj.text == 'sep'" class="menu-separator" />
         <ContextMenuItem
         v-else
         :icon="obj.icon || ''"
         :caption="`${obj.text} ${obj.tooltip}`"
         @click="() => handleOverflowItemClick(obj.str)"
         >
         <Tooltip :content="obj.tooltip" />
         </ContextMenuItem>
         </template>
         </ContextMenu>
         </div> -->
  </div>
</template>

<style scoped>
  .toolbar {
    position: relative;
    flex: 0;
    display: flex;
    justify-content: space-between;
    min-height: var(--toolbar-height);
    max-height: calc(var(--toolbar-height) * 2 + 8px);
    border-radius: 0 8px 0 0;
    padding: 4px;
    background-color: var(--surface-hover);
    overflow: hidden;
  }

  .toolbar .h-sep {
    margin: 4px;
    height: 24px;
  }

  .toolbar > .left {
    display: flex;
    gap: 2px;
    flex-wrap: nowrap;
    flex: 1;
    overflow-x: auto;
    white-space: nowrap;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .toolbar::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 100%;
    pointer-events: none;
    background: linear-gradient(to left, rgba(0, 0, 0, 0.15), transparent);
    z-index: 1;
  }

  .toolbar > .left > :deep(button:has(> .btn-text)) {
    padding-inline: 0px !important;
    width: 32px !important;
  }

  .toolbar > .left > button > :deep(.btn-text) {
    margin: 0 auto;
    font-family: "Source Code Pro", monospace !important;
    font-size: 16px;
  }

  .toolbar > .left > .cm-wrapper > :deep(.cm-btn) {
    padding-inline: 6px;
    font-size: 16px;
    font-weight: var(--weight-regular);
    font-family: "Source Sans 3", sans-serif;
    text-transform: none;
  }

  .toolbar > .left > .cm-wrapper {
    align-content: center;
  }

  .toolbar > .left > .cm-wrapper :deep(> button) {
    color: var(--extra-dark);
  }

  .cm-menu {
    max-height: 400px;
    overflow-y: auto;
  }
</style>
