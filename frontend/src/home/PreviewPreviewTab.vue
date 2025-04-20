<script setup>
  const props = defineProps({
    doc: { type: Object, required: true },
  });
</script>

<template>
  <Abstract :doc="doc" />
</template>

<style scoped></style>
