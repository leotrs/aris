<script setup>
  import ContactHero from "~/components/contact/ContactHero.vue";
  import ContactForm from "~/components/contact/ContactForm.vue";
  import SupportOptions from "~/components/contact/SupportOptions.vue";
  import CommunityChannels from "~/components/contact/CommunityChannels.vue";
  import OfficeHours from "~/components/contact/OfficeHours.vue";
  import ContactResources from "~/components/contact/ContactResources.vue";

  // Set page meta
  useHead({
    title: "Contact & Support - Aris ResOps Platform",
    meta: [
      {
        name: "description",
        content:
          "Get support for Aris academic publishing platform. Contact our team, join community discussions, schedule office hours, and access comprehensive documentation.",
      },
      { property: "og:title", content: "Contact & Support - Aris ResOps Platform" },
      {
        property: "og:description",
        content:
          "Get support for Aris academic publishing platform. Contact our team, join community discussions, schedule office hours, and access comprehensive documentation.",
      },
    ],
  });
</script>

<template>
  <div>
    <ContactHero />
    <ContactForm />
    <SupportOptions />
    <CommunityChannels />
    <OfficeHours />
    <ContactResources />
  </div>
</template>

<style scoped></style>
