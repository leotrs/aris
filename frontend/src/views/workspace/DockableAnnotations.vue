<script setup>
  import { inject } from "vue";

  const annotations = inject("annotations");
</script>

<template>
  <div class="annotations">
    <div v-for="ann in annotations" :key="ann.id">
      <Note v-if="ann.type === 'note'" :annotation="ann" />
      <Comment v-else-if="ann.type === 'comment'" :annotation="ann" />
    </div>
  </div>
</template>

<style scoped>
  .annotations {
  }
</style>
