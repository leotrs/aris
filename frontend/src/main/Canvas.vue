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
  import { registerAsFallback } from "@/composables/useKeyboardShortcuts.js";
  import ReaderTopbar from "./ReaderTopbar.vue";
  import EditorTopbar from "./EditorTopbar.vue";
  import Dock from "./Dock.vue";
  import Drawer from "./Drawer.vue";
  import DockableEditor from "./DockableEditor.vue";
  import DockableSearch from "./DockableSearch.vue";
  import DockableMinimap from "./DockableMinimap.vue";

  const props = defineProps({
    left: { type: Array, default: () => [] },
    right: { type: Array, default: () => [] },
    top: { type: Array, default: () => [] },
  });
  const file = defineModel({ type: Object });

  const validDockComponents = {
    /* DockableChat, */
    DockableSearch,
    DockableMinimap,
    DockableEditor,
    /* DockableComments, */
    /* DockableSymbols, */
    /* DockableClaims, */
  };

  const innerRef = useTemplateRef("inner-ref");
  const lftColRef = useTemplateRef("leftColumnRef");
  const midColRef = useTemplateRef("middleColumnRef");
  const rgtColRef = useTemplateRef("rightColumnRef");
  const columnSizes = reactive({
    left: { width: 0, height: 0 },
    middle: { width: 0, height: 0 },
    right: { width: 0, height: 0 },
    inner: { width: 0, height: 0 },
  });

  onMounted(async () => {
    await nextTick();
    const { width: lftColW, height: lftColH } = useElementSize(lftColRef);
    const { width: midColW, height: midColH } = useElementSize(midColRef);
    const { width: rgtColW, height: rgtColH } = useElementSize(rgtColRef);
    watch(lftColW, (w) => (columnSizes.left.width = w), { immediate: true });
    watch(midColW, (w) => (columnSizes.middle.width = w), { immediate: true });
    watch(rgtColW, (w) => (columnSizes.right.width = w), { immediate: true });
    watch(lftColH, (h) => (columnSizes.left.height = h), { immediate: true });
    watch(midColH, (h) => (columnSizes.middle.height = h), { immediate: true });
    watch(rgtColH, (h) => (columnSizes.right.height = h), { immediate: true });

    const { width: innerW, height: innerH } = useElementSize(innerRef);
    watch(innerW, (w) => (columnSizes.inner.width = w));
    watch(innerH, (h) => (columnSizes.inner.height = h));
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

  const api = inject("api");
  watch(
    file,
    async () => {
      if (!file.value || file.value.html || !file.value.id) return;

      try {
        const response = await api.get(`/files/${file.value.id}/content`);
        file.value.html = response.data;
      } catch (error) {
        console.error("Error fetching HTML:", error);
      }
    },
    { immediate: true }
  );

  const manuscriptRef = useTemplateRef("manuscript-ref");
  watch(
    () => manuscriptRef.value?.mountPoint,
    (newVal) => {
      if (!newVal) return;
      file.value.isMountedAt = newVal;
    },
    { immediate: true }
  );
  provide("manuscriptRef", manuscriptRef);

  const isMainTitleVisible = ref(true);
  let tearDown = () => {};
  watch(
    () => file.value.html,
    async () => {
      await nextTick(); // waits for ManuscriptWrapper to receive html
      await nextTick(); // waits for v-html DOM to update
      if (!manuscriptRef.value) return;
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
    }
  );
  onUnmounted(() => tearDown());

  /* Scroll position */
  const { y: yScroll } = useScroll(innerRef);
  const yScrollPercent = computed(
    () => (yScroll.value / (manuscriptRef.value?.$el.clientHeight ?? 1)) * 100
  );
  provide("yScroll", yScrollPercent);

  /* Keyboard shortcuts */
  registerAsFallback(manuscriptRef);

  /* Focus mode */
  const focusMode = inject("focusMode");
</script>

<template>
  <Suspense>
    <div class="outer" :class="{ focus: focusMode }">
      <div class="inner left">
        <EditorTopbar />
        <div class="main"><DockableEditor v-model="file" /></div>
      </div>

      <div class="inner right">
        <ReaderTopbar
          :show-title="!isMainTitleVisible"
          :component="validDockComponents[top.at(-1)]"
        />
        <div class="main">
          <Dock ref="leftColumnRef" class="left-column"> </Dock>
          <Dock ref="middleColumnRef" class="middle-column" :class="{ focus: focusMode }">
            <ManuscriptWrapper
              v-if="file.html"
              ref="manuscript-ref"
              :class="{ 'title-visible': isMainTitleVisible }"
              :html-string="file.html || ''"
              :keys="true"
              :show-footer="true"
            />
          </Dock>
          <Dock ref="rightColumnRef" class="right-column"> </Dock>
        </div>
      </div>

      <!-- <Drawer :class="{ focus: focusMode }" /> -->
    </div>
  </Suspense>
</template>

<style scoped>
  .outer {
    --outer-padding: 8px;
    --sidebar-width: 64px;
    --topbar-height: 64px;

    display: flex;
    position: relative;
    z-index: 1;
    box-shadow: var(--shadow-soft);

    width: calc(100% - 64px);
    left: var(--sidebar-width);
    border-radius: 16px;
    will-change: width, left, border-radius;
    transition:
      width var(--transition-duration) ease,
      left var(--transition-duration) ease,
      border-radius var(--transition-duration) ease;
  }

  .outer.focus {
    width: 100%;
    left: 0;
    border-radius: 0;
  }

  .inner {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 50%;
    padding-inline: 16px;
    height: 100%;
    background-color: v-bind("fileSettings.background");
    justify-content: center;
    will-change: border-radius, height, top;
    transition:
      border-radius var(--transition-duration) ease,
      height var(--transition-duration) ease,
      top var(--transition-duration) ease;

    &.left {
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
      flex: 1;
      max-width: 720px;
    }

    &.right {
      border-top-right-radius: 16px;
      border-bottom-right-radius: 16px;
      flex: 1;
    }
  }

  .inner.focus {
    top: 0;
    height: 100%;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .inner .main {
    position: relative;
    height: calc(100% - 64px);
  }

  .inner.right .main {
    display: flex;
    justify-content: center;
    overflow-y: auto;
  }

  .inner.right .main :is(.left-column, .right-column) {
    width: 0px;
  }

  .inner.right .main .middle-column {
    max-width: 720px;
    z-index: 1;
    overflow-x: visible;
    will-change: padding-top;
    height: fit-content;
    transition: padding-top var(--transition-duration) ease;
  }

  .inner.right .main .middle-column {
    flex: 1;
  }

  .inner.right .main .left-column.focus {
    padding-top: 16px;
  }

  .inner.right .main .middle-column.focus {
    padding-top: 48px;
  }

  .d-wrapper.focus {
    opacity: 0;
    transition: opacity var(--transition-duration) ease;
  }

  .rsm-manuscript {
    padding: 16px 16px 0 16px;
    margin-bottom: 16px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    border: var(--border-extrathin) solid var(--border-primary);
    border-top: none;
    box-shadow: var(--shadow-soft);
  }

  :deep(.float-minimap-wrapper) {
    display: none !important;
  }

  :deep(.mm-wrapper) {
    position: fixed;
  }

  :deep(.manuscriptwrapper) {
    font-size: v-bind(fileSettings.fontSize) !important;
    font-family: v-bind(` "${fileSettings.fontFamily}" `) !important;
    line-height: v-bind(fileSettings.lineHeight) !important;
  }
</style>
