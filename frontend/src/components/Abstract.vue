<script setup>
  import { ref, watch, inject, onMounted } from "vue";
  import axios from "axios";

  const props = defineProps({ file: { type: Object, required: true } });
  const abstract = ref("<div>loading abstract...</div>");

  const truncateText = (text, maxLength = 300) =>
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  const api = inject("api");
  const loadAbstract = async () => {
    if (!props.file?.id) return;
    try {
      const response = await api.get(`/files/${props.file.id}/content/abstract?handrails=false`);
      abstract.value = truncateText(response.data);
    } catch (error) {
      console.error(error);
      abstract.value = "<div>error when retrieving abstract!</div>";
    }
  };
  onMounted(loadAbstract);
  watch(() => props.file, loadAbstract);
</script>

<template>
  <ManuscriptWrapper :html-string="abstract" :keys="false" />
</template>

<style scoped></style>
