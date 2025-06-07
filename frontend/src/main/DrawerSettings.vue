<script setup>
  import { inject, useTemplateRef, onMounted } from "vue";
  import { File } from "../File.js";

  const props = defineProps({
    file: { type: Object, default: () => {} },
  });
  const fileSettings = inject("fileSettings");

  const fileSettingsRef = useTemplateRef("file-settings-ref");
  onMounted(() => {
    fileSettingsRef.value.startReceivingUserInput();
  });
</script>

<template>
  <FileSettings ref="file-settings-ref" v-model="fileSettings" />
</template>

<style scoped>
  .settings {
    height: 100%;
  }

  :deep(.pane) {
    height: 100%;
  }
</style>
