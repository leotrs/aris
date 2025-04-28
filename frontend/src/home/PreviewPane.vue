<script setup>
  import { ref, computed, useTemplateRef } from "vue";
  import { useRouter } from "vue-router";
  import { IconEye, IconBolt, IconClock, IconQuote } from "@tabler/icons-vue";
  import { useElementSize } from "@vueuse/core";
  import useClosable from "@/composables/useClosable.js";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import PreviewTabPreview from "./PreviewTabPreview.vue";
  import PreviewTabActivity from "./PreviewTabActivity.vue";
  import PreviewTabHistory from "./PreviewTabHistory.vue";
  import PreviewTabCitation from "./PreviewTabCitation.vue";

  const props = defineProps({
    doc: { type: Object, required: true },
  });
  const emit = defineEmits(["set-selected"]);
  const router = useRouter();

  const read = () => props.doc?.id && router.push(`/${props.doc.id}/read`);
  const close = () => emit("set-selected", {});

  useClosable({ onClose: close, closeOnOutsideClick: false });

  const activeTabIndex = ref(0);
  const tabsHeaderRef = useTemplateRef("tabs-header-ref");
  const { width: tabsHeaderWidth } = useElementSize(tabsHeaderRef);

  /* Keyboard shortcuts */
  useKeyboardShortcuts({
    enter: () => read(),
  });

  /* Transition */
  const paneTop = computed(() => (props.doc?.id ? "0" : "8px"));
</script>

<template>
  <div id="preview" class="pane" :style="{ top: paneTop }">
    <Header>
      <div class="left" :style="{ width: `${tabsHeaderWidth}px` }"></div>

      <div class="middle">
        <Button
          kind="primary"
          size="sm"
          text-float="bottom"
          icon="Book"
          text="Read"
          @click="read"
        ></Button>
        <Button kind="tertiary" size="sm" text-float="bottom" text="Write" icon="Pencil" />
        <Button kind="tertiary" size="sm" text-float="bottom" text="Review" icon="FileCheck" />
        <Button kind="tertiary" size="sm" text-float="bottom" text="Share" icon="Share3" />
        <Button kind="tertiary" size="sm" text-float="bottom" text="Collaborate" icon="UserPlus" />
        <!-- <Button kind="tertiary" size="sm" text-float="bottom" text="Download" icon="Download" /> -->
        <!-- <Button kind="tertiary" size="sm" text-float="bottom" text="Export" icon="FileExport" /> -->
      </div>

      <div class="right"><ButtonClose @close="close" /></div>
    </Header>
    <div class="pane-content">
      <Tabs
        ref="tabs-ref"
        v-model="activeTabIndex"
        :labels="['Preview', 'Activity', 'History', 'Citation']"
        :icons="['Eye', 'Bolt', 'Clock', 'Quote']"
      >
        <TabPage><PreviewTabPreview :doc="doc" /></TabPage>
        <TabPage><PreviewTabActivity /></TabPage>
        <TabPage><PreviewTabHistory /></TabPage>
        <TabPage><PreviewTabCitation :doc="doc" /></TabPage>
      </Tabs>
    </div>
  </div>
</template>

<style scoped>
  .pane {
    --padding: 16px;
    --border-radius: 8px;

    position: relative;
    overflow-y: hidden;
    transition: top var(--transition-duration) ease;
  }

  .pane-header {
    padding-block: calc(8px - var(--border-extrathin));

    & .middle {
      display: flex;
      flex-wrap: wrap;
      row-gap: 16px;
      column-gap: 8px;
      /* otherwise the tabs will cover this */
      z-index: 1;
    }

    & .right {
      /* otherwise the tabs will cover this */
      z-index: 1;
    }
  }

  .tabs-wrapper {
    position: absolute;
    top: var(--padding);
    left: var(--padding);
    width: calc(100% - 3.5 * var(--padding));
  }
</style>
