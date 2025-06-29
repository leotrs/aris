<script setup>
  import OpenScienceHero from "~/components/open-science/OpenScienceHero.vue";
  import CommitmentToOpenScience from "~/components/open-science/CommitmentToOpenScience.vue";
  import EthicsInPublishing from "~/components/open-science/EthicsInPublishing.vue";
  import TechnicalTransparency from "~/components/open-science/TechnicalTransparency.vue";
  import GovernanceStructure from "~/components/open-science/GovernanceStructure.vue";
  import JoinTheMovement from "~/components/open-science/JoinTheMovement.vue";

  // Set page meta
  useHead({
    title: "Open Science & Ethics - Aris ResOps Platform",
    meta: [
      {
        name: "description",
        content:
          "100% open source research publishing infrastructure. Transparent governance, ethical practices, and community-driven development for the academic community.",
      },
      { property: "og:title", content: "Open Science & Ethics - Aris ResOps Platform" },
      {
        property: "og:description",
        content:
          "100% open source research publishing infrastructure. Transparent governance, ethical practices, and community-driven development for the academic community.",
      },
    ],
  });
</script>

<template>
  <div>
    <OpenScienceHero />
    <CommitmentToOpenScience />
    <EthicsInPublishing />
    <TechnicalTransparency />
    <GovernanceStructure />
    <JoinTheMovement />
  </div>
</template>

<style scoped></style>
