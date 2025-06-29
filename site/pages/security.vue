<script setup>
  import SecurityHero from "~/components/security/SecurityHero.vue";
  import SecurityPlanning from "~/components/security/SecurityPlanning.vue";

  // Set page meta
  useHead({
    title: "Security & Privacy - Aris Collaborative Preprint Server",
    meta: [
      {
        name: "description",
        content:
          "Transparent security planning for Aris. Our commitment to building security from day one, with open source transparency and community accountability.",
      },
      { property: "og:title", content: "Security & Privacy - Aris Collaborative Preprint Server" },
      {
        property: "og:description",
        content:
          "Transparent security planning for Aris. Our commitment to building security from day one, with open source transparency and community accountability.",
      },
    ],
  });
</script>

<template>
  <div>
    <SecurityHero />
    <SecurityPlanning />
  </div>
</template>

<style scoped></style>
