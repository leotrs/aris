<script setup>
  import { ref, inject } from "vue";
  import axios from "axios";
  import RelativeTime from "@yaireo/relative-Time";
  import Separator from "../common/Separator.vue";
  import TagRow from "./FilesItemTagRow.vue";

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
    <FileTitle v-model="fileTitleActive" :doc="doc" />

    <template v-if="mode == 'cards'">
      <ContextMenu />
    </template>

    <Minimap :doc="doc" orientation="horizontal" />

    <template v-if="mode == 'cards'">
      <Abstract :doc="doc" />
    </template>

    <div class="tags">
      <TagRow v-model="doc.tags" :doc-i-d="doc.id" />
    </div>

    <div class="last-edited">{{ relativeTime.from(new Date(doc.last_edited_at)) }}</div>

    <!-- <div class="owner"><Avatar /></div> -->
    <!-- <div class="collaborators"><Avatar v-for="..."/></div> -->

    <div class="grid-wrapper-2">
      <template v-if="mode == 'list'">
        <ContextMenu>
          <ContextMenuItem icon="Inbox" caption="Notifications" />
          <ContextMenuItem icon="Share3" caption="Share" />
          <ContextMenuItem icon="UserPlus" caption="Invite User" />
          <Separator />
          <ContextMenuItem icon="Clock" caption="History" />
          <ContextMenuItem icon="Download" caption="Download" />
          <ContextMenuItem icon="FileExport" caption="Export" />
          <Separator />
          <ContextMenuItem icon="Edit" caption="Rename" @click="renameDoc" />
          <ContextMenuItem icon="Copy" caption="Duplicate" @click="copyDoc" />
          <ContextMenuItem icon="TrashX" caption="Delete" class="danger" @click="deleteDoc" />
        </ContextMenu>
      </template>
    </div>
    <span></span>
  </div>
</template>

<style scoped>
  .item {
    color: var(--extra-dark);
    overflow-y: visible;
  }

  .item.list {
    &:hover > * {
      background-color: var(--surface-hover);
    }

    & > * {
      transition: background 0.15s ease-in-out;
      border-bottom: var(--border-extrathin) solid var(--border-primary);
      align-content: center;
      height: 48px;
      padding-right: 16px;
    }

    & .grid-wrapper-2 {
      padding-right: 0px;
    }

    & .dots {
      padding-right: 0px;
    }

    & > *:last-child {
      padding-right: 0px;
    }

    &.active > * {
      background-color: var(--secondary-50);
    }
  }

  .item.cards {
    border-radius: 16px;
    margin-bottom: 16px;
    padding: 16px;
    border: var(--border-thin) solid var(--border-primary);
    background-color: var(--surface-primary);

    &:hover {
      background-color: var(--surface-hover);
      border-color: var(--gray-400);
    }

    & > .dots,
    & > .file-title,
    & > .last-edited,
    & > .owner,
    & > .grid-wrapper-2 {
      display: inline-block;
    }

    & > .dots,
    & > .owner {
      float: right;
    }

    & :deep(.manuscriptwrapper) {
      padding-block: 16px !important;
    }

    & :deep(.manuscriptwrapper .abstract > h3) {
      display: none;
    }

    & > .last-edited {
      height: 32px;
      align-content: center;
    }
  }

  .tags {
    position: relative;
    display: flex;
    align-items: center;

    &::-webkit-scrollbar {
      height: 8px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--gray-300);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--surface-hint);
    }
  }

  :deep(.dots > .cm-menu) {
    transform: translateX(-16px) translateY(-8px);
  }
</style>
