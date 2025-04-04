<script setup>
 import { ref } from 'vue';

 const props = defineProps({
     name: { type: String, required: true },
     initialState: { type: Boolean, default: false }
 });
 const state = ref(props.initialState);

 const emit = defineEmits(['on', 'off']);
 const toggle = () => {
     state.value = !state.value;
     emit(state.value ? 'on' : 'off');
 }
</script>


<template>
  <div class="tag-control">
    <Tag @click.prevent="toggle" :name="name" :active="state" />
    <ContextMenu>
      <div class="colors">
        <span class="color red" :style="{ 'background-color': 'var(--red-500)' }"></span>
        <span class="color green" :style="{ 'background-color': 'var(--green-500)' }"></span>
        <span class="color purple" :style="{ 'background-color': 'var(--purple-500)' }"></span>
        <span class="color orange" :style="{ 'background-color': 'var(--orange-500)' }"></span>
      </div>
      <ContextMenuItem icon="Edit" caption="Rename" />
      <ContextMenuItem icon="TrashX" caption="Delete" class="danger" />
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
 }
</style>
