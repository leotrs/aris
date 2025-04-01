<script setup>
 import { ref, defineEmits } from 'vue';
 import { IconUpload, IconX } from '@tabler/icons-vue';
 import Button from './Button.vue';
 import ButtonClose from './ButtonClose.vue';

 defineEmits(["close"]);

 const fileUpload = ref(null);
 const triggerFileUpload = () => { fileUpload.value?.click() };

 const upload = () => {
     if (fileUpload.value.files.length == 0) return;
     const file = fileUpload.value.files[0];

     const reader = new FileReader();
     reader.onerror = () => { console.log("Error reading the file. Please try again.") };
     reader.onload = () => {
         const url = "http://localhost:8000/documents/";
         console.log(reader.result);
         fetch(url, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                 source: reader.result,
                 owner_id: 1,
                 title: '',
                 abstract: ''
         })})
             .then(response => response.json())
             .then(data => console.log(data))
             .catch(error => console.error('Error:', error));
     };
     reader.readAsText(file);
 }
</script>


<template>
  <div class="md-wrapper">
    <div class="md-header">
      <span class="text-h3">Upload New File</span>
      <ButtonClose @close="$emit('close')" />
    </div>
    <div class="md-content">
      <span class="text-caption">Select a .rsm file from your computer:</span>
      <input type="file" id="file-upload" ref="fileUpload" hidden>
      <label for="file-upload">
        <Button
            id="file-upload-cta"
            kind="secondary"
            text="Choose file"
            icon="Upload"
            class="btn-md"
            @click="triggerFileUpload" />
        <span class="file-upload-echo">No file chosen.</span>
      </label>
    </div>
    <div class="md-footer">
      <Button kind="tertiary" text="cancel" class="btn-md" @click="$emit('close')" />
      <Button kind="primary" text="upload" class="btn-md" @click="upload" />
    </div>
  </div>
</template>


<style scoped>
 .md-wrapper {
     position: absolute;
     left: 50%;
     top: 50%;
     transform: translateX(-50%) translateY(-50%);
     border: 2px solid var(--border-information);
     border-radius: 16px;
     padding: 16px;
     gap: 16px;
     display: flex;
     flex-direction: column;
     min-width: 500px;
     background-color: var(--surface-primary);
 }

 .md-header {
     display: flex;
     justify-content: space-between;
     align-items: center;
     background-color: var(--surface-information);
     padding-inline: 8px;
     padding-block: 4px;
     border-radius: 8px;
 }

 .md-content {
     display: flex;
     flex-direction: column;
     gap: 8px;
 }

 .md-footer {
     display: flex;
     gap: 8px;
     justify-content: flex-end;
 }

 #file-upload-cta {
     width: 100%;
     display: flex;
     justify-content: center;
 }
</style>
