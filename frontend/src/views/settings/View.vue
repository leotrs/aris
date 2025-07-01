<script setup>
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import { IconSettings } from "@tabler/icons-vue";

  const route = useRoute();

  // Debug: Log current route path
  console.log('Current route path:', route.path);

  // Settings sections as context sub-items
  const contextSubItems = computed(() => {
    console.log('Computing contextSubItems, current route:', route.path);
    return [
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
    ];
  });
</script>

<template>
  <BaseLayout :context-sub-items="contextSubItems" :fab="false">
    <RouterView />
  </BaseLayout>
</template>
