<script setup>
  import { ref, computed, useTemplateRef } from "vue";
  import { useDraggable } from "@vueuse/core";
  import Sidebar from "./Sidebar.vue";
  import FilesPane from "./FilesPane.vue";
  import PreviewPane from "./PreviewPane.vue";
  import UploadFile from "./ModalUploadFile.vue";

  const showModal = ref(false);
  const selfRef = useTemplateRef("selfRef");

  /*********** draggable Preview pane ***********/
  const container = useTemplateRef("separator-container-ref");
  const separator = useTemplateRef("separator-ref");

  const previewHeight = ref("50%");
  const onSeparatorDragged = (pos, _) => {
    const rect = container.value.getBoundingClientRect();
    console.log(pos.y, rect.height);
    previewHeight.value = `calc(30% + ${rect.height}px - ${pos.y}px)`;
  };
  const style = ref({});
  const selectedForPreview = ref(null);
  const separatorPointerEvents = computed(() => (selectedForPreview.value ? "all" : "none"));
  const setSelectedForPreview = (doc) => {
    selectedForPreview.value = doc;
    if (!doc) return;
    if (!container.value) return;
    const draggableStyle = useDraggable(separator, {
      initialValue: { x: 0, y: container.value.getBoundingClientRect().height / 2 - 2 },
      preventDefault: true,
      axis: "y",
      onMove: onSeparatorDragged,
      containerElement: container,
    });
    style.value = draggableStyle.style.value;
  };
</script>

<template>
  <div ref="selfRef" :class="['view-wrapper', isMobile ? 'mobile' : '']">
    <Sidebar @show-file-upload-modal="showModal = true" />

    <div class="views-row">
      <Button kind="tertiary" icon="Settings" />
      <Button kind="tertiary">
        <Avatar />
      </Button>
    </div>

    <div class="panes">
      <div id="documents" class="pane">
        <FilesPane @set-selected="setSelectedForPreview" />
      </div>

      <div ref="separator-container-ref" class="separator-container">
        <div ref="separator-ref" class="separator" :style="style" />
      </div>

      <PreviewPane
        v-if="!isMobile && selectedForPreview"
        ref="preview-ref"
        :doc="selectedForPreview"
        @set-selected="setSelectedForPreview"
      />
    </div>

    <div v-if="showModal" class="modal">
      <UploadFile @close="showModal = false" />
    </div>
  </div>
</template>

<style scoped>
  .view-wrapper {
    position: relative;
    display: flex;
    flex-grow: 2;
    padding: 16px 16px 16px 0;
    height: 100%;
  }

  .view-wrapper.mobile {
    padding: 0;
  }

  .separator-container {
    height: 40%;
    position: absolute;
    width: 100%;
    top: 30%;
    pointer-events: none;
  }

  .separator {
    position: absolute;
    bottom: 0;
    background-color: transparent;
    width: 100%;
    height: 12px;
    z-index: 1;
    pointer-events: v-bind(separatorPointerEvents);

    &:hover {
      cursor: row-resize;
    }
  }

  .panes {
    position: relative;
    flex-grow: 1;
    height: 100%;

    & :deep(.pane) {
      background-color: var(--almost-white);
      padding: 16px 16px 0 16px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 24px;
      border-radius: 16px;
    }

    & :deep(#documents:not(:has(~ .pane))) {
      min-height: 100%;
      max-height: 100%;
    }

    & :deep(#documents:has(~ .pane)) {
      min-height: 20%;
      max-height: 80%;
    }

    & :deep(#preview) {
      min-height: 20%;
      max-height: 80%;
    }
  }

  .view-wrapper.mobile {
    & :deep(.pane) {
      padding: 0;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
      border-radius: 16px;
    }
  }

  #documents {
    margin-bottom: 8px;
    height: calc(100% - v-bind(previewHeight));
  }

  #preview {
    height: v-bind(previewHeight);
  }

  .modal {
    position: absolute;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(2px) brightness(0.9);
  }

  .views-row {
    position: absolute;
    right: 32px;
    top: 32px;
    z-index: 1;
    display: flex;
    gap: 4px;
    white-space: nowrap;
  }
</style>
