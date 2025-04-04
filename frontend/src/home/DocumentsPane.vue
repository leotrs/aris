<script setup>
 import { ref, computed, inject, onMounted } from 'vue';
 import { useRouter } from 'vue-router';
 import { onKeyUp } from '@vueuse/core';
 import DocumentsPaneItem from './DocumentsPaneItem.vue';
 import ColumnHeader from './DocumentsPaneColumnHeader.vue';

 const props = defineProps({
     mode: { type: String, default: 'list' }
 })
 const userID = inject('userID');
 const { userDocs, updateUserDocs } = inject('userDocs');
 const { userTags, updateUserTags } = inject('userTags');

 const emit = defineEmits(["set-selected"]);
 const activeIndex = ref(null);
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
         userDocs.value.sort((a, b) => a[col].localeCompare(b[col]));
     } else if (mode == 'desc') {
         userDocs.value.sort((a, b) => b[col].localeCompare(a[col]));
     }
 }

 onKeyUp (['j', 'J', 'ArrowDown'], (e) => {
     e.preventDefault();
     if (activeIndex.value === null) {
         activeIndex.value = 0;
     } else {
         activeIndex.value = (activeIndex.value + 1) % userDocs.value.length;
     }
 });
 onKeyUp (['k', 'K', 'ArrowUp'], (e) => {
     e.preventDefault();
     if (activeIndex.value === null) {
         activeIndex.value = 0;
     } else {
         activeIndex.value = (activeIndex.value + userDocs.value.length - 1) % userDocs.value.length;
     }
 });
 onKeyUp ('Escape', (e) => {
     e.preventDefault();
     activeIndex.value = null;
 });
</script>


<template>
  <div class="documents" :class="mode">

    <div class="pane-header text-label">
      <span v-if="mode == 'cards'">Sort by:</span>
      <template v-for="name in Object.keys(columnNames)">
        <ColumnHeader
            v-if="mode == 'list' || (mode == 'cards' && !disableSorting[name])"
            :name="name"
            @none="handleColumnHeaderEvent(name, 'none')"
            @asc="handleColumnHeaderEvent(name, 'asc')"
            @desc="handleColumnHeaderEvent(name, 'desc')"
            :disable-sorting="disableSorting[name]" />
      </template>
      <!-- to complete the grid -->
      <span v-if="mode == 'list'" class="spacer"></span>
      <span v-if="mode == 'list'" class="spacer"></span>
    </div>

    <div v-if="mode == 'cards'" class="tags">
      <Tag v-for="tag_name in userTags" :name="tag_name" />
    </div>

    <div class="docs-group" :class="mode">
      <DocumentsPaneItem
          v-for="(doc, idx) in userDocs"
          :class="{ active: activeIndex == idx }"
          :doc="doc"
          :mode="mode"
          @click="selectForPreview(doc, idx)"
          @dblclick="openRead(doc)" />
    </div>
  </div>
</template>


<style scoped>
 .documents {
     margin-top: 8px;
     overflow-y: auto;
     width: 100%;
 }

 .documents.list {
     display: grid;
     grid-template-columns: 2fr 1.5fr 1fr 100px 50px 16px 8px;
 }

 .documents.list .pane-header {
     background-color: var(--surface-information);
     display: contents;
     grid-column: 1 / 7;

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

 .documents.cards .pane-header {
     display: flex;
     align-items: center;
     gap: 16px;
     padding-inline: 16px;
     margin-bottom: 16px;
     & > .col-header {
         width: fit-content;
         padding-inline: 8px;
     };
 }

 .docs-group.cards {
     columns: auto 250px;
     column-gap: 16px;
     & > .cards { break-inside: avoid };
 }

 .tags {
     display: flex;
     gap: 8px;
 }

 .spacer{
     background-color: var(--surface-information);
 }
</style>
