<script setup>
  import AboutHeroSection from "~/components/about/AboutHeroSection.vue";
  import HumanFirstSection from "~/components/about/HumanFirstSection.vue";
  import ThreeInnovations from "~/components/about/ThreeInnovations.vue";
  import TechnicalSpecs from "~/components/about/TechnicalSpecs.vue";
  import JoinTheCommunity from "~/components/about/JoinTheCommunity.vue";

  // Set page meta
  useHead({
    title: "About Aris - Collaborative Preprint Server",
    meta: [
      {
        name: "description",
        content:
          "Aris is the collaborative preprint server where research lives and evolves. Write together, share as preprints, export to any journal format with one click.",
      },
      { property: "og:title", content: "About Aris - Collaborative Preprint Server" },
      {
        property: "og:description",
        content:
          "Aris is the collaborative preprint server where research lives and evolves. Write together, share as preprints, export to any journal format with one click.",
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
