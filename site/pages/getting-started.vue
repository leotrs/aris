<script setup>
  import GettingStartedHero from "~/components/getting-started/GettingStartedHero.vue";
  import UserPathsSection from "~/components/getting-started/UserPathsSection.vue";
  import QuickStartGuide from "~/components/getting-started/QuickStartGuide.vue";
  import DemoSection from "~/components/getting-started/DemoSection.vue";
  import NextSteps from "~/components/getting-started/NextSteps.vue";

  // Set page meta
  useHead({
    title: "Getting Started with Aris - ResOps Platform Setup Guide",
    meta: [
      {
        name: "description",
        content:
          "Get started with Aris ResOps platform in minutes. Choose your path: individual researcher or institutional setup. Quick guides, demos, and support.",
      },
      { property: "og:title", content: "Getting Started with Aris - ResOps Platform Setup Guide" },
      {
        property: "og:description",
        content:
          "Get started with Aris ResOps platform in minutes. Choose your path: individual researcher or institutional setup. Quick guides, demos, and support.",
      },
    ],
  });
</script>

<template>
  <div>
    <GettingStartedHero />
    <UserPathsSection />
    <QuickStartGuide />
    <DemoSection />
    <NextSteps />
  </div>
</template>

<style scoped></style>
