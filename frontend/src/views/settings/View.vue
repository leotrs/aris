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
      active: route?.path === "/settings/document",
      route: "/settings/document",
    },
    {
      icon: "Settings2",
      text: "Behavior",
      active: route?.path === "/settings/behavior",
      route: "/settings/behavior",
    },
    {
      icon: "Notification",
      text: "Notifications",
      active: route?.path === "/settings/notifications",
      route: "/settings/notifications",
    },
  ]);
</script>

<template>
  <BaseLayout :context-sub-items="contextSubItems" :fab="false">
    <RouterView />
  </BaseLayout>
</template>
