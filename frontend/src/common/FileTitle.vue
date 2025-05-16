<script setup>
  import { watch, useTemplateRef } from "vue";

  const props = defineProps({
    file: { type: Object, required: true },
  });
  const currentTitle = defineModel({ type: String, default: "" });
  watch(
    () => props.file.title,
    () => (currentTitle.value = props.file.title),
    { immediate: true }
  );

  const editableRef = useTemplateRef("editable-ref");
  defineExpose({
    startEditing: () => editableRef.value?.startEditing(),
    cancelEditing: () => editableRef.value?.cancelEditing(),
  });
</script>

<template>
  <EditableText ref="editable-ref" v-model="currentTitle" :edit-on-click="false" />
</template>

<style scoped>
  .file-title {
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 1;
  }
</style>
