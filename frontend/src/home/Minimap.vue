<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  doc: { type: Object, required: true },
});

const html = ref('<div class="minimap loading">loading minimap...</div>');
onMounted(async () => {
  try {
    const url = `http://localhost:8000/documents/${props.doc.id}/sections/minimap`;
    const response = await axios.get(url);
    if (response.status == 200 && !response.data) {
      html.value = '<div class="minimap error">no minimap!</div>';
    } else {
      html.value = response.data;
    }
  } catch (error) {
    console.error(error);
    html.value = '<div class="minimap error">error when retrieving minimap!</div>';
  }
});
</script>

<template>
  <div v-html="html"></div>
</template>

<style scoped>
:deep(.minimap.loading) {
  color: var(--light);
  background-color: var(--information-500);
}

:deep(.minimap.error) {
  background-color: var(--error-500);
}

:deep(.minimap:not(.loading)),
:deep(.minimap:not(.error)) {
  background-color: transparent;
  width: 48px;
  transform: rotate(90deg) scale(0.4);

  svg {
  }
}
</style>
