<script setup>
  import {} from "vue";
  import EditorSource from "./EditorSource.vue";
  import EditorFiles from "./EditorFiles.vue";

  const props = defineProps({
    tabIndex: { type: Number, default: 0 },
  });
  const file = defineModel({ type: Object, required: true });
</script>

<template>
  <div class="wrapper">
    <EditorSource v-if="tabIndex == 0" v-model="file" />
    <EditorFiles v-if="tabIndex == 1" v-model="file" />
  </div>
</template>

<style scoped>
  .wrapper {
    --toolbar-height: 40px;
    display: flex;
    flex-direction: column;
    height: calc(100% - 16px);
    border: var(--border-extrathin) solid var(--border-primary);
    border-radius: 0 8px 8px 8px;
    background-color: var(--surface-page);
    z-index: 1;
  }
</style>
