<script setup>
  import {
    ref,
    reactive,
    computed,
    watch,
    inject,
    provide,
    useTemplateRef,
    nextTick,
    onMounted,
    onUnmounted,
  } from "vue";
  import { useElementSize } from "@vueuse/core";
  import createElementVisibilityObserver from "@/composables/createElementVisibilityObserver";
  import axios from "axios";
  import Topbar from "./Topbar.vue";
  import Drawer from "./Drawer.vue";
  import PanelSearch from "./PanelSearch.vue";
  import Minimap from "../common/Minimap.vue";
  import PanelCitation from "./PanelCitation.vue";
  import PanelSettings from "./PanelSettings.vue";

  const props = defineProps({
    left: { type: Array, default: () => [] },
    right: { type: Array, default: () => [] },
    top: { type: Array, default: () => [] },
  });
  const doc = inject("doc");

  const validDrawerComponents = {
    /* PanelChat, */
    PanelSearch,
    Minimap,
    /* Comments, */
    PanelCitation,
    /* PanelSymbols, */
    /* PanelClaims, */
    PanelSettings,
  };

  const leftColumnRef = useTemplateRef("leftColumnRef");
  const middleColumnRef = useTemplateRef("middleColumnRef");
  const rightColumnRef = useTemplateRef("rightColumnRef");
  const columnSizes = reactive({
    left: { width: 0, height: 0 },
    middle: { width: 0, height: 0 },
    right: { width: 0, height: 0 },
  });
  onMounted(async () => {
    await nextTick();
    const { width: leftColumnWidth, height: leftColumnHeight } = useElementSize(leftColumnRef);
    const { width: middleColumnWidth, height: middleColumnHeight } =
      useElementSize(middleColumnRef);
    const { width: rightColumnWidth, height: rightColumnHeight } = useElementSize(rightColumnRef);
    watch(leftColumnWidth, (w) => (columnSizes.left.width = w));
    watch(middleColumnWidth, (w) => (columnSizes.middle.width = w));
    watch(rightColumnWidth, (w) => (columnSizes.right.width = w));
    watch(leftColumnHeight, (h) => (columnSizes.left.height = h));
    watch(middleColumnHeight, (h) => (columnSizes.middle.height = h));
    watch(rightColumnHeight, (h) => (columnSizes.right.height = h));
  });
  provide("columnSizes", columnSizes);

  const fileSettings = reactive({
    background: "var(--surface-page)",
    fontSize: "med",
    density: "med",
    style: "sans",
    margin: "narrow",
    columns: 1,
  });
  provide("fileSettings", fileSettings);

  const minimapHeight = computed(() => `${columnSizes.left.height}px`);

  const htmlContent = ref("");
  watch(doc, async () => {
    if (!doc.value || !doc.value.id) return;

    try {
      const response = await axios.get(`http://localhost:8000/documents/${doc.value.id}/content`);
      htmlContent.value = response.data;
    } catch (error) {
      console.error("Error fetching HTML:", error);
    }
  });

  const manuscriptRef = useTemplateRef("manuscriptRef");
  provide("manuscriptRef", manuscriptRef);

  const isMainTitleVisible = ref(true);
  let tearDown = () => {};
  watch(htmlContent, async () => {
    if (!manuscriptRef.value) return;
    await nextTick(); // waits for ManuscriptWrapper to receive htmlContent
    await nextTick(); // waits for v-html DOM to update
    tearDown();

    const mainTitle = manuscriptRef.value.$el.querySelector("section.level-1 > .heading.hr");
    if (!mainTitle) return;

    const { isVisible, tearDown: newTearDown } = createElementVisibilityObserver(mainTitle);
    isMainTitleVisible.value = isVisible.value;

    const stopWatch = watch(isVisible, (newVal) => (isMainTitleVisible.value = newVal));
    tearDown = () => {
      newTearDown();
      stopWatch();
    };
  });
  onUnmounted(() => tearDown());
</script>

<template>
  <div class="outer-wrapper">
    <Topbar :show-title="!isMainTitleVisible" :component="validDrawerComponents[top.at(-1)]" />

    <div class="inner-wrapper">
      <Drawer ref="leftColumnRef" class="left-column">
        <component :is="validDrawerComponents[comp]" v-for="comp in left" :doc="doc" />
      </Drawer>

      <Drawer ref="middleColumnRef" class="middle-column">
        <ManuscriptWrapper ref="manuscriptRef" :html="htmlContent" :show-footer="true" />
      </Drawer>

      <Drawer ref="rightColumnRef" class="right-column">
        <component :is="validDrawerComponents[comp]" v-for="comp in right" :doc="doc" />
      </Drawer>
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
    background-color: v-bind("fileSettings.background");
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
    background-color: v-bind("fileSettings.background");
    margin-top: 8px;
  }

  .left-column,
  .right-column {
    min-width: 100px;
    max-width: 292px;
    flex-basis: 200px;
    flex-shrink: 1;
    flex-grow: 2;
    padding-inline: 16px;
    padding-block: 16px;
    background-color: v-bind("fileSettings.background");
    height: 100%;
  }

  :deep(.float-minimap-wrapper) {
    display: none !important;
  }

  :deep(.mm-wrapper .minimap) {
    position: fixed;
  }

  :deep(.mm-wrapper .minimap svg) {
    height: v-bind("minimapHeight");
  }
</style>
