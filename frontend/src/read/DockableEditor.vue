<script setup>
  import {} from "vue";
  import RSMEditor from "./RSMEditor.vue";

  const props = defineProps({});
  const file = defineModel({ type: Object, required: true });
</script>

<template>
  <RSMEditor v-model="file" />
</template>

<style scoped></style>
