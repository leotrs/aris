<script setup>
 import { ref, computed, onMounted, defineProps, defineEmits } from 'vue';
 import { useRouter } from 'vue-router';
 import { onKeyUp } from '@vueuse/core';
 import DocumentsPaneItem from './DocumentsPaneItem.vue';
 import ColumnHeader from './DocumentsPaneColumnHeader.vue';

 const props = defineProps({
     mode: { type: String, default: 'list' }
 })

 const documents = ref([]);
 const activeIndex = ref(null);

 onMounted( async () => {
     const url = "http://localhost:8000/documents"
     try {
         const response = await fetch(url);
         if (!response.ok) {
             throw new Error('Failed to fetch documents');
         }
         documents.value = await response.json();
     } catch (error) {
         console.error(error);
     }
 });

 const emit = defineEmits(["set-selected"]);
 let clickTimeout = ref(null);
 const selectForPreview = (doc, idx) => {
     activeIndex.value = idx;
     clickTimeout.value = setTimeout(() => { emit("set-selected", doc) }, 200);
 };

 const router = useRouter();
 const openRead = (doc) => {
     clearTimeout(clickTimeout.value);
     router.push(`/${doc.id}/read`);
 };

 const columnNames = {
     'Title': 'title',
     'Progress': '',
     'Tags': '',
     'Last Edited': 'last_edited_at',
     'Owner': 'owner_id'
 };
 const disableSorting = {
     'Title': false,
     'Progress': true,
     'Tags': true,
     'Last Edited': false,
     'Owner': true
 }
 const handleColumnHeaderEvent = (columnName, mode) => {
     const col = columnNames[columnName];
     if (mode == 'asc') {
         documents.value.sort((a, b) => a[col].localeCompare(b[col]));
     } else if (mode == 'desc') {
         documents.value.sort((a, b) => b[col].localeCompare(a[col]));
     }
 }

 onKeyUp (['j', 'J', 'ArrowDown'], (e) => {
     e.preventDefault();
     if (activeIndex.value === null) {
         activeIndex.value = 0;
     } else {
         activeIndex.value = (activeIndex.value + 1) % documents.value.length;
     }
 });
 onKeyUp (['k', 'K', 'ArrowUp'], (e) => {
     e.preventDefault();
     if (activeIndex.value === null) {
         activeIndex.value = 0;
     } else {
         activeIndex.value = (activeIndex.value + documents.value.length - 1) % documents.value.length;
     }
 });
 onKeyUp ('Escape', (e) => {
     e.preventDefault();
     activeIndex.value = null;
 });

</script>


<template>
  <div class="documents" :class="mode">

    <template v-if="mode == 'list'">
      <div class="pane-header text-label">
        <ColumnHeader
            v-for="name in Object.keys(columnNames)"
            :name="name"
            @none="handleColumnHeaderEvent(name, 'none')"
            @asc="handleColumnHeaderEvent(name, 'asc')"
            @desc="handleColumnHeaderEvent(name, 'desc')"
            :disable-sorting="disableSorting[name]" />
        <span></span>
        <span></span>
      </div>
    </template>
    <template v-else-if="mode == 'cards'">
      <div class="pane-header text-label">
        <span>Sort by:</span>
      </div>
    </template>

    <div class="docs-group" :class="mode">
      <DocumentsPaneItem
          v-for="(doc, idx) in documents"
          :class="{ active: activeIndex == idx }"
          :doc="doc"
          :mode="mode"
          @click="selectForPreview(doc, idx)"
          @dblclick="openRead(doc)" />
    </div>
  </div>
</template>


<style scoped>
 .documents.list {
     width: 100%;
     display: grid;
     grid-template-columns: 2fr 1.5fr 1fr 100px 50px 16px 8px;
 }

 .documents.list .pane-header {

     display: contents;
     grid-column: 1 / 7;

     & > * {
         color: var(--almost-black);
         background-color: var(--surface-information);
         height: 40px;
         align-content: center;
         margin-bottom: 8px;
     }

     & > *:first-child {
         padding-left: 16px;
         border-top-left-radius: 8px;
         border-bottom-left-radius: 8px;
     }

     & > *:last-child {
         padding-right: 8px;
         border-top-right-radius: 8px;
         border-bottom-right-radius: 8px;
     }

 }

 .docs-group.list {
     display: contents;

     & > .item {
         display: contents;
         grid-column: 1 / 7;
         & > *:first-child { padding-left: 16px }
     }
 }

 .documents.cards {

 }

 .docs-group.cards {
     columns: auto 250px;
     column-gap: 16px;
     & > .cards { break-inside: avoid };
 }

 .documents.cards .pane-header {
     height: 40px;
     padding-inline: 16px;
     align-content: center;
     margin-bottom: 16px;
 }
</style>
