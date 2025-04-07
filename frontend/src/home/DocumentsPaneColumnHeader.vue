<script setup>
 import { ref, computed } from 'vue';
 import { IconSortAscendingLetters, IconSortDescendingLetters, IconFilter } from '@tabler/icons-vue';
 import TagManagementMenu from './TagManagementMenu.vue';

 const props = defineProps({
     name: { type: String, required: true },
     sortable: { type: Boolean, default: true },
     filterable: { type: Boolean, default: true }
 })

 const allStates = {'sortable': ["sortNone", "sortDesc", "sortAsc"], 'filterable': ["filterOn", "filterOff"]};
 const emit = defineEmits(["sortNone", "sortDesc", "sortAsc", "filterOn", "filterOff"]);
 const currentIndex = ref(0);
 const state = computed(() => {
     const states = allStates[props.sortable ? 'sortable' : props.filterable ? 'filterable' : null];
     return states[currentIndex.value];
 });
 const nextState = () => {
     let numStates = 1;
     if (props.sortable) {
         const numStates = allStates['sortable'].length;
         currentIndex.value = (currentIndex.value + 1) % numStates;
     } else if (props.filterable) {
         const numStates = allStates['filterable'].length;
         currentIndex.value = (currentIndex.value + 1) % numStates;
     }
     emit(state.value);
 };
</script>


<template>
  <div
      class="col-header"
      :class="{ sortable: sortable, filterable: filterable }"
      @click.stop="nextState" >
    <span>{{ name }}</span>
    <span v-if="sortable && state == 'desc'"><IconSortDescendingLetters /></span>
    <span v-if="sortable && state == 'asc'"><IconSortAscendingLetters /></span>
    <span v-if="filterable"><TagManagementMenu :tags="[]" icon="Filter" /></span>
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
