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
  import axios from "axios";
  import Topbar from "./CanvasTopbar.vue";
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
    <div class="outer-wrapper" :class="{ focus: focusMode }">
      <Topbar :show-title="!isMainTitleVisible" :component="validDockComponents[top.at(-1)]" />

      <div ref="inner-ref" class="inner-wrapper" :class="{ focus: focusMode }">
        <Dock
          ref="leftColumnRef"
          class="left-column"
          :style="{ flex: left.length > 0 ? '1' : '0' }"
        >
          <DockableEditor v-if="left.length > 0" ref="editor-ref" v-model="file" />
        </Dock>

        <Dock ref="middleColumnRef" class="middle-column" :class="{ focus: focusMode }">
          <ManuscriptWrapper
            v-if="file.html"
            ref="manuscript-ref"
            :html-string="file.html || ''"
            :keys="true"
            :show-footer="true"
          />
        </Dock>

        <Dock ref="rightColumnRef" class="right-column">
          <component
            :is="validDockComponents[comp]"
            v-for="comp in right"
            :key="comp"
            :file="file"
            side="right"
          />
        </Dock>

        <Drawer :class="{ focus: focusMode }" />
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

    width: calc(100% - 64px);
    left: var(--sidebar-width);
    border-radius: 16px;
    will-change: width, left, border-radius;
    transition:
      width var(--transition-duration) ease,
      left var(--transition-duration) ease,
      border-radius var(--transition-duration) ease;
  }

  .outer-wrapper.focus {
    width: 100%;
    left: 0;
    border-radius: 0;
  }

  .inner-wrapper {
    display: flex;
    width: 100%;
    height: calc(100% - var(--topbar-height));
    position: relative;
    top: var(--topbar-height);
    background-color: v-bind("fileSettings.background");
    justify-content: center;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    will-change: border-radius, height, top;
    transition:
      border-radius var(--transition-duration) ease,
      height var(--transition-duration) ease,
      top var(--transition-duration) ease;
  }

  .inner-wrapper.focus {
    top: 0;
    height: 100%;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .left-column {
    /* flex: 0 or 1; decided via inline component style */
  }

  .left-column,
  .middle-column {
    max-width: 720px;
    z-index: 1;
    overflow-x: visible;
    padding-top: 16px;
    will-change: padding-top;
    height: 100%;
    transition: padding-top var(--transition-duration) ease;
  }

  .middle-column {
    flex: 1;
    overflow-y: auto;
  }

  .left-column.focus {
    padding-top: 16px;
  }

  .middle-column.focus {
    padding-top: 48px;
  }

  .right-column {
    position: absolute;
    min-width: 48px;
    flex-basis: 48px;
    flex-shrink: 0;
    flex-grow: 0;
    padding-inline: 16px;
    padding-block: 16px;
    height: 100%;
  }

  .d-wrapper.focus {
    opacity: 0;
    transition: opacity var(--transition-duration) ease;
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
