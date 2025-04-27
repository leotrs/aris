<script setup>
  import {} from "vue";
  import * as Icons from "@tabler/icons-vue";

  const props = defineProps({
    label: { type: String, default: "" },
    icon: { type: String, default: "" },
  });
</script>

<template>
  <div class="tab-wrapper">
    <component :is="Icons['Icon' + icon]" class="tab-icon" />
    <span class="tab-label">{{ label }}</span>
  </div>
</template>

<style>
  .tab-wrapper {
    display: flex;
    flex-direction: column;
  }
</style>
