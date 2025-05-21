<script setup>
  import { useTemplateRef } from "vue";

  const props = defineProps({ file: { type: Object, required: true } });

  const timestampRef = useTemplateRef("timestamp-ref");
</script>

<template>
  <div class="last-edited">
    <span ref="timestamp-ref" class="timestamp">
      {{ file.getFormattedDate() }}
    </span>
    <Tooltip :anchor="timestampRef">
      <span>{{ file.getFullDateTime() }}</span>
    </Tooltip>
  </div>
</template>

<style scoped>
  .last-edited {
  }
</style>
