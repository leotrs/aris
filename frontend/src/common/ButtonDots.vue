<script setup>
  import { watch } from "vue";
  import { IconDotsVertical } from "@tabler/icons-vue";

  const props = defineProps({
    hoverColor: { type: String, default: "var(--surface-hint)" },
    activeColor: { type: String, default: "var(--surface-hint)" },
  });
  const active = defineModel({ type: Boolean });
  const emit = defineEmits(["on", "off"]);

  watch(active, (newValue) => (newValue ? emit("on") : emit("off")));
</script>

<template>
  <ButtonToggle v-model="active" :hover-color="hoverColor" :active-color="activeColor">
    <IconDotsVertical width="4" height="18" viewBox="10 3 4 18.25" />
  </ButtonToggle>
</template>

<style scoped>
  .btn-toggle {
    width: 16px !important;
    height: 32px !important;
    padding: 0 !important;
  }

  .btn-toggle svg {
    margin: 0;
  }
</style>
