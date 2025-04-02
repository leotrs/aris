<script setup>
 import { ref, computed, onMounted, defineProps, defineEmits } from 'vue';
 import { useRouter } from 'vue-router';
 import DocumentsPaneItem from './DocumentsPaneItem.vue';

 const documents = ref([]);
 const active = ref([]);

 onMounted( async () => {
     const url = "http://localhost:8000/documents"
     try {
         const response = await fetch(url);
         if (!response.ok) {
             throw new Error('Failed to fetch documents');
         }
         documents.value = await response.json();
         active.value = Array(documents.value.length).fill(false);
     } catch (error) {
         console.error(error);
     }
 });

 const emit = defineEmits(["set-selected"]);
 let clickTimeout = ref(null);
 const selectForPreview = (doc, idx) => {
     active.value.fill(false);
     active.value[idx] = true;
     clickTimeout.value = setTimeout(() => { emit("set-selected", doc) }, 200);
 };

 const router = useRouter();
 const openRead = (doc) => {
     clearTimeout(clickTimeout.value);
     router.push(`/${doc.id}/read`);
 };

 const props = defineProps({
     mode: { type: String, default: 'list' }
 })

</script>


<template>
  <div class="documents" :class="mode">

    <template v-if="mode == 'list'">
      <div class="pane-header text-label">
        <span>Title</span>
        <span>Progress</span>
        <span>Tags</span>
        <span>Last edited</span>
        <span>Owner</span>
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
          :class="{ active: active ? active[idx] : false }"
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
     color: var(--almost-black);
     display: contents;
     grid-column: 1 / 7;

     & > * {
         color: var(--almost-black);
         background-color: var(--surface-information);
         height: 40px;
         align-content: center;
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

 .item.list.active > * {
     background-color: var(--surface-page);
     border-top: var(--border-med) solid var(--border-action);
     border-bottom: var(--border-med) solid var(--border-action);
 }

 .item.list.active > *:first-child {
     border-top-left-radius: 8px;
     border-bottom-left-radius: 8px;
     border-left: var(--border-med) solid var(--border-action);
 }

 .item.list.active > *:last-child {
     border-top-right-radius: 8px;
     border-bottom-right-radius: 8px;
     border-right: var(--border-med) solid var(--border-action);
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
