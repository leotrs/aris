<script setup>
  import { ref, inject, watch, computed } from "vue";
  import { useSnakeCase } from "@/composables/useCasing.js";

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
    const snakeCaseSettings = useSnakeCase(fileSettings);
    api.post(`/settings/${props.file.id}`, snakeCaseSettings);
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
