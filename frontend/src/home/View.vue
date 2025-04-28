<script setup>
  import { ref, inject, computed, watch, useTemplateRef, onMounted } from "vue";
  import { useElementSize } from "@vueuse/core";
  import Sidebar from "./Sidebar.vue";
  import FilesPane from "./FilesPane.vue";
  import PreviewPane from "./PreviewPane.vue";
  import UploadFile from "./ModalUploadFile.vue";
  import DragBorder from "./DragBorder.vue";
  const showModal = ref(false);
  const isMobile = inject("isMobile");

  const selectedForPreview = ref({});
  const setSelectedForPreview = (doc) => (selectedForPreview.value = doc || {});

  /* Handle draggable border and pane height */
  const panesRef = useTemplateRef("panes-ref");
  const { height: panesHeight } = useElementSize(panesRef);
  const boxTopPixels = 16 + 48 + 16 + 40 + 56 + 6; // padding + topbar height + gap + pane header height + height of one item row + epsilon
  const borderPos = ref(0);

  /* Set panes' heights based on where the border is */
  const filesHeight = computed(() =>
    selectedForPreview.value?.id ? `calc(${borderPos.value}%)` : "100%"
  );
  const previewHeight = computed(() =>
    selectedForPreview.value?.id ? `calc(${100 - borderPos.value}%)` : "0%"
  );

  /* Dragging should be instantaneous, thus we only want a transition when NOT dragging */
  const borderRef = useTemplateRef("border-ref");
  const paneHeightTransition = computed(() => {
    if (!borderRef.value) return "";
    else return borderRef.value.isDragging ? "" : "height var(--transition-duration) ease";
  });

  /* Since the gap between panes is 8px but the outer padding is 16px, when the Preview
   * pane is inactive, its top edge peeks out by 8px. This hides it. */
  const previewPaneTop = computed(() => (selectedForPreview.value?.id ? "0" : "8px"));
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

      <DragBorder
        ref="border-ref"
        v-model="borderPos"
        :active="!!Object.keys(selectedForPreview).length"
        :box-top="boxTopPixels"
        :parent-height="panesHeight"
      />

      <PreviewPane
        v-if="!isMobile"
        :doc="selectedForPreview"
        :style="{ height: previewHeight, top: previewPaneTop }"
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
    --transition-duration: 0.3s;

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

      & :deep(.pane-header) {
        background-color: var(--surface-hover);
        border-color: var(--border-primary);
      }
    }
  }

  .pane {
    transition: v-bind(paneHeightTransition);
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
