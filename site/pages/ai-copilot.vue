<script setup>
  import AICopilotHero from "~/components/ai-copilot/AICopilotHero.vue";
  import AICapabilities from "~/components/ai-copilot/AICapabilities.vue";
  import AIPrivacyEthics from "~/components/ai-copilot/AIPrivacyEthics.vue";
  import AIFAQ from "~/components/ai-copilot/AIFAQ.vue";

  // Set page meta
  useHead({
    title: "AI Copilot - Aris Collaborative Preprint Server",
    meta: [
      {
        name: "description",
        content:
          "AI-powered research assistance for academic writing. Smart suggestions, citation help, and writing support while maintaining complete author control and privacy.",
      },
      { property: "og:title", content: "AI Copilot - Aris Collaborative Preprint Server" },
      {
        property: "og:description",
        content:
          "AI-powered research assistance for academic writing. Smart suggestions, citation help, and writing support while maintaining complete author control and privacy.",
      },
    ],
  });
</script>

<template>
  <div>
    <AICopilotHero />
    <AICapabilities />
    <AIPrivacyEthics />
    <AIFAQ />
  </div>
</template>

<style scoped></style>