<script setup>
 import { ref, computed } from 'vue';
 import { IconSortAscendingLetters, IconSortDescendingLetters } from '@tabler/icons-vue';

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
  <div class="col-header" :class="{ sortable: !disableSorting }" @click="nextState">
    <span>{{ name }}</span>
    <span v-if="state == 'desc'"><IconSortDescendingLetters /></span>
    <span v-if="state == 'asc'"><IconSortAscendingLetters /></span>
  </div>
</template>


<style scoped>
 .col-header {
     display: flex;
     flex-wrap: wrap;
     align-content: center;
     height: 40px;
     color: var(--almost-black);
     background-color: var(--surface-information);

     &.sortable:hover { cursor: pointer };
 }
 .col-header:hover {
     background-color: var(--gray-50);
     align-items: center;
 }
</style>
