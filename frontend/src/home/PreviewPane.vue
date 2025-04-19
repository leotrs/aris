<script setup>
  import useClosable from "@/composables/useClosable.js";
  import { useRouter } from "vue-router";

  const props = defineProps({
    doc: { type: Object, required: true },
  });
  const emit = defineEmits(["set-selected"]);
  const router = useRouter();

  const read = () => router.push(`/${props.doc.id}/read`);
  const close = () => emit("set-selected", "");

  useClosable({ onClose: close, closeOnOutsideClick: false });
</script>

<template>
  <div id="preview" ref="self-ref" class="pane">
    <div class="pane-header">
      <div class="actions-left">
        <Button kind="primary" class="btn-sm" text="Read" icon="Book" @click="read"></Button>
        <Button kind="tertiary" class="btn-sm" text="Review" icon="FileCheck"></Button>
        <Button kind="tertiary" class="btn-sm" text="Revisions" icon="Versions"></Button>
      </div>
      <div class="actions-right">
        <ButtonClose @close="close" />
      </div>
    </div>
    <div class="pane-content">
      <div class="pane-left">
        <div class="text-h4">{{ doc.title }}</div>
        <div>
          <Avatar name="LT" /><span>{{ doc.last_edited_at }}</span>
        </div>
      </div>
      <div class="pane-right">
        <Abstract :doc="doc" />
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
