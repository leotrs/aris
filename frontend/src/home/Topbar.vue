<script setup>
 import { inject } from 'vue';
 
 const emits = defineEmits(["list", 'cards']);
 const isMobile = inject('isMobile');
 
 let segmentedControlIcons = ['LayoutList', 'LayoutCards']; 
 if (isMobile) { segmentedControlIcons.push('CropPortrait') }
</script>


<template>
  <div class="tb-wrapper" :class="{ mobile: isMobile }">
    <div class="tb-control">
      <SegmentedControl
          :icons="segmentedControlIcons"
          @change="(idx) => idx == 0 ? $emit('list') : $emit('cards')" />
    </div>
    <div class="tb-search">
      <SearchBar />
    </div>
    <div class="tb-cta">
      <Button kind="tertiary"  icon="Settings" />
      <Button kind="tertiary"><Avatar name="TER" /></Button>
    </div>
  </div>
</template>


<style scoped>
 .tb-wrapper {
     display: flex;
     flex-wrap: wrap;
     justify-content: space-between;
     column-gap: 48px;
     row-gap: 8px;
 }

 .tb-wrapper.mobile {
     background-color: var(--extra-light);

     & > .tb-search {
         max-width: 20%;
     }
 }

 .tb-search {
     flex-grow: 1;
 }

 .tb-control {
     align-content: center;
 }

 .tb-cta {
     display: flex;
     gap: 4px;
     white-space: nowrap;

     /* & > button { padding-inline: 8px }; */

 }
</style>
