<script setup>
  import { inject, watch } from "vue";

  const props = defineProps({
    file: { type: Object, default: () => {} },
    active: { type: Boolean, required: true },
  });
  const fileSettings = inject("fileSettings");

  const bgColors = {
    white: "var(--surface-page)",
    gray: "var(--gray-75)",
    orange: "var(--orange-50)",
    green: "var(--green-50)",
  };
  const onChangeBackground = (colorName) => {
    fileSettings.background = bgColors[colorName];
  };

  // Buttons: reset and save
  const oldSettings = {};
  watch(
    () => props.active,
    (isActive) => isActive && Object.assign(oldSettings, fileSettings)
  );
  const onReset = () => Object.assign(fileSettings, oldSettings);
  const api = inject("api");
  const onSave = () => {
    File.updateSettings(props.file, fileSettings, api);
  };
</script>

<template>
  <FileSettings v-model="fileSettings" @save="onSave" @reset="onReset" />
</template>

<style scoped>
  .settings {
    height: 100%;
  }

  :deep(.pane) {
    height: 100%;
  }
</style>
