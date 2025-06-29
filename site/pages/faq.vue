<script setup>
  import FAQHero from "~/components/faq/FAQHero.vue";
  import DataOwnershipFAQ from "~/components/faq/DataOwnershipFAQ.vue";
  import PlatformComparisonFAQ from "~/components/faq/PlatformComparisonFAQ.vue";
  import TechnicalFAQ from "~/components/faq/TechnicalFAQ.vue";
  import InstitutionalFAQ from "~/components/faq/InstitutionalFAQ.vue";
  import FAQContact from "~/components/faq/FAQContact.vue";

  // Set page meta
  useHead({
    title: "Frequently Asked Questions - Aris ResOps Platform",
    meta: [
      {
        name: "description",
        content:
          "Common questions about Aris ResOps platform. Data ownership, platform comparisons, technical details, and institutional setup answers.",
      },
      { property: "og:title", content: "Frequently Asked Questions - Aris ResOps Platform" },
      {
        property: "og:description",
        content:
          "Common questions about Aris ResOps platform. Data ownership, platform comparisons, technical details, and institutional setup answers.",
      },
    ],
  });
</script>

<template>
  <div>
    <FAQHero />
    <DataOwnershipFAQ />
    <PlatformComparisonFAQ />
    <TechnicalFAQ />
    <InstitutionalFAQ />
    <FAQContact />
  </div>
</template>

<style scoped></style>
