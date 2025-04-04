<script setup>
 import { ref, defineEmits } from 'vue';
 import { IconDotsVertical, IconEdit, IconTags, IconCopy, IconVersions, IconDownload, IconShare3, IconTrashX } from '@tabler/icons-vue';
 import Separator from './Separator.vue';

 const emit = defineEmits(["rename", "edit-tags"]);
 const show = ref(false);
 const toggleMenu = () => { show.value = !show.value };
</script>

<template>
  <div class="dots" @click.stop="toggleMenu" @dblclick.stop>
    <IconDotsVertical width="4" height="18" viewBox="10 3 4 18.25" />
    <div v-if="show" class="menu">
      <div class="item text-caption" @click="$emit('rename')"><IconEdit />Rename</div>
      <div class="item text-caption"><IconCopy />Duplicate</div>
      <div class="item text-caption" @click="$emit('edit-tags')"><IconTags />Edit tags</div>
      <!-- <div class="item text-caption"><IconVersions />Revisions</div> -->
      <div class="item text-caption"><IconDownload />Download</div>
      <!-- <div class="item text-caption"><IconShare3 />Share</div> -->
      <Separator />
      <div class="item text-caption danger"><IconTrashX />Delete</div>
    </div>
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
     transform: translateX(-16px) translateY(-8px);
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
