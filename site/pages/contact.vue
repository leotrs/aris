<script setup>
  import SimpleContact from "~/components/contact/SimpleContact.vue";

  // Set page meta
  useHead({
    title: "Contact - Aris Collaborative Preprint Server",
    meta: [
      {
        name: "description",
        content: "Get in touch with the Aris team. Contact form and essential links.",
      },
      { property: "og:title", content: "Contact - Aris Collaborative Preprint Server" },
      {
        property: "og:description",
        content: "Get in touch with the Aris team. Contact form and essential links.",
      },
    ],
  });
</script>

<template>
  <div>
    <SimpleContact />
  </div>
</template>

<style scoped></style>
