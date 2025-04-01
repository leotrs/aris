<script setup>
 import { ref, defineProps, defineEmits } from 'vue';
 import ContextMenu from './ContextMenu.vue';
 import Avatar from './Avatar.vue';
 import FileTitle from './FileTitle.vue';
 import RelativeTime from '@yaireo/relative-Time';

 const props = defineProps({
     doc: { type: Object, required: true },
     mode: { type: String, default: 'list' }
 })
 const emits = defineEmits(["click", "dblclick"])

 const relativeTime = new RelativeTime({ locale: 'en' });

 const fileTitleActive = ref(false);

 const rename = () => { fileTitleActive.value = true };
</script>

<template>
  <div
      class="item"
      :class="mode"
      @click="emits('click')"
      @dblclick="emits('dblclick')" >
    <FileTitle :doc="doc" v-model="fileTitleActive" />
    <template v-if="mode == 'cards'"><ContextMenu @rename="rename"/></template>
    <div class="minimap">minimap</div>
    <div class="tags">tags</div>
    <div class="last-edited">{{ relativeTime.from(new Date(doc.last_edited_at)) }}</div>
    <div class="grid-wrapper-1"><Avatar name="LT" /></div>
    <div class="grid-wrapper-2"><template v-if="mode == 'list'"><ContextMenu @rename="rename"/></template></div>
    <span></span>
  </div>
</template>


<style scoped>
 .item {
     color: var(--extra-dark);
     & > .minimap { height: 40px };
     & > .tags { height: 40px };
 }

 .item.list {
     &:hover > * { background-color: var(--surface-hover); }
     & > * {
         transition: background 0.15s ease-in-out;
         border-bottom: var(--border-extrathin) solid var(--border-primary);
         align-content: center;
         height: 48px;
         padding-right: 16px;
     }
     & .grid-wrapper-2 { padding-right: 0px };
     & .dots { padding-right: 0px };
     & *:last-child { padding-right: 0px };
 }

 .item.cards {
     border-radius: 16px;
     margin-bottom: 16px;
     padding: 16px;
     border: var(--border-thin) solid var(--border-primary);
     background-color: var(--surface-primary);

     &:hover {
         background-color: var(--surface-hover);
         border-color: var(--gray-400);
     }

     & > .dots, & > .file-title, & > .last-edited, & > .grid-wrapper-1, & > .grid-wrapper-2 {
         display: inline-block;
     }

     & > .dots, & > .grid-wrapper-1 {
         float: right;
     }

     & > .last-edited {
         height: 32px;
         align-content: center;
     }
 }
</style>
