<script setup>
  import { ref, watch, inject, useTemplateRef, nextTick, onUnmounted } from "vue";
  import createElementVisibilityObserver from "@/composables/createElementVisibilityObserver";
  import axios from "axios";
  import Topbar from "./Topbar.vue";
  import Drawer from "./Drawer.vue";
  import PanelSettings from "./PanelSettings.vue";
  import Minimap from "../common/Minimap.vue";

  const props = defineProps({
    left: { type: String, default: "" },
    right: { type: String, default: "" },
    top: { type: String, default: "" },
  });
  const doc = inject("doc");

  const validDrawerComponents = {
    PanelSettings,
    Minimap,
  };

  const htmlContent = ref("");
  watch(doc, async () => {
    if (!doc.value || !doc.value.id) return;

    try {
      const response = await axios.get(
        `http://localhost:8000/documents/${doc.value.id}/content`
      );
      htmlContent.value = response.data;
    } catch (error) {
      console.error("Error fetching HTML:", error);
    }
  });

  const manuscriptRef = useTemplateRef("manuscriptRef");

  const isMainTitleVisible = ref(true);
  let tearDown = () => {};
  watch(htmlContent, async () => {
    if (!manuscriptRef.value) return;
    await nextTick(); // waits for ManuscriptWrapper to receive htmlContent
    await nextTick(); // waits for v-html DOM to update
    tearDown();

    const mainTitle = manuscriptRef.value.$el.querySelector(
      "section.level-1 > .heading.hr"
    );
    if (!mainTitle) return;

    const { isVisible, tearDown: newTearDown } =
      createElementVisibilityObserver(mainTitle);
    isMainTitleVisible.value = isVisible.value;

    const stopWatch = watch(isVisible, (newVal) => (isMainTitleVisible.value = newVal));
    tearDown = () => {
      newTearDown();
      stopWatch();
    };
  });
  onUnmounted(() => tearDown());

  const backgroundColor = ref("var(--surface-page)");
</script>

<template>
  <div class="outer-wrapper">
    <Topbar :show-title="!isMainTitleVisible" />
    <div class="inner-wrapper">
      <div class="left-column">
        <Drawer side="left">
          <component :is="validDrawerComponents[left]" :doc="doc" />
        </Drawer>
      </div>

      <div class="middle-column">
        <ManuscriptWrapper
          ref="manuscriptRef"
          :html="htmlContent"
          :show-footer="true"
        />
      </div>

      <div class="right-column">
        <Drawer side="right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .outer-wrapper {
    --outer-padding: 8px;
    --sidebar-width: 64px;
    --topbar-height: 64px;

    width: calc(100% - 64px);
    height: 100%;
    position: relative;
    left: 64px;
    padding: 0 var(--outer-padding) var(--outer-padding) 0;
    border-radius: 16px;
  }

  .inner-wrapper {
    display: flex;
    width: 100%;
    height: calc(100% - var(--topbar-height) - var(--outer-padding));
    position: relative;
    top: calc(var(--topbar-height) + var(--outer-padding));
    background-color: v-bind("backgroundColor");
    overflow-y: auto;
    justify-content: center;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;

    /* These are standard CSS that are not yet supported - switch to them in the future */
    /* scrollbar-color: var(--light);
        scrollbar-width: 16px; */

    --scrollbar-width: 12px;
    --scrollbar-height: 24px;

    &::-webkit-scrollbar {
      width: var(--scrollbar-width);
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--gray-200);
      border-radius: 8px;
      height: var(--scrollbar-height);
      width: var(--scrollbar-width);
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--surface-hint);
    }
  }

  .middle-column {
    flex-basis: 720px;
    flex-shrink: 1;
    flex-grow: 1;
    min-width: 450px;
    max-width: 720px;
    z-index: 1;
    overflow-x: visible;
    height: fit-content;
    background-color: v-bind("backgroundColor");
    margin-top: 8px;
  }

  .left-column,
  .right-column {
    max-width: 292px;
    flex-basis: 200px;
    min-width: 100px;
    flex-shrink: 1;
    flex-grow: 2;
    padding-inline: 16px;
    padding-block: 16px;
    background-color: v-bind("backgroundColor");
    height: 100%;
  }

  .left-column {
  }

  .right-column {
  }

  .middle-column {
    min-width: 576px;
    max-width: 720px;
    z-index: 1;
    overflow-x: visible;
    height: fit-content;
    background-color: v-bind("backgroundColor");
  }

  :deep(.float-minimap-wrapper) {
    display: none !important;
  }

  :deep(.mm-wrapper .minimap) {
    position: fixed;
  }
</style>
