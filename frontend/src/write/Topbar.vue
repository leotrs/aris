<script setup>
  import {} from "vue";
  const props = defineProps({});
  const emit = defineEmits(["compile"]);
</script>

<template>
  <div class="topbar">
    <Button kind="primary" text="compile" @click="emit('compile')" />
  </div>
</template>

<style scoped>
  .topbar {
    background-color: var(--surface-page);
    height: 64px;
    position: fixed;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    width: calc(100% - var(--sidebar-width) - var(--outer-padding));
    display: flex;
    padding: 16px;
  }
</style>
