<script setup>
  import GettingStartedHero from "~/components/getting-started/GettingStartedHero.vue";
  import UserPathsSection from "~/components/getting-started/UserPathsSection.vue";

  // Set page meta
  useHead({
    title: "Getting Started with Aris - Start in 2 Minutes",
    meta: [
      {
        name: "description",
        content:
          "Start writing and sharing research in 2 minutes. Choose your path: individual researcher or institutional setup.",
      },
      {
        property: "og:title",
        content: "Getting Started with Aris - Start in 2 Minutes",
      },
      {
        property: "og:description",
        content:
          "Start writing and sharing research in 2 minutes. Choose your path: individual researcher or institutional setup.",
      },
    ],
  });
</script>

<template>
  <div>
    <GettingStartedHero />
    <UserPathsSection />
  </div>
</template>

<style scoped></style>
