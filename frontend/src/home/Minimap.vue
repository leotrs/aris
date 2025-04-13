<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  doc: { type: Object, required: true },
});

const html = ref("<div>loading minimap...</div>");
const additionalClasses = ref(["loading"]);
onMounted(async () => {
  try {
    const url = `http://localhost:8000/documents/${props.doc.id}/sections/minimap`;
    const response = await axios.get(url);
    if (response.status == 200 && !response.data) {
      html.value = "<div>no minimap!</div>";
      additionalClasses.value = [];
    } else {
      html.value = response.data;
    }
  } catch (error) {
    console.error(error);
    html.value = '<div class="error">error when retrieving minimap!</div>';
    additionalClasses.value.push("error");
  }
});
</script>

<template>
  <div class="minimap" :class="additionalClasses" v-html="html"></div>
</template>

<style scoped>
.minimap.loading {
  background-color: var(--information-500);
}

.minimap.error {
  background-color: var(--error-500);
}

.minimap:not(.loading),
.minimap:not(.error) {
  background-color: transparent;
  width: 48px;
  transform: rotate(90deg) scale(0.4);

  svg {
  }
}
</style>
