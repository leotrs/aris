<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";

const props = defineProps({ doc: { Type: Object, required: true } });
const abstract = ref("<div>loading abstract...</div>");

const loadAbstract = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8000/documents/${props.doc.id}/content/abstract`,
    );
    abstract.value = response.data;
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
