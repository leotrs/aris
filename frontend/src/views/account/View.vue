<script setup>
  import { computed } from "vue";
  import { useRoute } from "vue-router";

  const route = useRoute();

  // Account sections as context sub-items
  const contextSubItems = computed(() => [
    {
      icon: "User",
      text: "Profile",
      active: route?.path === "/account/profile",
      route: "/account/profile",
    },
    {
      icon: "Shield",
      text: "Security",
      active: route?.path === "/account/security",
      route: "/account/security",
    },
    {
      icon: "Notification",
      text: "Notifications",
      active: route?.path === "/account/notifications",
      route: "/account/notifications",
    },
  ]);
</script>

<template>
  <BaseLayout :context-sub-items="contextSubItems" :fab="false">
    <RouterView />
  </BaseLayout>
</template>
