<script setup>
  import { inject, useTemplateRef } from "vue";
  import useClosable from "@/composables/useClosable.js";

  const emit = defineEmits(["close"]);
  const close = () => emit("close");

  useClosable({ onClose: close });

  const fileUpload = useTemplateRef("fileUpload");
  const triggerFileUpload = () => fileUpload.value?.click();

  const api = inject("api");
  const upload = () => {
    if (fileUpload.value.files.length === 0) return;
    const file = fileUpload.value.files[0];

    const reader = new FileReader();
    reader.onerror = () => console.error("Error reading the file. Please try again.");
    reader.onload = () => {
      api
        .post("/files/", {
          source: reader.result,
          owner_id: 1,
          title: "",
          abstract: "",
        })
        .then((response) => {
          console.log("Upload response:", response.data);
        })
        .catch((error) => {
          console.error("Upload error:", error);
        });
    };
    reader.readAsText(file);
  };
</script>

<template>
  <Modal>
    <template #header>
      <span class="text-h5">Upload New File</span>
      <ButtonClose />
    </template>
    <span>Select a .rsm file from your computer</span>
    <input id="file-upload" ref="fileUpload" type="file" hidden />
    <label for="file-upload">
      <Button
        id="file-upload-cta"
        kind="secondary"
        text="Choose file"
        icon="Upload"
        class="btn-md"
        @click="triggerFileUpload"
      />
      <!-- <span class="file-upload-echo text-caption">No file chosen.</span> -->
    </label>
    <div class="cta">
      <Button kind="tertiary" text="cancel" class="btn-md" @click="close" />
      <Button kind="primary" text="upload" class="btn-md" @click="upload" />
    </div>
  </Modal>
</template>

<style scoped>
  #file-upload-cta {
    margin: 0 auto;
    width: 50%;
    display: flex;
    justify-content: center;
    margin-block: 8px;
  }

  .cta {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
</style>
