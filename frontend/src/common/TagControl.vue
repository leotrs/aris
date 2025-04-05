<script setup>
 import { ref } from 'vue';

 const props = defineProps({
     tag: { type: Object, required: true },
     initialState: { type: Boolean, default: false }
 });
 const state = ref(props.initialState);

 const emit = defineEmits(['on', 'off', 'set-color', 'delete']);
 const toggle = () => {
     state.value = !state.value;
     emit(state.value ? 'on' : 'off');
 }
</script>


<template>
  <div class="tag-control">
    <Tag @click.prevent="toggle" :tag="tag" :active="state" />
    <ContextMenu>
      <div class="colors">
        <span class="color red" @click="$emit('set-color', 'red')"></span>
        <span class="color green" @click="$emit('set-color', 'green')"></span>
        <span class="color purple" @click="$emit('set-color', 'purple')"></span>
        <span class="color orange" @click="$emit('set-color', 'orange')"></span>
      </div>
      <ContextMenuItem icon="Edit" caption="Rename" />
      <ContextMenuItem icon="TrashX" caption="Delete" class="danger" @click="$emit('delete', tag)" />
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
