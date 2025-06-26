<script setup>
  import { inject } from "vue";
  import Note from "@/components/annotations/Note.vue";
  import Comment from "@/components/annotations/Comment.vue";

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
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>
