<script setup>
 import { ref, provide, onMounted } from 'vue';
 import Sidebar from './Sidebar.vue';
 import Topbar from './Topbar.vue';
 import DocumentsPane from './DocumentsPane.vue';
 import PreviewPane from './PreviewPane.vue';
 import UploadFileModal from './UploadFileModal.vue';

 const showModal = ref(false);
 const selectedForPreview = ref(null);
 const setSelectedForPreview = (doc) => { selectedForPreview.value = doc };
 const currentMode = ref("list");

 const userID = 1;
 provide('userID', userID);

 const userTags = ref([]);
 const updateUserTags = () => { console.log('NOT IMPLEMENTED') };
 provide('userTags', { userTags, updateUserTags });
 onMounted( async () => {
     const url = `http://localhost:8000/tags/${userID}`;
     try {
         const response = await fetch(url);
         if (!response.ok) {
             throw new Error('Failed to fetch tags');
         }
         userTags.value = await response.json();
     } catch (error) {
         console.error(error);
     }
 });

 const userDocs = ref([]);
 const updateUserDocs = (docID) => { console.log('NOT IMPLEMENTED') };
 provide('userDocs', { userDocs, updateUserDocs })
 onMounted( async () => {
     const url = `http://localhost:8000/users/${userID}/documents`
     try {
         const response = await fetch(url);
         if (!response.ok) {
             throw new Error('Failed to fetch documents');
         }
         userDocs.value = await response.json();
     } catch (error) {
         console.error(error);
     }
 });
</script>


<template>
  <div class="view-wrapper">
    <Sidebar @showFileUploadModal="showModal = true" />
    <div id="panes">
      <div id="documents" class="pane">
        <Topbar
            @list="currentMode = 'list'"
            @cards="currentMode = 'cards'" />
        <DocumentsPane
            @set-selected="setSelectedForPreview"
            :mode="currentMode" />
      </div>
      <PreviewPane
          id="preview"
          v-if="selectedForPreview"
          class="pane"
          :doc="selectedForPreview"
          @set-selected="setSelectedForPreview" />
    </div>
    <div class="modal" v-show="showModal">
      <UploadFileModal @close="showModal = false" />
    </div>
  </div>
</template>


<style scoped>
 .view-wrapper {
     position: relative;
     display: flex;
     flex-grow: 2;
     padding: 16px 16px 16px 0;
 }

 #panes {
     display: flex;
     flex-direction: column;
     flex-grow: 1;
     gap: 8px;
 }

 .pane {
     background-color: var(--almost-white);
     padding: 16px;
     width: 100%;
     display: flex;
     flex-direction: column;
     gap: 16px;
     border-radius: 16px;
     flex-grow: 1;
     overflow-y: auto;
 }

 .modal {
     position: absolute;
     width: 100vw;
     height: 100vh;
     backdrop-filter: blur(2px) brightness(0.9);
 }
</style>
