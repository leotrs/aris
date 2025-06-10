<script setup>
  import {} from "vue";
  import Editor from "./Editor.vue";

  const props = defineProps({});
  const file = defineModel({ type: Object, required: true });
</script>

<template>
  <Editor v-model="file" />
</template>

<style scoped></style>
