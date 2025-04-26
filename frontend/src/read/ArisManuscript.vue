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
  import { useElementSize, useScroll } from "@vueuse/core";
  import createElementVisibilityObserver from "@/composables/createElementVisibilityObserver";
  import axios from "axios";
  import Topbar from "./Topbar.vue";
  import Drawer from "./Drawer.vue";
  import PanelSearch from "./PanelSearch.vue";
  import Minimap from "../common/Minimap.vue";
  import PanelCitation from "./PanelCitation.vue";
  import PanelTags from "./PanelTags.vue";
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
    PanelTags,
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
    fontSize: "16px",
    lineHeight: "1.5",
    fontFamily: "Source Sans 3",
    margin: "M",
    columns: 1,
  });
  provide("fileSettings", fileSettings);

  watch(fileSettings, () => console.log(fileSettings));

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

  const manuscriptRef = useTemplateRef("manuscript-ref");
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

  /* Scroll position */
  const innerRef = useTemplateRef("inner-ref");
  const { y: yScroll } = useScroll(innerRef);
  watch(yScroll, () => console.log("Naked yScroll", yScroll.value));
  const yScrollPercent = computed(
    () => (yScroll.value / (manuscriptRef.value?.$el.clientHeight ?? 1)) * 100
  );
  provide("yScroll", yScrollPercent);

  /* Focus mode */
  const focusMode = inject("focusMode");
  // We would rather stick all of these options inside a style object and pass that to
  // :style. However, in <script> we need to use v-bind to apply fileSettings to specific
  // elements, and v-bind will overwrite :style. Thus all reactive styles in this
  // component need to be applied via v-bind.
  const outerWidth = ref(null);
  const outerLeft = ref(null);
  const borderRadius = ref(null);
  const innerHeight = ref(null);
  const innerTop = ref(null);
  const middlePaddingTop = ref(null);

  watch(
    focusMode,
    (newVal) => {
      if (newVal) {
        outerWidth.value = "100%";
        outerLeft.value = "0";
        borderRadius.value = "0";
        innerHeight.value = "100%";
        innerTop.value = "0";
        middlePaddingTop.value = "48px";
      } else {
        outerWidth.value = "calc(100% - 64px)";
        outerLeft.value = "64px";
        borderRadius.value = "16px";
        innerHeight.value = "calc(100% - var(--topbar-height))";
        innerTop.value = "calc(var(--topbar-height))";
        middlePaddingTop.value = "8px";
      }
    },
    { immediate: true }
  );
</script>

<template>
  <Suspense>
    <div class="outer-wrapper">
      <Topbar :show-title="!isMainTitleVisible" :component="validDrawerComponents[top.at(-1)]" />

      <div ref="inner-ref" class="inner-wrapper">
        <Drawer ref="leftColumnRef" class="left-column">
          <component :is="validDrawerComponents[comp]" v-for="comp in left" :doc="doc" />
        </Drawer>

        <Drawer
          ref="middleColumnRef"
          class="middle-column"
          :style="{ 'padding-top': middlePaddingTop }"
        >
          <ManuscriptWrapper
            ref="manuscript-ref"
            :html="htmlContent"
            :keys="true"
            :show-footer="true"
          />
        </Drawer>

        <Drawer ref="rightColumnRef" class="right-column">
          <component :is="validDrawerComponents[comp]" v-for="comp in right" :doc="doc" />
        </Drawer>
      </div>
    </div>
  </Suspense>
</template>

<style scoped>
  .outer-wrapper {
    --outer-padding: 8px;
    --sidebar-width: 64px;
    --topbar-height: 64px;

    position: relative;
    z-index: 1;
    box-shadow: var(--shadow-soft);
    width: v-bind(outerWidth);
    left: v-bind(outerLeft);
    border-radius: v-bind(borderRadius);
    transition:
      width var(--transition-duration) ease,
      left var(--transition-duration) ease,
      border-radius var(--transition-duration) ease;
  }

  .inner-wrapper {
    display: flex;
    width: 100%;
    height: v-bind(innerHeight);
    position: relative;
    top: v-bind(innerTop);
    background-color: v-bind("fileSettings.background");
    overflow-y: auto;
    justify-content: center;
    border-bottom-left-radius: v-bind(borderRadius);
    border-bottom-right-radius: v-bind(borderRadius);

    transition:
      border-radius var(--transition-duration) ease,
      height var(--transition-duration) ease,
      top var(--transition-duration) ease;
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
    transition: padding-top var(--transition-duration) ease;
  }

  .left-column,
  .right-column {
    min-width: 100px;
    flex-basis: 200px;
    flex-shrink: 1;
    flex-grow: 2;
    padding-inline: 16px;
    padding-block: 16px;
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

  :deep(.manuscriptwrapper) {
    font-size: v-bind(fileSettings.fontSize) !important;
    font-family: v-bind(` "${fileSettings.fontFamily}" `) !important;
    line-height: v-bind(fileSettings.lineHeight) !important;
  }
</style>
