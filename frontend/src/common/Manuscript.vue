<script setup>
  import {} from "vue";

  const props = defineProps({
    htmlString: { type: String, required: true },
  });
</script>

<template>
  <div v-html="htmlString"></div>
</template>

<style>
  /* Overwrite RSM's CSS but be CAREFUL!!! */
  .manuscriptwrapper {
    /* The background color comes from the user's choice within the settings overlay */
    background-color: transparent !important;

    /* Overwrite size and whitespace */
    margin: 0 !important;
    max-width: unset !important;
    padding-bottom: 48px !important;
    padding-inline: 0px !important;
    border-radius: 0px !important;

    & section.level-1 {
      margin-block: 0px !important;
    }

    /* Patches - for some reason the RSM CSS is broken? */
    & .hr .hr-border-zone .hr-border-dots .icon.dots {
      padding-bottom: 0 !important;
    }

    & .hr .hr-collapse-zone .hr-collapse .icon.collapse {
      padding-bottom: 0 !important;
    }
  }
</style>
