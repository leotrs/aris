<template>
  <img :src="logoUrl" :alt="alt" :class="logoClass" />
</template>

<script setup>
  import { computed } from "vue";
  import api from "@/composables/useApi.js";

  const props = defineProps({
    type: {
      type: String,
      default: "small",
      validator: (value) => ["small", "full", "gray"].includes(value),
    },
    alt: {
      type: String,
      default: "Aris logo",
    },
    class: {
      type: String,
      default: "",
    },
  });

  const logoClass = computed(() => props.class);

  const logoUrl = computed(() => {
    // Use the configured backend URL from the api instance
    const baseUrl = api.defaults.baseURL;
    
    switch (props.type) {
      case "full":
        return `${baseUrl}/design-assets/logos/logotype.svg`;
      case "gray":
        return `${baseUrl}/design-assets/logos/logo-32px-gray.svg`;
      case "small":
      default:
        return `${baseUrl}/design-assets/logos/logo-32px.svg`;
    }
  });
</script>