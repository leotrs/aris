<script setup>
 import { ref } from 'vue';
 import { IconDotsVertical, IconEdit, IconTags, IconCopy, IconVersions, IconDownload, IconShare3, IconTrashX } from '@tabler/icons-vue';
 import * as Icons from '@tabler/icons-vue';
 import Separator from './Separator.vue';

 const props = defineProps({ icon: { type: String, default: 'Dots' }});
 const show = ref(false);
 const toggleMenu = () => { show.value = !show.value };
</script>

<template>
  <div
      class="cm-wrapper"
      :class="{ 'dots': icon == 'Dots' }"
      @click.stop="toggleMenu" @dblclick.stop >

    <IconDotsVertical class="cm-btn dots" v-if="icon == 'Dots'" width="4" height="18" viewBox="10 3 4 18.25" />
    <component class="cm-btn" v-else :is="Icons['Icon' + props.icon]" />

    <div v-if="show" class="menu"><slot /></div>

  </div>
</template>


<style scoped>
 .dots {
     position: relative;
     display: flex;
     color: var(--extra-dark);
     stroke-width: 2px;
     border-radius: 8px;
     padding-inline: 6px;
     padding-block: 7px;

     & > svg {
         width: 4px;
         height: 18px;
         margin: 0;
     }

     &:hover {
         background-color: var(--surface-hint);
     }
 }

 .menu {
     position: absolute;
     right: 0;
     top: 0;
     z-index: 999;
     background-color: var(--surface-primary);
     padding-block: 8px;
     border-radius: 16px;
     box-shadow: 0px 1px 2px rgba(0, 0, 0, 30%), 0px 2px 6px rgba(0, 0, 0, 15%);
     & > *:not(:last-child) { margin-bottom: 8px };

     & .item {
         display: flex;
         align-items: center;
         padding-left: 10px;
         padding-right: 16px;
         padding-block: 0px;
         gap: 10px;
         &:hover {
             background-color: var(--surface-hover);
             font-weight: var(--weight-medium);
         };
         &:hover .tabler-icon { stroke-width: 2px };
     }

     & .item .tabler-icon {
         display: inline-block;
         stroke-width: 1.2px;
     }
 }

 .menu .item.danger {
     color: var(--text-error);
     &:hover { background-color: var(--surface-error) };
     & .tabler-icon { color: var(--icon-error) };
 }

</style>
