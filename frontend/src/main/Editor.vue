<script setup>
  import { ref } from "vue";
  import EditorTopbar from "./EditorTopbar.vue";
  import EditorSource from "./EditorSource.vue";
  import EditorFiles from "./EditorFiles.vue";

  const props = defineProps({});
  const file = defineModel({ type: Object, required: true });

  // Editor topbar state
  const tabIndex = ref(0);
</script>

<template>
  <div class="editor">
    <EditorTopbar v-model="tabIndex" />
    <div class="content">
      <EditorSource v-if="tabIndex == 0" v-model="file" />
      <EditorFiles v-if="tabIndex == 1" v-model="file" />
    </div>
  </div>
</template>

<style scoped>
  .editor {
    --toolbar-height: 40px;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--surface-page);
    z-index: 1;
  }

  .content {
    height: calc(100% - 16px);
    border: var(--border-extrathin) solid var(--border-primary);
    border-radius: 0 8px 8px 8px;
  }
</style>
