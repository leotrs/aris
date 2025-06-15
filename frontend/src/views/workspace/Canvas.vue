<script setup>
  import {
    ref,
    reactive,
    computed,
    watch,
    watchEffect,
    inject,
    provide,
    useTemplateRef,
    nextTick,
    onMounted,
    onUnmounted,
  } from "vue";
  import { useElementSize, useScroll } from "@vueuse/core";
  import useElementVisibilityObserver from "@/composables/useElementVisibilityObserver";
  import { registerAsFallback } from "@/composables/useKeyboardShortcuts.js";
  import ReaderTopbar from "./ReaderTopbar.vue";
  import Dock from "./Dock.vue";
  import Editor from "./Editor.vue";
  import DockableMinimap from "./DockableMinimap.vue";
  import DockableSearch from "./DockableSearch.vue";
  import DockableAnnotations from "./DockableAnnotations.vue";

  const props = defineProps({
    showEditor: { type: Boolean, default: false },
    showSearch: { type: Boolean, default: false },
  });
  const file = defineModel({ type: Object });

  // Mount the manuscript
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

  // Expose some of the geometry
  const innerRef = useTemplateRef("inner-right-ref");
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

  const { y: yScroll } = useScroll(innerRef);
  const yScrollPercent = computed(
    () => (yScroll.value / (manuscriptRef.value?.$el.clientHeight ?? 1)) * 100
  );
  provide("yScroll", yScrollPercent);

  // File and file settings
  const api = inject("api");
  watchEffect((onCleanup) => {
    if (!file.value || file.value.html || !file.value.id) return;

    let cancelled = false;
    const fetchContent = async () => {
      try {
        const response = await api.get(`/files/${file.value.id}/content`);
        if (!cancelled && file.value) {
          file.value.html = response.data;
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching HTML:", error);
        }
      }
    };

    fetchContent();
    onCleanup(() => (cancelled = true));
  });
  const fileSettings = inject("fileSettings");

  // Is main title visible?
  const isMainTitleVisible = ref(true);
  let tearDown = () => {};
  watch(
    () => [file.value, manuscriptRef.value],
    async () => {
      if (!file.value || !manuscriptRef.value) return;
      tearDown();

      const mainTitle = manuscriptRef.value.$el.querySelector("section.level-1 > .heading.hr");
      if (!mainTitle) return;

      const { isVisible, tearDown: newTearDown } = useElementVisibilityObserver(mainTitle);
      isMainTitleVisible.value = isVisible.value;

      const stopWatch = watch(isVisible, (newVal) => (isMainTitleVisible.value = newVal));
      tearDown = () => {
        newTearDown();
        stopWatch();
      };
    },
    { immedate: true }
  );
  onUnmounted(() => tearDown());

  // Keyboard shortcuts
  registerAsFallback(manuscriptRef);

  // Responsiveness to viewport and various modes
  const mobileMode = inject("mobileMode");
  const focusMode = inject("focusMode");
  const drawerOpen = inject("drawerOpen");
</script>

<template>
  <Suspense>
    <div class="outer" :class="{ focus: focusMode, mobile: mobileMode, narrow: drawerOpen }">
      <div class="outer-topbar">
        <DockableSearch v-if="showSearch" />
      </div>

      <div class="inner-wrapper">
        <div v-if="showEditor" class="inner left">
          <Editor v-model="file" />
        </div>

        <div ref="inner-right-ref" class="inner right">
          <div ref="left-column-ref" class="left-column">
            <Dock class="dock left top"> </Dock>
            <Dock class="dock left main"> </Dock>
          </div>
          <div ref="middle-column-ref" class="middle-column">
            <Dock class="dock middle top">
              <ReaderTopbar :show-title="!isMainTitleVisible" />
            </Dock>
            <Dock class="dock middle main">
              <ManuscriptWrapper
                v-if="file.html && (!mobileMode || (mobileMode && !showEditor))"
                ref="manuscript-ref"
                :class="{ 'title-visible': isMainTitleVisible }"
                :html-string="file.html || ''"
                :keys="true"
                :settings="fileSettings"
                :show-footer="true"
              />
            </Dock>
          </div>
          <div ref="right-column-ref" class="right-column">
            <Dock class="dock right top"> </Dock>
            <Dock class="dock right main">
              <DockableAnnotations />
            </Dock>
          </div>
        </div>
      </div>

      <DockableMinimap :file="file" side="right" />

      <!-- <Drawer :class="{ focus: focusMode, mobile: mobileMode }" /> -->
    </div>
  </Suspense>
</template>

<style scoped>
  .outer {
    --outer-padding: 8px;
    --topbar-height: 48px;

    display: flex;
    flex-direction: column;
    gap: 16px;
    z-index: 1;
    box-shadow: var(--shadow-soft);
    background-color: v-bind(fileSettings.background);
    border-radius: 16px;
    width: 100%;
    will-change: width, left, border-radius;
    transition:
      width var(--transition-duration) ease,
      left var(--transition-duration) ease,
      border-radius var(--transition-duration) ease;
  }

  .outer.narrow {
    left: calc(var(--sidebar-width) + 64px);
    width: calc(100% - var(--sidebar-width));
  }

  .outer.focus {
    width: 100%;
    left: 0;
    border-radius: 0;
  }

  .inner-wrapper {
    position: relative;
    display: flex;
    overflow-y: hidden;
    background-color: v-bind(fileSettings.background);
    justify-content: center;
    will-change: border-radius, height, top;
    border-radius: 0 0 16px 16px;
    transition:
      border-radius var(--transition-duration) ease,
      height var(--transition-duration) ease,
      top var(--transition-duration) ease;
  }

  .inner {
    width: 50%;

    &.left {
      flex: 1;
      max-width: 600px;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
      margin-inline: 16px 0;
      padding-bottom: 16px;
    }

    &.right {
      flex: 1;
      overflow-y: auto;
      scrollbar-gutter: stable;
      border-bottom-left-radius: calc(16px - 12px);
      border-bottom-right-radius: calc(16px - 2px);
      padding-inline: 16px 8px;
      padding-bottom: 16px;
      display: flex;
    }
  }

  .outer.mobile > .inner {
    padding: 0;
    padding-left: 8px; /* match the scrollbar gutter */
    border-radius: 0px;
  }

  .outer.mobile > .inner.left {
    width: 100%;
    padding-inline: 0;
  }

  .inner.focus {
    top: 0;
    height: 100%;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .inner.right .middle-column {
    width: 100%;
    height: fit-content;
    scrollbar-gutter: stable;
  }

  .inner.right .dock.top.middle {
    max-width: calc(720px + 48px);
    position: sticky;
    top: 0;
    z-index: 2;
    margin: 0 auto;
    background: v-bind(fileSettings.background) !important;

    will-change: opacity;
    transition: opacity 0.3s ease;
  }

  .inner.right .middle-column .middle.top {
    &:has(+ .middle.main .rsm-manuscript.title-visible) {
      height: 2px;
      opacity: 0;
    }
    &:has(+ .middle.main .rsm-manuscript:not(.title-visible)) {
      height: 48px;
      opacity: 1;
    }
  }

  .inner.right .dock.main {
    max-width: 720px;
    position: relative;
    overflow-x: visible;
    will-change: padding-top;
    margin: 0 auto;
    height: fit-content;
    transition: padding-top var(--transition-duration) ease;

    &.middle {
      min-height: 100%;
      max-width: 720px;
    }
  }

  .outer.mobile .inner.right .dock.main.middle {
    padding-top: 16px;
  }

  .outer.mobile .inner.right .dock.main.middle .rsm-manuscript {
    box-shadow: none;
    border-color: transparent;
    padding-inline: 0;
    padding-block: 16px;
  }

  .rsm-manuscript {
    padding-block: 32px;
    border-radius: 8px;
    border: var(--border-extrathin) solid var(--border-primary);
    border-top: none;
    box-shadow: var(--shadow-soft);
  }

  .drawer.focus {
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
    font-family: v-bind(fileSettings.fontFamily) !important;
    line-height: v-bind(fileSettings.lineHeight) !important;
    padding-inline: v-bind(fileSettings.marginWidth) !important;
  }
</style>
