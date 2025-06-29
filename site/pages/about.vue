<script setup>
  import AboutHeroSection from "~/components/about/AboutHeroSection.vue";
  import HumanFirstSection from "~/components/about/HumanFirstSection.vue";
  import ThreeInnovations from "~/components/about/ThreeInnovations.vue";
  import TechnicalSpecs from "~/components/about/TechnicalSpecs.vue";
  import JoinTheCommunity from "~/components/about/JoinTheCommunity.vue";

  // Set page meta
  useHead({
    title: "About Aris - ResOps Platform for Academic Publishing",
    meta: [
      {
        name: "description",
        content:
          "Aris is the only ResOps platform integrating manuscript writing, peer review, and publishing. Write in RSM or LaTeX, get faster publication cycles with transparent peer review.",
      },
      { property: "og:title", content: "About Aris - ResOps Platform for Academic Publishing" },
      {
        property: "og:description",
        content:
          "Aris is the only ResOps platform integrating manuscript writing, peer review, and publishing. Write in RSM or LaTeX, get faster publication cycles with transparent peer review.",
      },
    ],
  });
</script>

<template>
  <div>
    <AboutHeroSection />
    <ThreeInnovations />
    <HumanFirstSection />
    <TechnicalSpecs />
    <JoinTheCommunity />
  </div>
</template>

<style scoped></style>
