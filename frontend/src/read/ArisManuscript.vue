<script setup>
  import { ref, watch, inject, useTemplateRef, nextTick, onUnmounted } from "vue";
  import createElementVisibilityObserver from "@/composables/createElementVisibilityObserver";
  import axios from "axios";
  import Topbar from "./Topbar.vue";
  import Drawer from "./Drawer.vue";

  const props = defineProps({
    left: { type: String, default: "" },
    right: { type: String, default: "" },
    top: { type: String, default: "" },
  });
  const doc = inject("doc");

  const htmlContent = ref("");
  watch(doc, async () => {
    if (!doc.value) return;

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
    await nextTick();
    tearDown();

    const mainTitle = manuscriptRef.value.$el.querySelector(
      "section.level-1 > .heading.hr"
    );
    if (!mainTitle) return;

    const { isVisible, tearDown: newtearDown } =
      createElementVisibilityObserver(mainTitle);

    isMainTitleVisible.value = isVisible.value;

    const stopWatch = watch(isVisible, (newVal) => (isMainTitleVisible.value = newVal));

    tearDown = () => {
      newtearDown();
      stopWatch();
    };
  });
  onUnmounted(() => tearDown());

  watch(
    () => props.left,
    () => {
      console.log("hi");
    }
  );

  const backgroundColor = ref("var(--surface-page)");
</script>

<template>
  <div class="outer-wrapper">
    <Topbar :show-title="!isMainTitleVisible" />
    <div class="inner-wrapper">
      <div class="left-column">
        <Drawer side="left" :scroll="true"><component :is="left || null" /></Drawer>
        <Drawer side="left" :scroll="false" />
      </div>

      <div class="middle-column">
        <ManuscriptWrapper
          ref="manuscriptRef"
          :html="htmlContent"
          :show-footer="true"
        />
      </div>

      <div class="right-column">
        <Drawer side="right" :scroll="true" />
        <Drawer side="right" :scroll="false" />
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

    /* These are standard CSS that are not yet supported - switch to them in the future */
    /* scrollbar-color: var(--light);
        scrollbar-width: 16px; */

    &::-webkit-scrollbar {
      width: 16px;
      background: transparent;
    }

    &::-webkit-scrollbar-track {
      border-bottom-right-radius: 16px;
      border-top-right-radius: 16px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--gray-200);
      border-radius: 8px;
      height: 32px;
      width: 16px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--surface-hint);
    }
  }

  .middle-column {
    margin-top: 8px;
  }

  .left-column,
  .right-column {
    flex-basis: 292px;
    min-width: 120px;
    background-color: var(--surface-page);
    padding-inline: 16px;
    padding-block: 16px;
    background-color: v-bind("backgroundColor");
    height: 100%;
  }

  .left-column {
    position: relative;
  }

  .right-column {
  }

  .left-column.fixed,
  .right-column.fixed {
    position: fixed;
    height: calc(100% - 64px);
    background-color: transparent;
    top: 64px;
    overflow-y: auto;
  }

  .left-column.fixed {
    left: 64px;

    & > :deep(.minimap) {
      position: absolute;
      width: 48px;
      top: calc(64px + 40px);
      height: calc(100% - 152px);
      left: 0;
      right: 0;
      margin: 0 auto;
    }

    & > :deep(.minimap > svg) {
      height: 100%;
    }
  }

  .right-column.fixed {
    right: 0;
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
</style>
