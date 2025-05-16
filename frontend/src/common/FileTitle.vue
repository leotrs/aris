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

  const saveTitle = () => {
    if (currentTitle.value == props.file.title) return;
    console.log("do the thing now");
  };

  const editableRef = useTemplateRef("editable-ref");
  defineExpose({
    startEditing: () => editableRef.value?.startEditing(),
    cancelEditing: () => editableRef.value?.cancelEditing(),
  });
</script>

<template>
  <EditableText
    ref="editable-ref"
    v-model="currentTitle"
    :edit-on-click="false"
    @save="saveTitle"
  />
</template>

<style scoped>
  .file-title {
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 1;
  }
</style>
