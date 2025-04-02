<script setup>
 import { ref, defineProps, defineEmits, defineModel, onMounted, onUpdated, onUnmounted, useTemplateRef } from 'vue';
 import { useRouter } from 'vue-router';
 import SidebarItem from './HomeSidebarItem.vue';
 import Separator from './Separator.vue';
 import ButtonToggle from './ButtonToggle.vue';

 const emit = defineEmits([
     'showMinimap',
     'hideMinimap'
 ]);
 const showMinimap = defineModel("showMinimap");
 const showSettings = defineModel("showSettings");

 const router = useRouter();
 const goHome = () => { router.push(`/`); }
</script>


<template>
  <div class="sb-wrapper" ref="sidebar-ref">
    <div id="logo" @click="goHome">
      <img src="../assets/logo-32px.svg" />
    </div>
    <div class="sb-menu">
      <ButtonToggle
          icon="MapPin"
          @on="showMinimap = true"
          @off="showMinimap = false" />
      <ButtonToggle icon="Search" />
      <ButtonToggle icon="Quote" />
      <ButtonToggle icon="Variable" />
      <ButtonToggle icon="Blocks" />
      <ButtonToggle icon="Message" />
      <ButtonToggle
          icon="FileSettings"
          @on="showSettings = true"
          @off="showSettings = false" />
    </div>
  </div>
</template>


<style scoped>
 .sb-wrapper {
     height: 100%;
     min-width: 64px;
     max-width: 64px;
     padding-inline: 8px;
     padding-block: 8px;
     background-color: var(--extra-light);
     position: fixed;
     z-index: 1;
     /* border-right: var(--border-thin) solid var(--border-primary); */

     /* no scrollbar in any browser */
     overflow-y: auto;
     scrollbar-width: none;     /* firefox */
     -ms-overflow-style: none;  /* Edge */
     &::-webkit-scrollbar { /* Chrome */
         display: none;
     }
 }

 #logo {
     display: flex;
     padding: 9px;
     margin-bottom: 8px;
     &:hover { cursor: pointer; }
     & > img { margin: 0 auto; }
 }

 .sb-menu {
     padding-block: 16px;
     & > * {
         margin-bottom: 8px;
         gap: 8px;
     }
 }
</style>
