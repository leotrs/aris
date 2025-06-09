<script setup>
  import { ref, inject, onMounted } from "vue";
  import EditorFilesItem from "./EditorFilesItem.vue";

  const props = defineProps({});
  const file = defineModel({ type: Object, required: true });

  const api = inject("api");
  const assets = ref([]);
  const loading = ref(false);
  const error = ref("");

  const fetchAssets = async () => {
    loading.value = true;
    error.value = "";

    try {
      const response = await api.get(`/files/${file.value.id}/assets`);
      assets.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.detail || err.message || "Unknown error";
      assets.value = [];
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchAssets);
</script>

<template>
  <div class="header">
    <span>File Name</span>
    <span>Uploaded at</span>
  </div>
  <div class="files">
    <EditorFilesItem v-for="(asset, idx) in assets" :key="asset" v-model="assets[idx]" />
  </div>
</template>

<style scoped>
  .header {
    background-color: var(--gray-75);
    height: 32px;
    padding: 8px;
    display: flex;
    gap: 8px;
    justify-content: space-between;
    border-bottom: var(--border-extrathin) solid var(--border-primary);
  }

  .files {
    height: 100%;
  }
</style>
