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

  /* handle draggable border and pane height */
  const borderPos = ref(50);
  const panesRef = useTemplateRef("panes-ref");
  const panesHeight = computed(() => panesRef.value?.clientHeight || 1);
  const offset = 16 + 48 + 16;
  const offsetPercent = computed(() => (offset / panesHeight.value) * 100);

  const filesHeight = computed(() => (selectedForPreview.value ? `${borderPos.value}%` : "100%"));
  const previewHeight = computed(() =>
    selectedForPreview.value ? `${100 - borderPos.value}%` : "0%"
  );
</script>

<template>
  <div ref="selfRef" :class="['view-wrapper', isMobile ? 'mobile' : '']">
    <Sidebar @show-file-upload-modal="showModal = true" />

    <div class="menus">
      <Button kind="tertiary" icon="Bell" />
      <UserMenu />
    </div>

    <div ref="panes-ref" class="panes">
      <FilesPane
        id="documents"
        :style="{ height: filesHeight }"
        @set-selected="setSelectedForPreview"
      />

      <DragBorder v-model="borderPos" :active="!!selectedForPreview" :offset="offsetPercent" />

      <PreviewPane
        v-if="!isMobile && selectedForPreview"
        :doc="selectedForPreview"
        :style="{ height: previewHeight }"
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
