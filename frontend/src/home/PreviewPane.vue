<script setup>
  import { ref, watch, useTemplateRef } from "vue";
  import { useRouter } from "vue-router";
  import { IconEye, IconBolt, IconClock, IconQuote } from "@tabler/icons-vue";
  import { useElementSize } from "@vueuse/core";
  import useClosable from "@/composables/useClosable.js";
  import PreviewTabPreview from "./PreviewTabPreview.vue";
  import PreviewTabActivity from "./PreviewTabActivity.vue";
  import PreviewTabRevisions from "./PreviewTabRevisions.vue";
  import PreviewTabCitation from "./PreviewTabCitation.vue";

  const props = defineProps({
    doc: { type: Object, required: true },
  });
  const emit = defineEmits(["set-selected"]);
  const router = useRouter();

  const read = () => router.push(`/${props.doc.id}/read`);
  const close = () => emit("set-selected", "");

  useClosable({ onClose: close, closeOnOutsideClick: false });

  const tabInfo = [
    { label: "Preview", icon: IconEye, component: PreviewTabPreview },
    { label: "Activity", icon: IconBolt, component: PreviewTabActivity },
    { label: "History", icon: IconClock, component: PreviewTabRevisions },
    { label: "Citation", icon: IconQuote, component: PreviewTabCitation },
  ];
  const activeIndex = ref(0);
  const tabsHeaderRef = useTemplateRef("tabs-header-ref");
  const { width: tabsHeaderWidth } = useElementSize(tabsHeaderRef);
</script>

<template>
  <div id="preview" class="pane">
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
      <div class="tabs">
        <div ref="tabs-header-ref" class="tabs-header">
          <div
            v-for="(obj, idx) in tabInfo"
            class="tab"
            :class="{ active: idx === activeIndex }"
            @click.stop="activeIndex = idx"
          >
            <component :is="obj.icon" />
            <span class="tab-label text-caption">{{ obj.label }}</span>
          </div>
        </div>
        <div class="tab-content">
          <component :is="tabInfo[activeIndex].component" :doc="doc" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .pane {
    --padding: 16px;
    --border-radius: 8px;

    position: relative;
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

  .pane-content {
    padding-inline: 8px;
  }

  .tabs {
    position: absolute;
    top: var(--padding);
    left: var(--padding);
    width: calc(100% - 3.5 * var(--padding));
  }

  .tabs-header {
    display: flex;
    justify-content: flex-start;
    gap: 4px;
    width: fit-content;
    height: 48px;
    border-radius: 4px;
    color: var(--extra-dark);
    & svg {
      color: var(--extra-dark);
    }
  }

  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-inline: 8px;
    min-width: 48px;
    height: 100%;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-top: var(--border-extrathin) solid transparent;
    border-bottom: var(--border-thin) solid transparent;

    & > .tabler-icon {
      margin-top: 4px;
      margin-bottom: 2px;
    }
  }

  .tab.active {
    background-color: var(--information-100);
    border-top-color: var(--gray-200);
    border-bottom-color: var(--border-action);
    color: var(--almost-black);
    box-shadow: var(--shadow-strong);

    & > svg {
      color: var(--almost-black);
    }
  }

  .tab:not(.active):hover {
    cursor: pointer;
    border-bottom-color: var(--dark);
    color: var(--extra-dark);
    box-shadow: var(--shadow-strong);

    & .tab-label {
      display: block;
    }
    & > svg {
      color: var(--extra-dark);
    }
  }

  .tab-content {
    padding-inline: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    & :deep(.sc-item) {
      padding: 4px !important;
    }
    & :deep(.sc-item:first-child) {
      padding-left: 6px !important;
    }
    & :deep(.sc-item:last-child) {
      padding-right: 6px !important;
    }
  }
</style>
