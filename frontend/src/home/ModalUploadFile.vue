<script setup>
  import { useTemplateRef } from "vue";
  import useClosable from "@/composables/useClosable.js";

  const emit = defineEmits(["close"]);
  const close = () => emit("close");

  useClosable({ onClose: close });

  const fileUpload = useTemplateRef("fileUpload");
  const triggerFileUpload = () => fileUpload.value?.click();

  const upload = () => {
    if (fileUpload.value.files.length == 0) return;
    const file = fileUpload.value.files[0];

    const reader = new FileReader();
    reader.onerror = () => console.log("Error reading the file. Please try again.");
    reader.onload = () => {
      const url = "http://localhost:8000/files/";
      console.log(reader.result);
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: reader.result,
          owner_id: 1,
          title: "",
          abstract: "",
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
    };
    reader.readAsText(file);
  };
</script>

<template>
  <div class="md-wrapper">
    <div class="md-header">
      <span class="text-h5">Upload New File</span>
      <ButtonClose @close="close" />
    </div>
    <div class="md-content">
      <span>Select a .rsm file from your computer:</span>
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
        <span class="file-upload-echo text-caption">No file chosen.</span>
      </label>
    </div>
    <div class="md-footer">
      <Button kind="tertiary" text="cancel" class="btn-md" @click="close" />
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
    border: 2px solid var(--border-primary);
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
    background-color: var(--surface-hover);
    border: var(--border-thin) solid var(--border-primary);
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
    margin-block: 8px;
  }
</style>
