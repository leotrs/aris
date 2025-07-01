<script setup>
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import { IconSettings } from "@tabler/icons-vue";

  const route = useRoute();

  // Sidebar navigation items for settings view (with settings sections)
  const settingsSidebarItems = computed(() => [
    {
      icon: "Home",
      text: "Home",
      active: route.path === "/",
      route: "/",
    },
    { separator: true },
    {
      icon: "User",
      text: "Account",
      active: route.path === "/account",
      route: "/account",
    },
    {
      icon: "FileText",
      text: "Document Display",
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
      text: "Privacy & Communication",
      active: route.path === "/settings/privacy",
      route: "/settings/privacy",
    },
    {
      icon: "Lock",
      text: "Account Security",
      active: route.path === "/settings/security",
      route: "/settings/security",
    },
    { separator: true },
    {
      icon: "LayoutSidebarLeftCollapse",
      iconCollapsed: "LayoutSidebarLeftExpand",
      text: "Collapse",
      tooltip: "Expand",
      action: "collapse",
    },
  ]);
</script>

<template>
  <BaseLayout :sidebar-items="settingsSidebarItems" :fab="false">
    <RouterView />
  </BaseLayout>
</template>
