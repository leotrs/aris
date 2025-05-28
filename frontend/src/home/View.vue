<script setup>
  import { ref, inject, computed, watch, useTemplateRef } from "vue";
  import { useRouter } from "vue-router";
  import { useElementSize } from "@vueuse/core";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import Sidebar from "./Sidebar.vue";
  import FilesPane from "./FilesPane.vue";
  import PreviewPane from "./PreviewPane.vue";
  import UploadFile from "./ModalUploadFile.vue";
  import DragBorder from "./DragBorder.vue";

  const showModal = ref(false);
  const fileStore = inject("fileStore");
  const user = inject("user");
  const mobileMode = inject("mobileMode");

  // New empty file
  const router = useRouter();
  const newEmptyFile = async () => {
    console.log("new empty file for user with id", user.value.id);
    try {
      const newFile = await fileStore.value.createFile({
        ownerId: user.value.id,
        source: ":rsm:\n# New File\n\nThe possibilities are *endless*!\n\n::\n",
      });
      router.push(`/file/${newFile.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle draggable border and pane height
  const panesRef = useTemplateRef("panes-ref");
  const { height: panesHeight } = useElementSize(panesRef);
  const boxTopPixels = 16 + 48 + 16 + 40 + 56 + 6; // padding + topbar height + gap + pane header height + height of one item row + epsilon
  const borderPos = ref(0);
  const filesHeight = computed(() =>
    fileStore.value?.selectedFile.value?.id ? `calc(${borderPos.value}%)` : "100%"
  );
  const previewHeight = computed(() =>
    fileStore.value?.selectedFile.value?.id ? `calc(${100 - borderPos.value}%)` : "0%"
  );
  watch(
    () => !!fileStore.value?.selectedFile.value?.id,
    (hasSelection, oldValue) => {
      // Make sure borderPos is correct when transitioning from no selection to having a selection
      if (hasSelection && !oldValue) borderPos.value = (boxTopPixels / panesHeight.value) * 100;
    }
  );

  // Dragging should be instantaneous, thus we only want a transition when NOT dragging
  const borderRef = useTemplateRef("border-ref");
  const paneHeightTransition = computed(() => {
    if (!borderRef.value) return "";
    else return borderRef.value.isDragging ? "" : "height var(--transition-duration) ease";
  });

  /* Since the gap between panes is 8px but the outer padding is 16px, when the Preview
   * pane is inactive, its top edge peeks out by 8px. This hides it. */
  const previewTop = computed(() => (fileStore.value.selectedFile.value?.id ? "0" : "8px"));

  // Keys
  const userMenuRef = useTemplateRef("user-menu");
  useKeyboardShortcuts({ u: () => userMenuRef.value.toggle() }, true);
</script>

<template>
  <div class="view" :class="{ mobile: mobileMode }">
    <Sidebar @new-empty-file="newEmptyFile" @show-file-upload-modal="showModal = true" />

    <div class="menus" :class="{ mobile: mobileMode }">
      <Button kind="tertiary" icon="Bell" />
      <UserMenu ref="user-menu" />
    </div>

    <div ref="panes-ref" class="panes">
      <FilesPane :style="{ height: '100%' }" />

      <!-- <DragBorder
           ref="border-ref"
           v-model="borderPos"
           :active="!!Object.keys(fileStore.value.selectedFile).length"
           :box-top="boxTopPixels"
           :parent-height="panesHeight"
           />

           <PreviewPane
           :file="fileStore.value.selectedFile"
           :style="{ height: previewHeight, top: previewTop }"
           /> -->
    </div>

    <div v-if="showModal" class="modal">
      <UploadFile @close="showModal = false" />
    </div>
  </div>
</template>

<style scoped>
  .view {
    --transition-duration: 0.3s;

    position: relative;
    display: flex;
    flex-grow: 2;
    padding: 16px 16px 16px 0;
    height: 100%;
  }

  .view.mobile {
    padding: 0;
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

  .menus.mobile {
    top: 16px;
    right: 16px;
  }

  .panes {
    position: relative;
    flex-grow: 1;
    height: 100%;
    border-radius: 16px;
  }

  .pane {
    background-color: var(--surface-primary);
    padding: 16px 16px 0 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border-radius: 16px;
    box-shadow: var(--shadow-soft);
    transition: v-bind(paneHeightTransition);
  }

  .modal {
    position: absolute;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(2px) brightness(0.9);
    z-index: 999;
  }
</style>
