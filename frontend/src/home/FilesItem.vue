<script setup>
  import { ref, inject } from "vue";
  import axios from "axios";
  import RelativeTime from "@yaireo/relative-Time";
  import Separator from "../common/Separator.vue";

  const props = defineProps({
    doc: { type: Object, required: true },
    mode: { type: String, default: "list" },
  });
  const emits = defineEmits(["click", "dblclick"]);

  const relativeTime = new RelativeTime({ locale: "en" });

  const fileTitleActive = ref(false);

  const { reloadDocs } = inject("userDocs");
  const renameDoc = () => (fileTitleActive.value = true);
  const copyDoc = async () => {
    console.log("copy");
    const url = `http://localhost:8000/documents/${props.doc.id}/duplicate`;
    try {
      await axios.post(url);
      reloadDocs();
    } catch (error) {
      console.error(`Could not delete document ${props.doc.id}`);
    }
  };
  const deleteDoc = async () => {
    console.log("delete");
    const url = `http://localhost:8000/documents/${props.doc.id}`;
    try {
      await axios.delete(url);
      reloadDocs();
    } catch (error) {
      console.error(`Could not delete document ${props.doc.id}`);
    }
  };
</script>

<template>
  <div class="item" :class="mode" @click="emits('click')" @dblclick="emits('dblclick')">
    <template v-if="mode == 'cards'">
      <div class="card-header">
        <FileTitle
          v-model="fileTitleActive"
          :doc="doc"
          :class="mode == 'cards' ? 'text-label' : ''"
        />
        <ContextMenu />
      </div>

      <div class="card-content">
        <Suspense>
          <Minimap :doc="doc" orientation="horizontal" />
          <template #fallback><span class="loading">loading...</span></template>
        </Suspense>
        <Abstract :doc="doc" />
      </div>

      <div class="card-footer">
        <div class="card-footer-left">
          <div class="tags"><TagRow v-model="doc.tags" :doc-id="doc.id" /></div>
        </div>
        <div class="card-footer-right">
          <div class="last-edited">{{ relativeTime.from(new Date(doc.last_edited_at)) }}</div>
          <Avatar :name="LT" />
        </div>
      </div>
    </template>

    <template v-if="mode == 'list'">
      <FileTitle
        v-model="fileTitleActive"
        :doc="doc"
        :class="mode == 'cards' ? 'text-label' : ''"
      />

      <Suspense>
        <Minimap :doc="doc" orientation="horizontal" />
        <template #fallback><span class="loading">loading...</span></template>
      </Suspense>

      <div class="tags"><TagRow v-model="doc.tags" :doc-id="doc.id" /></div>

      <!-- necessary because tags tend to overflow -->
      <div class="spacer"></div>

      <div class="last-edited">{{ relativeTime.from(new Date(doc.last_edited_at)) }}</div>

      <!-- <div class="owner"><Avatar /></div> -->
      <!-- <div class="collaborators"><Avatar v-for="..."/></div> -->

      <ContextMenu>
        <ContextMenuItem icon="Eye" caption="Preview" />
        <ContextMenuItem icon="Bolt" caption="Activity" />
        <ContextMenuItem icon="Versions" caption="Revisions" />
        <ContextMenuItem icon="Quote" caption="Citation" />
        <Separator />
        <ContextMenuItem icon="Share3" caption="Share" />
        <ContextMenuItem icon="UserPlus" caption="Collaborate" />
        <Separator />
        <ContextMenuItem icon="Download" caption="Download" />
        <ContextMenuItem icon="FileExport" caption="Export" />
        <Separator />
        <ContextMenuItem icon="Edit" caption="Rename" @click="renameDoc" />
        <ContextMenuItem icon="Copy" caption="Duplicate" @click="copyDoc" />
        <ContextMenuItem icon="TrashX" caption="Delete" class="danger" @click="deleteDoc" />
      </ContextMenu>

      <!-- to complete the grid -->
      <span></span>
    </template>
  </div>
</template>

<style scoped>
  .item {
    --border-width: var(--border-extrathin);

    color: var(--extra-dark);
    overflow-y: visible;
    transition: var(--transition-bg-color);
  }

  .item.list {
    &:hover > * {
      background-color: var(--surface-hover);
    }

    & > * {
      height: calc(56px - 2 * var(--border-width));
      padding-right: 8px;
      transition: background 0.15s ease-in-out;
      border-top: var(--border-width) solid transparent;
      border-bottom: var(--border-width) solid transparent;
      border-bottom-color: var(--border-primary);
      overflow-y: hidden;
    }

    & > .dots {
      padding-inline: 0px;
    }

    &.active > * {
      border-color: var(--border-action);
      background-color: var(--surface-hover);
    }
  }

  .item.cards {
    border-radius: 16px;
    padding-block: 16px;
    margin-bottom: 16px;
    padding: 16px;
    border: var(--border-thin) solid var(--border-primary);
    background-color: var(--surface-primary);
    display: flex;
    flex-direction: column;

    &:hover {
      background-color: var(--surface-hover);
      border-color: var(--gray-400);
    }

    & > .card-header {
      display: flex;
      justify-content: space-between;
    }

    & > .card-content {
      display: flex;
      flex-direction: column;
      margin-bottom: 8px;
      margin-bottom: 16px;
    }

    & > .card-footer {
      display: flex;
      flex-wrap: wrap;
      column-gap: 8px;
      row-gap: 8px;
      justify-content: space-between;
      align-items: center;
    }

    & .card-footer-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    & .file-title {
      font-size: 18px;
      margin-top: 8px;
    }

    & > .dots,
    & > .file-title,
    & > .last-edited,
    & > .owner {
      display: inline-block;
    }

    & > .dots,
    & > .owner {
      float: right;
    }

    & :deep(.manuscriptwrapper) {
      margin-top: 8px !important;
      padding-block: 0px !important;
    }

    & :deep(.manuscriptwrapper .abstract > h3) {
      display: none;
    }

    & > .last-edited {
      height: 32px;
      align-content: center;
    }
  }
</style>
