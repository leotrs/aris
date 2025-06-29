<script setup>
  import PricingHero from "~/components/pricing/PricingHero.vue";
  import PricingTiers from "~/components/pricing/PricingTiers.vue";
  import PricingFAQ from "~/components/pricing/PricingFAQ.vue";
  import EarlyStageTransparency from "~/components/pricing/EarlyStageTransparency.vue";

  // Set page meta
  useHead({
    title: "Pricing - Aris Collaborative Preprint Server",
    meta: [
      {
        name: "description",
        content:
          "Simple, transparent pricing for Aris collaborative preprint server. Always free for individual researchers, with institutional and enterprise options.",
      },
      { property: "og:title", content: "Pricing - Aris Collaborative Preprint Server" },
      {
        property: "og:description",
        content:
          "Simple, transparent pricing for Aris collaborative preprint server. Always free for individual researchers, with institutional and enterprise options.",
      },
    ],
  });
</script>

<template>
  <div>
    <PricingHero />
    <PricingTiers />
    <EarlyStageTransparency />
    <PricingFAQ />
  </div>
</template>

<style scoped></style>
