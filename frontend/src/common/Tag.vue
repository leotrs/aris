<script setup>
 import { ref } from 'vue';

 const props = defineProps({
     name: { type: String, required: true },
     defaultState: { type: Boolean, default: false }
 });
 const state = ref(props.defaultState);

 const emit = defineEmits(['on', 'off']);
 const toggle = () => {
     state.value = !state.value;
     emit(state.value ? 'on' : 'off');
 }
</script>


<template>
  <span
      class="pill"
      :class=" state ? 'on' : 'off'"
      @click.prevent="toggle" >
    {{ name }}
  </span>
</template>


<style scoped>
 .pill {
     border-radius: 16px;
     padding-inline: 8px;
     padding-block: 4px;
     text-wrap: nowrap;

     &:hover {
         background-color: var(--surface-hover);
     }
 }

 .pill.on {
     background-color: var(--secondary-800);
     color: var(--extra-light);
 }

 .pill.off {
     border: var(--border-thin) solid var(--secondary-100);
     color: var(--extra-dark);
 }
</style>
