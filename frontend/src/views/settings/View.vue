<script setup>
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import { IconSettings } from "@tabler/icons-vue";

  const route = useRoute();

  // Settings sections as context sub-items
  const contextSubItems = computed(() => [
    {
      icon: "FileText",
      text: "File",
      active: route.path === "/settings/document",
      route: "/settings/document",
    },
    {
      icon: "Settings2",
      text: "Behavior",
      active: route.path === "/settings/behavior",
      route: "/settings/behavior",
    },
    {
      icon: "Shield",
      text: "Privacy",
      active: route.path === "/settings/privacy",
      route: "/settings/privacy",
    },
    {
      icon: "Lock",
      text: "Security",
      active: route.path === "/settings/security",
      route: "/settings/security",
    },
  ]);
</script>

<template>
  <BaseLayout :context-sub-items="contextSubItems" :fab="false">
    <RouterView />
  </BaseLayout>
</template>
