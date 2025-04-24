<script setup>
  import { ref, inject, computed, useTemplateRef } from "vue";
  import Sidebar from "./Sidebar.vue";
  import FilesPane from "./FilesPane.vue";
  import PreviewPane from "./PreviewPane.vue";
  import UploadFile from "./ModalUploadFile.vue";
  import DragBorder from "./DragBorder.vue";
  const showModal = ref(false);
  const isMobile = inject("isMobile");

  const selectedForPreview = ref(null);
  const setSelectedForPreview = (doc) => (selectedForPreview.value = doc);

  const borderPos = ref(0.5);
  const panesRef = useTemplateRef("panes-ref");
  const panesHeight = computed(() => panesRef.value?.getBoundingClientRect().height || 0);
  const filesHeight = computed(() => {
    if (!selectedForPreview.value) return "100%";
    const percent = ((borderPos.value + 16 + 48 + 16 + 40) / panesHeight.value) * 100;
    return `${percent}%`;
  });
  const previewHeight = computed(() => {
    if (!selectedForPreview.value) return "0";
    const percent =
      ((panesHeight.value - borderPos.value - 16 - 48 - 16 - 40) / panesHeight.value) * 100;
    return `${percent}%`;
  });
</script>

<template>
  <div ref="selfRef" :class="['view-wrapper', isMobile ? 'mobile' : '']">
    <Sidebar @show-file-upload-modal="showModal = true" />

    <div class="menus">
      <Button kind="tertiary" icon="Bell" />
      <UserMenu />
    </div>

    <div ref="panes-ref" class="panes">
      <FilesPane id="documents" @set-selected="setSelectedForPreview" />

      <DragBorder v-model="borderPos" :active="!!selectedForPreview" />

      <PreviewPane
        v-if="!isMobile && selectedForPreview"
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

  .panes {
    position: relative;
    flex-grow: 1;
    height: 100%;
    border-radius: 16px;

    & :deep(.pane) {
      background-color: var(--white);
      padding: 16px 16px 0 16px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
      border-radius: 16px;
      box-shadow: var(--shadow-soft);
    }

    & :deep(#documents:not(:has(~ .pane))) {
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

  #documents {
    height: v-bind(filesHeight);
  }

  #preview {
    height: v-bind(previewHeight);
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

  #preview {
  }

  .modal {
    position: absolute;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(2px) brightness(0.9);
  }

  .menus {
    position: absolute;
    right: 32px;
    top: 32px;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
