<script setup>
 import { ref, watch, defineModel, defineProps, nextTick } from 'vue';

 const props = defineProps({
     doc: { type: Object, required: true }
 })
 const active = defineModel();

 const textInput = ref(null);
 watch(active, async (newValue, oldValue) => {
     if (newValue && !oldValue) {
         await nextTick();      // wait for DOM to update
         textInput.value.value = props.doc.title;
         textInput.value.focus();
     }
 })
 const submit = () => {
     console.log(`renaming from ${props.doc.title} to ${textInput.value.value}`);
     active.value = false;
 }
</script>


<template>
  <span v-if="active" class="file-title">
    <input
        ref="textInput"
        type="text"
        @keyup.enter="submit"
        @click.stop
        @dblclick.stop
    /></span>
    <span v-else>{{ doc.title }}</span>
</template>


<style scoped>
</style>
