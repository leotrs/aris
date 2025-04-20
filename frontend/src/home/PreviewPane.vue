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
  .pane-header {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 8px;
  }

  .pane-content {
    display: flex;
    gap: 48px;
    padding-inline: 8px;
    overflow-y: auto;
  }

  .actions-left {
    display: flex;
    flex-wrap: wrap;
    row-gap: 16px;
    column-gap: 8px;
  }

  .pane-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .pane-right {
    flex: 2;
    padding-block: 8px;
  }
</style>
