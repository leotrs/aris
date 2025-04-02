<script setup>
 import { ref, computed } from 'vue';

 const props = defineProps({
     name: { type: String, required: true },
     disableSorting: { type: Boolean, default: false }
 })

 const allStates = ["none", "desc", "asc"];
 const emit = defineEmits(["none", "desc", "asc"]);
 const currentIndex = ref(0);
 const state = computed(() => allStates[currentIndex.value]);
 const nextState = () => {
     if (!props.disableSorting) {
         currentIndex.value = (currentIndex.value + 1) % allStates.length;
         emit(state.value);
     }
 };
</script>


<template>
  <span
      class="header"
      :class="{ sortable: !disableSorting }"
      @click="nextState" >{{ name }}</span>
</template>


<style scoped>
 .header {
     color: var(--almost-black);

     &.sortable:hover { cursor: pointer };
 }
</style>
