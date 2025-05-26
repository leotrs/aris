<script setup>
  import { ref, reactive, nextTick, onMounted, toRaw } from "vue";

  const emit = defineEmits(["insert", "compile"]);

  // tabs and compile at the top - just make tabs with empty content?
  // tabs and compile at the top - just make tabs with empty content?
  // tabs and compile at the top - just make tabs with empty content?
  // tabs and compile at the top - just make tabs with empty content?
  // tabs and compile at the top - just make tabs with empty content?

  const btnInfo = [
    { text: "", icon: "Heading", str: "# \n:label: my-lbl\n\n::", tooltip: "Heading" },
    { text: "", icon: "Bold", str: "**", tooltip: "Bold" },
    { text: "", icon: "Italic", str: "//", tooltip: "Italic" },
    { text: ":B:", icon: "", str: ":block:\n\n::", tooltip: "Block Tag" },
    { text: ":I:", icon: "", str: ":inline: ::", tooltip: "Inline Tag" },
    { text: "", icon: "MessageCode", str: "% ", tooltip: "Comment" },
    { text: "sep" },
    { text: "", icon: "List", str: ":itemize:\n\n:item:\n\n::", tooltip: "List" },
    { text: "", icon: "ListNumbers", str: ":enumerate:\n\n:item:\n\n::", tooltip: "Numbered List" },
    { text: "", icon: "Photo", str: ":figure:\n:path:filepath.jpg\n\n::", tooltip: "Figure" },
    { text: "", icon: "Table", str: ":table:\n::", tooltip: "Table" },
    { text: "", icon: "Code", str: "``", tooltip: "Code" },
    { text: "", icon: "SourceCode", str: "```\n\n```", tooltip: "Code Block" },
    { text: "sep" },
    { text: "", icon: "FileSymlink", str: ":ref:my-lbl::", tooltip: "Internal Cross-Reference" },
    { text: "", icon: "Quote", str: ":cite:my-lbl::", tooltip: "Citation" },
    { text: "", icon: "Link", str: ":url:foo,bar::", tooltip: "URL" },
    { text: "sep" },
    {
      text: "AUT",
      icon: "",
      str: ":author:\n:name:\n:email:\n:affiliation:\n::",
      tooltip: "Author",
    },
    { text: "ABS", icon: "", str: ":abstract:\n\n::", tooltip: "Abstract" },
    { text: "BIB", icon: "", str: ":bibliography: ::", tooltip: "Insert References" },
    { text: "APP", icon: "", str: ":appendix:", tooltip: "Start Appendix" },
    { text: "sep" },
    { text: "", icon: "Books", str: ":bibtex: ::", tooltip: "Bibliography" },
    {
      text: "",
      icon: "Book2",
      str: "@article{my-lbl\ntitle={},\nauthor={}\nyear={},\njournal={},\ndoi={},\n}\n}",
      tooltip: "Bibliography Item",
    },
    { text: "sep" },
    { text: "$B", icon: "", str: "${:label: my-lbl }  $", tooltip: "Math Block" },
    { text: "$I", icon: "", str: "$$\n:label: my-lbl\n\n$$", tooltip: "Math Inline" },
    { text: "THM", icon: "", str: "$$\n:label: my-lbl\n\n$$", tooltip: "Theorem" },
    { text: "PRP", icon: "", str: "$$\n:label: my-lbl\n\n$$", tooltip: "Proposition" },
    { text: "LEM", icon: "", str: "$$\n:label: my-lbl\n\n$$", tooltip: "Lemma" },
    { text: "COR", icon: "", str: "$$\n:label: my-lbl\n\n$$", tooltip: "Corollary" },
    { text: "PRF", icon: "", str: "$$\n:label: my-lbl\n\n$$", tooltip: "Proof" },
    { text: "STP", icon: "", str: "$$\n:label: my-lbl\n\n$$", tooltip: "Proof Step" },
    { text: ":P:", icon: "", str: "$$\n:label: my-lbl\n\n$$", tooltip: "Sub-Proof" },
    { text: "sep" },
    { text: ":assume:", icon: "", tooltip: "Heading" },
    { text: ":case:", icon: "", tooltip: "Heading" },
    { text: ":claim:", icon: "", tooltip: "Heading" },
    { text: ":define:", icon: "", tooltip: "Heading" },
    { text: ":let:", icon: "", tooltip: "Heading" },
    { text: ":new:", icon: "", tooltip: "Heading" },
    { text: ":pick:", icon: "", tooltip: "Heading" },
    { text: ":prove:", icon: "", tooltip: "Heading" },
    { text: ":st:", icon: "", tooltip: "Heading" },
    { text: ":suffices:", icon: "", tooltip: "Heading" },
    { text: ":suppose:", icon: "", tooltip: "Heading" },
    { text: ":then:", icon: "", tooltip: "Heading" },
    { text: ":wlog:", icon: "", tooltip: "Heading" },
    { text: ":write:", icon: "", tooltip: "Heading" },
  ];

  const btnEls = reactive({});
  const getRefKey = (obj) => obj.text || obj.icon;
  const setRef = (el, obj) => {
    if (!el) return;
    btnEls[getRefKey(obj)] = el.btn;
  };
  const getBtnEl = (obj) => btnEls[getRefKey(obj)] || null;
</script>

<template>
  <div class="toolbar">
    <Tabs :labels="['Source', 'Files']" :icons="['Code', 'Files']">
      <TabPage />
      <TabPage />
    </Tabs>

    <div class="left">
      <!-- This should be tabs NOT segmented control... -->
      <!-- <SegmentedControl :icons="['Code', 'Files']" :default-active="0" />
             <HSeparator /> -->
      <template v-for="obj in btnInfo" :key="obj.text || obj.icon">
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
    </div>
    <div class="right">
      <Button kind="primary" size="sm" text="compile" class="cta" @click="emit('compile')" />
    </div>
  </div>
</template>

<style scoped>
  .toolbar {
    flex: 0;
    display: flex;
    /* flex-wrap: wrap; */
    justify-content: space-between;
    min-height: var(--toolbar-height);
    max-height: calc(var(--toolbar-height) * 2 + 8px);
    border-radius: 8px 8px 0 0;
    padding: 8px;
    gap: 16px;
    background-color: var(--surface-hover);
  }

  .toolbar .h-sep {
    margin-inline: 8px;
  }

  .toolbar > .left {
    display: flex;
    flex-wrap: wrap;
  }

  .toolbar > .left > :deep(button:has(> .btn-text)) {
    padding-inline: 0px !important;
    width: 32px !important;
  }

  .toolbar > .left > :deep(button > .btn-text) {
    margin: 0 auto;
    font-family: "Source Code Pro", monospace !important;
  }

  .toolbar > .right {
    display: flex;
  }

  .toolbar > .left :deep(.sc-btn) {
    padding: 0;
  }
</style>
