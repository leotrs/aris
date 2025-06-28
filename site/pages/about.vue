<script setup>
  import AboutHeroSection from "~/components/about/AboutHeroSection.vue";
  import HumanFirstSection from "~/components/about/HumanFirstSection.vue";
  import OurStorySection from "~/components/about/OurStorySection.vue";
  import VisionSection from "~/components/about/VisionSection.vue";

  // Set page meta
  useHead({
    title: "About Aris - Human-First Scientific Research",
    meta: [
      {
        name: "description",
        content:
          "Learn about Aris's human-first philosophy for scientific research. Discover how we're redefining research through Stories of Science, Research Ops, and intelligent collaboration.",
      },
      { property: "og:title", content: "About Aris - Human-First Scientific Research" },
      {
        property: "og:description",
        content:
          "Learn about Aris's human-first philosophy for scientific research. Discover how we're redefining research through Stories of Science, Research Ops, and intelligent collaboration.",
      },
    ],
  });
</script>

<template>
  <div>
    <AboutHeroSection />
    <OurStorySection />
    <VisionSection />
    <HumanFirstSection />
  </div>
</template>

<style scoped></style>
