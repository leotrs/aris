<script setup>
  import { watch } from "vue";
  const props = defineProps({ doc: { type: Object, default: () => {} } });
</script>

<template>
  <div class="wrapper">
    <span class="text-label">Tags</span>
    <div class="tag-row">
      <TagRow v-model="doc.tags" :doc-id="doc.id" />
    </div>
  </div>
</template>

<style scoped>
  .wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .tag-row {
    display: flex;
    align-items: center;
  }
</style>
