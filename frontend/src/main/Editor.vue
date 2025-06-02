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
  <EditorSource v-if="tabIndex == 0" v-model="file" />
  <EditorFiles v-if="tabIndex == 1" v-model="file" />
</template>

<style scoped>
  .outer {
    --outer-padding: 8px;
    --sidebar-width: 64px;
    --topbar-height: 48px;

    display: flex;
    z-index: 1;
    box-shadow: var(--shadow-soft);

    border-radius: 16px;
    will-change: width, left, border-radius;
    transition:
      width var(--transition-duration) ease,
      left var(--transition-duration) ease,
      border-radius var(--transition-duration) ease;
  }
</style>
