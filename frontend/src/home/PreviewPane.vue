<script setup>
  import { ref, reactive } from "vue";
  import { useRouter } from "vue-router";
  import { IconEye, IconBolt, IconVersions, IconQuote } from "@tabler/icons-vue";
  import useClosable from "@/composables/useClosable.js";
  import PreviewPreviewTab from "./PreviewPreviewTab.vue";
  import PreviewActivityTab from "./PreviewActivityTab.vue";
  import PreviewRevisionsTab from "./PreviewRevisionsTab.vue";
  import PreviewCitationTab from "./PreviewCitationTab.vue";

  const props = defineProps({
    doc: { type: Object, required: true },
  });
  const emit = defineEmits(["set-selected"]);
  const router = useRouter();

  const read = () => router.push(`/${props.doc.id}/read`);
  const close = () => emit("set-selected", "");

  useClosable({ onClose: close, closeOnOutsideClick: false });

  const tabInfo = [
    { label: "Preview", icon: IconEye, component: PreviewPreviewTab },
    { label: "Activity", icon: IconBolt, component: PreviewActivityTab },
    { label: "Revisions", icon: IconVersions, component: PreviewRevisionsTab },
    { label: "Citation", icon: IconQuote, component: PreviewCitationTab },
  ];
  const activeIndex = ref(0);
</script>

<template>
  <div id="preview" ref="self-ref" class="pane">
    <div class="pane-header">
      <div class="right">
        <Button kind="primary" class="btn-sm" icon="Book" @click="read"></Button>
        <Button kind="tertiary" class="btn-sm" icon="Pencil"></Button>
        <Button kind="tertiary" class="btn-sm" icon="FileCheck"></Button>
        <Button kind="tertiary" class="btn-sm" icon="Share3"></Button>
        <Button kind="tertiary" class="btn-sm" icon="UserPlus"></Button>
        <Button kind="tertiary" class="btn-sm" icon="Download"></Button>
        <Button kind="tertiary" class="btn-sm" icon="FileExport"></Button>
        <ButtonClose @close="close" />
      </div>
    </div>
    <div class="pane-content">
      <div class="tabs">
        <div class="tabs-header">
          <div
            v-for="(obj, idx) in tabInfo"
            class="tab"
            :class="{ active: idx === activeIndex }"
            @click.stop="activeIndex = idx"
          >
            <component :is="obj.icon" />
            <span class="tab-label text-default">{{ obj.label }}</span>
          </div>
        </div>
        <div class="tab-content">
          <component :is="tabInfo[activeIndex].component" />
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
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    padding: 8px;

    & .right {
      display: flex;
      flex-wrap: wrap;
      row-gap: 16px;
      column-gap: 8px;
    }
  }

  .pane-content {
    padding-inline: 8px;
  }

  .tabs {
    position: absolute;
    top: calc(var(--padding));
    left: calc(2 * var(--padding));
  }

  .tabs-header {
    display: flex;
    justify-content: space-between;
    gap: 4px;
    height: 48px;
    border-radius: 4px;
    color: var(--dark);
    & svg {
      color: var(--dark);
    }
  }

  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-inline: 8px;
    min-width: 48px;
    border-bottom: var(--border-thin) solid transparent;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    & > .tabler-icon {
      margin-top: 4px;
      margin-bottom: 2px;
    }
  }

  .tab-label {
    font-size: 16px;
  }

  .tab.active {
    background-color: var(--information-200);
    border-bottom-color: var(--information-500);
    color: var(--information-700);
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 30%);

    & > svg {
      color: var(--information-700);
    }
  }

  .tab:not(.active):hover {
    cursor: pointer;
    border-bottom-color: var(--extra-dark);
    color: var(--extra-dark);
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
