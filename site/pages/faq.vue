<script setup>
  import FAQHero from "~/components/faq/FAQHero.vue";
  import DataOwnershipFAQ from "~/components/faq/DataOwnershipFAQ.vue";
  import PlatformComparisonFAQ from "~/components/faq/PlatformComparisonFAQ.vue";
  import JournalCompatibilityFAQ from "~/components/faq/JournalCompatibilityFAQ.vue";
  import TechnicalFAQ from "~/components/faq/TechnicalFAQ.vue";
  import InstitutionalFAQ from "~/components/faq/InstitutionalFAQ.vue";
  import FAQContact from "~/components/faq/FAQContact.vue";

  // Set page meta
  useHead({
    title: "Frequently Asked Questions - Aris Collaborative Preprint Server",
    meta: [
      {
        name: "description",
        content:
          "Common questions about Aris collaborative preprint server. Data ownership, journal compatibility, platform comparisons, and technical details.",
      },
      {
        property: "og:title",
        content: "Frequently Asked Questions - Aris Collaborative Preprint Server",
      },
      {
        property: "og:description",
        content:
          "Common questions about Aris collaborative preprint server. Data ownership, journal compatibility, platform comparisons, and technical details.",
      },
    ],
  });
</script>

<template>
  <div>
    <FAQHero />
    <DataOwnershipFAQ />
    <PlatformComparisonFAQ />
    <JournalCompatibilityFAQ />
    <TechnicalFAQ />
    <InstitutionalFAQ />
    <FAQContact />
  </div>
</template>

<style scoped></style>
