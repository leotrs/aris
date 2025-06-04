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
  import createElementVisibilityObserver from "@/composables/createElementVisibilityObserver";
  import { registerAsFallback } from "@/composables/useKeyboardShortcuts.js";
  import { useCamelCase } from "@/composables/useCasing.js";
  import ReaderTopbar from "./ReaderTopbar.vue";
  import Dock from "./Dock.vue";
  import Drawer from "./Drawer.vue";
  import Editor from "./Editor.vue";
  import DockableSearch from "./DockableSearch.vue";
  import DockableMinimap from "./DockableMinimap.vue";

  const props = defineProps({
    left: { type: Array, default: () => [] },
    right: { type: Array, default: () => [] },
    top: { type: Array, default: () => [] },
    showEditor: { type: Boolean, default: false },
    showMap: { type: Boolean, default: true },
  });
  const file = defineModel({ type: Object });

  const validDockComponents = {
    /* DockableChat, */
    DockableSearch,
    DockableMinimap,
    /* DockableEditor, */
    /* DockableComments, */
    /* DockableSymbols, */
    /* DockableClaims, */
  };

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

  const fileSettings = reactive({});
  watchEffect((onCleanup) => {
    if (!file.value || !file.value.id) return;
    let cancelled = false;

    const fetchSettings = async () => {
      try {
        const response = await api.get(`/settings/${file.value.id}`);
        if (!cancelled) {
          const camelCaseSettings = useCamelCase(response.data);
          Object.assign(fileSettings, camelCaseSettings);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching file settings:", error);
        }
      }
    };

    fetchSettings();
    onCleanup(() => (cancelled = true));
  });
  provide("fileSettings", fileSettings);

  // Is main title visible?
  const isMainTitleVisible = ref(true);
  let tearDown = () => {};
  watch(
    () => file.value,
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

  // Keyboard shortcuts
  registerAsFallback(manuscriptRef);

  // Focus mode
  const focusMode = inject("focusMode");

  // Responsiveness
  const mobileMode = inject("mobileMode");
</script>

<template>
  <Suspense>
    <div class="outer" :class="{ focus: focusMode, mobile: mobileMode }">
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
            <ReaderTopbar
              :show-title="!isMainTitleVisible"
              :component="validDockComponents[top.at(-1)]"
            />
          </Dock>
          <Dock class="dock middle main">
            <ManuscriptWrapper
              v-if="file.html"
              ref="manuscript-ref"
              :class="{ 'title-visible': isMainTitleVisible }"
              :html-string="file.html || ''"
              :keys="true"
              :show-footer="true"
            />
          </Dock>
        </div>
        <div ref="right-column-ref" class="right-column">
          <Dock class="dock right top"> </Dock>
          <Dock class="dock right main"> </Dock>
        </div>
      </div>

      <DockableMinimap :file="file" side="right" />

      <Drawer :class="{ focus: focusMode, mobile: mobileMode }" />
    </div>
  </Suspense>
</template>

<style scoped>
  .outer {
    --outer-padding: 8px;
    --sidebar-width: 64px;
    --topbar-height: 48px;

    display: flex;
    z-index: 1;
    box-shadow: var(--shadow-soft);
    background-color: v-bind("fileSettings.background");
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
    width: 50%;
    padding: 0 16px 16px 16px;
    margin-top: 16px;
    background-color: v-bind("fileSettings.background");
    justify-content: center;
    will-change: border-radius, height, top;
    transition:
      border-radius var(--transition-duration) ease,
      height var(--transition-duration) ease,
      top var(--transition-duration) ease;

    &.left {
      flex-direction: column;
      flex: 1;
      max-width: 600px;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
    }

    &.right {
      flex: 1;
      overflow-y: auto;
      scrollbar-gutter: stable;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
      padding-right: 8px; /* due to the scrollbar gutter */
    }
  }

  .outer.mobile > .inner {
    padding: 0;
    padding-left: 8px; /* match the scrollbart gutter */
    border-radius: 0px;
  }

  .inner.focus {
    top: 0;
    height: 100%;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .inner.right .middle-column {
    width: 100%;
    max-width: 720px;
    height: fit-content;
    min-height: 100%;
  }

  .inner.right .dock.top.middle {
    position: sticky;
    top: -16px;
    z-index: 2;
  }

  .inner.right .dock.main {
    position: relative;
    overflow-x: visible;
    will-change: padding-top;
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
    font-family: v-bind(` "${fileSettings.fontFamily}" `) !important;
    line-height: v-bind(fileSettings.lineHeight) !important;
    padding-inline: v-bind(fileSettings.marginWidth) !important;
  }
</style>
