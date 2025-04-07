<script setup>
 import { ref, inject, onMounted } from 'vue';
 import axios from 'axios';
 import RelativeTime from '@yaireo/relative-Time';
 import MultiSelectTags from './MultiSelectTags.vue';

 const props = defineProps({
     doc: { type: Object, required: true },
     mode: { type: String, default: 'list' }
 })
 const emits = defineEmits(["click", "dblclick"])
 const userID = inject('userID');

 const relativeTime = new RelativeTime({ locale: 'en' });

 const fileTitleActive = ref(false);
 const rename = () => { fileTitleActive.value = true };

 const minimap = ref('<div>loading minimap...</div>');
 onMounted(async () => {
     try {
         const response = await axios.get(`http://localhost:8000/documents/${props.doc.id}/sections/minimap`);
         minimap.value = response.data;
     } catch (error) {
         minimap.value = '<div>no minimap!</div>';
     }
 })
</script>

<template>
  <div
      class="item"
      :class="mode"
      @click="emits('click')"
      @dblclick="emits('dblclick')" >
    <FileTitle :doc="doc" v-model="fileTitleActive" />
    <template v-if="mode == 'cards'">
      <ContextMenu @rename="rename" />
    </template>
    <div v-html="minimap"></div>
    <div class="tags">
      <MultiSelectTags :tags="doc.tags" :docID="doc.id" />
    </div>
    <div class="last-edited">
      {{ relativeTime.from(new Date(doc.last_edited_at)) }}
    </div>
    <div class="grid-wrapper-1">
      <Avatar name="LT" />
    </div>
    <div class="grid-wrapper-2">
      <template v-if="mode == 'list'">
        <ContextMenu @rename="rename">
          <ContextMenuItem icon="Edit" @click="rename" caption="Rename" />
          <ContextMenuItem icon="Copy" caption="Duplicate" />
          <ContextMenuItem icon="Download" caption="Download" />
          <ContextMenuItem icon="TrashX" caption="Delete" class="danger" />
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
     &:hover > * { background-color: var(--surface-hover); }
     & > * {
         transition: background 0.15s ease-in-out;
         border-bottom: var(--border-extrathin) solid var(--border-primary);
         align-content: center;
         height: 48px;
         padding-right: 16px;
     }
     & .grid-wrapper-2 { padding-right: 0px };
     & .dots { padding-right: 0px };
     & > *:last-child { padding-right: 0px };
     &.active > * { background-color: var(--secondary-50) };
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

     & > .dots, & > .file-title, & > .last-edited, & > .grid-wrapper-1, & > .grid-wrapper-2 {
         display: inline-block;
     }

     & > .dots, & > .grid-wrapper-1 {
         float: right;
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

 :deep(.minimap) {
     transform: rotate(90deg) scale(0.4);
     width: 48px;
 }
</style>
