<script setup>
  import { watch } from "vue";
  const props = defineProps({ doc: { type: Object, default: () => {} } });
</script>

<template>
  <TagRow v-model="doc.tags" :doc-id="doc.id" />
</template>

<style scoped></style>
