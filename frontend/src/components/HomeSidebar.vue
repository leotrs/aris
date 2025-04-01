<script setup>
 import { ref, defineProps, defineEmits, onMounted, onUnmounted, onUpdated, useTemplateRef } from 'vue';
 import SidebarItem from './HomeSidebarItem.vue';
 import Separator from './Separator.vue';
 import Button from './Button.vue';

 const emit = defineEmits(['showFileUploadModal']);
 const forceCollapsed = ref(false);
 const collapsed = ref(false);
 const toggleCollapsed = () => {
     collapsed.value = !collapsed.value;
     forceCollapsed.value = !forceCollapsed.value;
 };

 const sidebarRef = ref(null);
 let observer;
 onMounted(() => {
     if (sidebarRef.value) {
         observer = new ResizeObserver((entries) => {
             for (let entry of entries) {
                 if (!forceCollapsed.value) {
                     if (entry.contentRect.width < 150 && !collapsed.value) {
                         collapsed.value = true;
                     } else if (entry.contentRect.width > 80 && collapsed.value) {
                         collapsed.value = false;
                     }
                 }
             }
         });
         observer.observe(sidebarRef.value);
     }
 });
 onUnmounted(() => { if (observer) observer.disconnect() });
</script>


<template>
  <div class="sb-wrapper" ref="sidebarRef" :class="collapsed ? 'collapsed' : null">
    <div id="logo">
      <img v-if="collapsed" src="../assets/logo-32px.svg" />
      <img v-else src="../assets/logotype.svg" />
    </div>
    <div class="cta">
      <Button
          kind="secondary"
          icon="CirclePlus"
          :text="!collapsed ? 'New Document' : ''"
          @click="$emit('showFileUploadModal')" />
    </div>
    <div class="sb-menu">
      <SidebarItem :collapsed="collapsed" text="Home" active />
      <SidebarItem :collapsed="collapsed" text="Write" />
      <SidebarItem :collapsed="collapsed" text="Read" />
      <SidebarItem :collapsed="collapsed" text="Review" />
      <SidebarItem :collapsed="collapsed" text="All Files" />
      <Separator />
      <SidebarItem :collapsed="collapsed" text="Collapse" @click="toggleCollapsed" />
    </div>
  </div>
</template>


<style scoped>
 .sb-wrapper {
     height: 100%;
     overflow-y: auto;
     scrollbar-width: none;     /* firefox */
     -ms-overflow-style: none;  /* Edge */
     &::-webkit-scrollbar { /* Chrome */
         display: none;
     }

     &:not(.collapsed) {
         flex-basis: 216px;
         flex-grow: 1;
         min-width: 140px;
         max-width: 216px;
     }

     &.collapsed {
         padding-top: 16px;
         min-width: 64px;
         max-width: 90px;
         flex-grow: 1;
         & > * { margin: 0 auto };

         & > #logo {
             margin-top: 9px;
             margin-bottom: 21px;
             padding-inline: 17px;
             & > img { margin: 0 };
         }

         &.collapsed > .cta {
             justify-content: center;
         }
     }
 }

 #logo {
     display: flex;
     justify-content: center;
     & > img { margin: 0 auto; }
 }

 .sb-menu > *, .cta > * {
     margin-bottom: 8px;
     gap: 6px;
 }

 .cta {
     display: flex;
     align-items: center;
     padding-inline: 8px;
     flex-grow: 1;
 }
 .sb-wrapper:not(.collapsed) .cta > button { padding-left: 6px; }


 /***************************************************************/
 /* this will never work bc scoped styles can't select children */
 .sb-wrapper .cta button .btn-text {
     background: red;
 };

 /* this SHOULD work but DOESNT... */
 .cta button :deep(.btn-text) {
     background: black !important;
 };
</style>
