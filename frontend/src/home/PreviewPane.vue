<script setup>
  import { ref, inject, watch } from "vue";
  import { useRouter } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import useClosable from "@/composables/useClosable.js";
  import PreviewTabPreview from "./PreviewTabPreview.vue";
  import PreviewTabActivity from "./PreviewTabActivity.vue";
  import PreviewTabHistory from "./PreviewTabHistory.vue";
  import PreviewTabCitation from "./PreviewTabCitation.vue";

  const props = defineProps({ file: { type: Object, required: true } });
  const { clearSelection } = inject("fileStore");

  // Tabs
  const activeTabIndex = ref(0);

  // Closable
  const close = () => clearSelection();
  useClosable({ onClose: close, closeOnOutsideClick: false });

  // Actions
  const router = useRouter();
  const read = () => {
    if (!props.file.value || !("id" in props.file.value)) return;
    router.push(`/${props.file.value.id}/read`);
    clearSelection();
  };
  const write = () => {
    if (!props.file.value || !("id" in props.file.value)) return;
    router.push(`/${props.file.value.id}/write`);
    clearSelection();
  };

  // Keys
  const { activate, deactivate } = useKeyboardShortcuts({ enter: read });
  watch(
    () => props.file,
    (newVal) => (newVal?.id ? activate() : deactivate()),
    { immediate: true, flush: "post" }
  );
</script>

<template>
  <Pane id="preview">
    <Header>
      <div class="left"></div>

      <div class="middle"><FileMenu mode="ButtonRow" /></div>

      <div class="right"><ButtonClose @close="close" /></div>
    </Header>
    <div v-if="!!Object.keys(file.value).length" class="pane-content">
      <Tabs
        ref="tabs-ref"
        v-model="activeTabIndex"
        :labels="['Preview', 'Activity', 'History', 'Citation']"
        :icons="['Eye', 'Bolt', 'Clock', 'Quote']"
      >
        <TabPage><PreviewTabPreview :file="file" /></TabPage>
        <TabPage><PreviewTabActivity /></TabPage>
        <TabPage><PreviewTabHistory /></TabPage>
        <TabPage><PreviewTabCitation :file="file" /></TabPage>
      </Tabs>
    </div>
    <div class="pane-footer">
      <div class="left"></div>
      <div class="right">
        <Button kind="tertiary" size="sm" text="Write" icon="Pencil" @click="write" />
        <Button kind="tertiary" size="sm" text="Review" icon="FileCheck" />
        <Button kind="primary" size="sm" text="Read" icon="Book" @click="read" />
      </div>
    </div>
  </Pane>
</template>

<style scoped>
  .pane {
    --padding: 16px;
    --border-radius: 8px;

    position: relative;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 16px !important;
  }

  .pane-header {
    padding-block: calc(8px - var(--border-extrathin));

    & .left {
      /* 64px: width of a tab
       *    4: number of tabs
       *  8px: gap between tabs
       *    3: number of gaps (number of tabs - 1)
       * 16px: left position for the tabs header
       */
      width: calc(64px * 4 + 8px * 3 + 16px);
    }

    & .middle {
      display: flex;
      flex-wrap: wrap;
      row-gap: 16px;
      column-gap: 8px;
      /* otherwise the tabs will cover this */
      z-index: 1;
    }

    & .right {
      /* otherwise the tabs will cover this */
      z-index: 1;
    }
  }

  .tabs-wrapper {
    position: absolute;
    top: calc(var(--padding) + var(--border-extrathin));
    left: calc(var(--padding) + var(--border-extrathin));
    width: calc(100% - 3.5 * var(--padding));
  }

  :deep(.tabs-header) {
    height: calc(48px - 2 * var(--border-thin));
    border: unset;
    position: relative;
    left: 16px;
    gap: 8px;
  }

  .pane-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 8px;

    .left {
      font-size: 12px;
      color: var(--medium);
    }

    .right {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
  }
</style>
