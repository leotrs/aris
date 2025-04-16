<script setup>
  const props = defineProps({ icon: { type: String, required: true } });
  const emit = defineEmits(["on", "off"]);
</script>

<template>
  <ButtonToggle :icon="icon" @on="$emit('on')" @off="emit('off')">
    <!-- <SegmentedControl
      :icons="['LayoutSidebarFilled', 'LayoutNavbarFilled', 'LayoutSidebarRightFilled']"
    /> -->
  </ButtonToggle>
</template>

<style scoped></style>
