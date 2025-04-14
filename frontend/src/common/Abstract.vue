<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const { doc } = defineProps({ doc: { Type: Object, required: true } });
const abstract = ref("<div>loading abstract...</div>");

onMounted(async () => {
  try {
    const response = await axios.get(
      `http://localhost:8000/documents/${doc.id}/sections/abstract`,
    );
    abstract.value = response.data;
  } catch (error) {
    console.error(error);
    abstract.value = "<div>error when retrieving abstract!</div>";
  }
});
</script>

<template>
  <ManuscriptWrapper :html="abstract" />
</template>

<style scoped></style>
