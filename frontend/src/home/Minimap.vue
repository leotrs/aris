<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  doc: { type: Object, required: true },
});

const swapViewBox = (html) => {
  const regex = /viewbox="(\b0\b)\s+(\b0\b)\s+(\d+)\s+(\d+)"/g;
  return html.replace(regex, (_, x, y, w, h) => `viewbox="${y} ${x} ${h} ${w}"`);
};

const html = ref('<div class="minimap loading">loading minimap...</div>');
onMounted(async () => {
  try {
    const url = `http://localhost:8000/documents/${props.doc.id}/sections/minimap`;
    const response = await axios.get(url);
    if (response.status == 200 && !response.data) {
      html.value = '<div class="minimap error">no minimap!</div>';
    } else {
      html.value = swapViewBox(response.data);
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

<style>
.minimap {
  --scale-factor: 0.7;
  --base-pos: 20;
}

.minimap.loading {
  color: var(--light);
  background-color: var(--information-500);
}

.minimap.error {
  background-color: var(--error-500);
}

.minimap:not(.loading),
.minimap:not(.error) {
  background-color: transparent;
  width: 100%;

  & svg {
    overflow: visible;
    height: 48px;

    & g {
      transform: rotate(270deg);
      transform-origin: 16px 20px;

      & rect {
        transform: scaleY(var(--scale-factor));
      }

      & a circle {
        /* transform: scale(calc(1 / 0.7)); */
        /* transform: translateY(
                  calc((attr(data-pos number) - var(--base-pos-) * (var(--scale-factor) - 1)))
                ); */
      }
    }
  }
}
</style>
