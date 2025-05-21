<script setup>
  import { useTemplateRef } from "vue";
  import { useFloating } from "@floating-ui/vue";

  const props = defineProps({ file: { type: Object, required: true } });

  const timestampRef = useTemplateRef("timestamp-ref");
  const tooltipRef = useTemplateRef("tooltip-ref");
  const { floatingStyles } = useFloating(timestampRef, tooltipRef);
</script>

<template>
  <div class="last-edited">
    <span ref="timestamp-ref" class="timestamp">
      {{ file.getFormattedDate() }}
    </span>
    <span ref="tooltip-ref" class="tooltip" :style="floatingStyles">
      {{ file.getFullDateTime() }}
    </span>
  </div>
</template>

<style scoped>
  .last-edited {
  }

  .tooltip {
    position: absolute;
    visibility: hidden;
  }

  .last-edited:hover > .tooltip {
    visibility: visible;
  }
</style>
