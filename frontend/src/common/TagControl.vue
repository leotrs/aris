<script setup>
 import { ref, inject } from 'vue';

 const props = defineProps({
     tag: { type: Object, required: true },
     initialState: { type: Boolean, default: false }
 });
 const state = ref(props.initialState);
 const { userTags, updateUserTag } = inject('userTags');

 const toggle = () => { state.value = !state.value }

 const setColor = (color) => {
     const newTag = JSON.parse(JSON.stringify(props.tag));
     newTag.color = color;
     updateUserTag(props.tag, newTag);
 }

 const deleteTag = () => { updateUserTag(props.tag, null) }

 const renaming = ref(false);
 const renameTag = (newName) => {
     const newTag = JSON.parse(JSON.stringify(props.tag));
     newTag.name = newName;
     updateUserTag(props.tag, newTag);
 }
</script>


<template>
  <div class="tag-control">
    <Tag @click.prevent="toggle" :tag="tag" :active="state" v-model="renaming" @rename="renameTag" />
    <ContextMenu>
      <div class="colors">
        <span class="color red" @click="setColor('red')"></span>
        <span class="color green" @click="setColor('green')"></span>
        <span class="color purple" @click="setColor('purple')"></span>
        <span class="color orange" @click="setColor('orange')"></span>
      </div>
      <ContextMenuItem icon="Edit" caption="Rename" @click="renaming = true" />
      <ContextMenuItem icon="TrashX" caption="Delete" class="danger" @click="deleteTag" />
    </ContextMenu>
  </div>
</template>


<style scoped>
 :deep(.dots > .menu) {
     transform: translateX(100%) !important;
 }

 .pill:hover {
     background-color: var(--surface-hover);
 }

 .colors {
     display: flex;
     justify-content: space-between;
     padding-inline: 16px;
 }

 .color {
     height: 32px;
     width: 16px;
     border-radius: 8px;

     &.red { background-color: var(--red-500) }
     &.green { background-color: var(--green-500) }
     &.purple { background-color: var(--purple-500) }
     &.orange { background-color: var(--orange-500) }

 }
</style>
