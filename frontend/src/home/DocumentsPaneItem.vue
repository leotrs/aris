<script setup>
 import { ref, inject } from 'vue';
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

 const editTagsActive = ref(false);
 const editTags = () => { editTagsActive.value = true };

 const { _, reloadDoc } = inject('userDocs');
 const tagOn = async (tagID) => {
     const url = `http://localhost:8000/users/${userID}/documents/${props.doc.id}/tags/${tagID}`
     try {
         const response = await fetch(url, { method: 'post' });
         if (!response.ok) {
             throw new Error('Failed to add tag');
         }
         reloadDoc(props.doc.id);
     } catch (error) {
         console.error(error);
     }
 };
 const tagOff = async (tagID) => {
     const url = `http://localhost:8000/users/${userID}/documents/${props.doc.id}/tags/${tagID}`
     try {
         const response = await fetch(url, { method: 'delete' });
         if (!response.ok) {
             throw new Error('Failed to remove tags');
         }
         reloadDoc(props.doc.id);
     } catch (error) {
         console.error(error);
     }
 };
</script>

<template>
  <div
      class="item"
      :class="mode"
      @click="emits('click')"
      @dblclick="emits('dblclick')" >
    <FileTitle :doc="doc" v-model="fileTitleActive" />
    <template v-if="mode == 'cards'">
      <ContextMenu @rename="rename" @edit-tags="editTags" />
    </template>
    <div class="minimap">minimap</div>
    <div class="tags">
      <MultiSelectTags
          :tags="doc.tags"
          v-model="editTagsActive"
          @on="tagOn"
          @off="tagOff" />
    </div>
    <div class="last-edited">{{ relativeTime.from(new Date(doc.last_edited_at)) }}</div>
    <div class="grid-wrapper-1"><Avatar name="LT" /></div>
    <div class="grid-wrapper-2"><template v-if="mode == 'list'"><ContextMenu @rename="rename" @edit-tags="editTags" /></template></div>
    <span></span>
  </div>
</template>


<style scoped>
 .item {
     color: var(--extra-dark);
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
     &:first-child > * { border-top: var(--border-extrathin) solid var(--border-primary) };
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
     overflow-x: auto;
     overflow-y: clip;

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
</style>
