<script setup>
  import * as TablerIcons from "@tabler/icons-vue";
  import IconTherefore from "./IconTherefore.vue";

  const Icons = {
    ...TablerIcons,
    IconTherefore,
  };

  const props = defineProps({
    name: { type: String, required: true },
    iconClass: { type: String, default: "" },
  });
</script>

<template>
  <component :is="Icons['Icon' + name]" :class="['tabler-icon', iconClass]">
    {{ name }}
  </component>
</template>

<style scoped>
  .tabler-icon {
    /* width: 24px;
       height: 24px;
       stroke-width: 1.75px;
       stroke-linecap: round;
       stroke-linejoin: round; */
  }
</style>
