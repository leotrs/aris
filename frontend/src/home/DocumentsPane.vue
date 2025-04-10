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
 const { userDocs, sortDocs } = inject('userDocs');

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

 const columnInfo = {
     'Title': { sortable: true, filterable: false, sortKey: 'title' },
     'Progress': { sortable: false, filterable: false, sortKey: '' },
     'Tags': { sortable: false, filterable: true, sortKey: '' },
     'Last Edited': { sortable: true, filterable: false, sortKey: 'last_edited_at' },
     'Owner': { sortable: false, filterable: false, sortKey: 'owner_id' }
 };
 const handleColumnSortEvent = (columnName, mode) => {
     const sortKey = columnInfo[columnName]['sortKey'];
     if (mode == 'asc') {
         sortDocs((a, b) => a[sortKey].localeCompare(b[sortKey]));
     } else if (mode == 'desc') {
         sortDocs((a, b) => b[sortKey].localeCompare(a[sortKey]));
     }
 };
  const handleColumnFilterEvent = (columnName, tags) => {
      console.log(tags);
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
      <template v-for="name in Object.keys(columnInfo)">
        <ColumnHeader
            v-if="mode == 'list' || (mode == 'cards' && !columnInfo[name]['sortable'])"
            :name="name"
            @sort-none="handleColumnSortEvent(name, 'none')"
            @sort-asc="handleColumnSortEvent(name, 'asc')"
            @sort-desc="handleColumnSortEvent(name, 'desc')"
            @filter-on="handleColumnFilterEvent(name, tags)"
            @filter-off="handleColumnFilterEvent(name, [])"
            :sortable="columnInfo[name]['sortable']"
            :filterable="columnInfo[name]['filterable']" />
      </template>
      <!-- to complete the grid -->
      <span v-if="mode == 'list'" class="spacer spacer-1"></span>
      <span v-if="mode == 'list'" class="spacer spacer-2"></span>
    </div>

    <div class="docs-group" :class="mode">
      <DocumentsPaneItem
          v-for="(doc, idx) in userDocs.filter(doc => !doc.filtered )"
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
     container-type: inline-size;
 }

 .documents.list > :is(.pane-header, .docs-group)  {
     display: grid !important;
     grid-template-columns: minmax(150px, 2fr) minmax(150px, 1.5fr) 1fr 100px 50px 16px 8px;
 }

 .documents.list .pane-header {
     background-color: var(--surface-information);
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
     overflow-y: auto;
     height: calc(100% - 40px);

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
     overflow-y: auto;
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

 /* @container (max-width: 744px) {
    .pane-header, .docs-group  {
    grid-template-columns: minmax(150px, 2fr) minmax(150px, 1.5fr) 1fr 100px 16px 8px !important;
    }
    .pane-header, .item { grid-column: 1 / 6 !important }
    :deep(.owner) { display: none }
    }
    @container (max-width: 684px) {
    .pane-header, .docs-group  {
    grid-template-columns: minmax(150px, 2fr) minmax(150px, 1.5fr) 100px 16px 8px !important;
    }
    .pane-header, .item { grid-column: 1 / 5 !important }
    :deep(.tags) { display: none }
    }
    @container (max-width: 480px) {
    .pane-header, .docs-group  {
    grid-template-columns: minmax(75px, 2fr) 100px 16px 8px !important;
    }
    .pane-header, .item { grid-column: 1 / 4 !important }
    :deep(.progress) { display: none }
    }
    @container (max-width: 432px) {

    } */
</style>
