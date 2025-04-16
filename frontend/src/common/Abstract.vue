<script setup>
  import { ref, watch, onMounted } from "vue";
  import axios from "axios";

  const props = defineProps({ doc: { Type: Object, required: true } });
  const abstract = ref("<div>loading abstract...</div>");

  const truncateText = (text, maxLength = 300) =>
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  const loadAbstract = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/documents/${props.doc.id}/content/abstract?handrails=false`
      );
      abstract.value = truncateText(response.data);
    } catch (error) {
      console.error(error);
      abstract.value = "<div>error when retrieving abstract!</div>";
    }
  };
  onMounted(loadAbstract);
  watch(() => props.doc, loadAbstract);
</script>

<template>
  <ManuscriptWrapper :html="abstract" />
</template>

<style scoped></style>
