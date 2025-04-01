<script setup>
 import { IconSearch } from '@tabler/icons-vue';
</script>


<template>
  <div class="search-input text-caption">
    <IconSearch />Search...
  </div>
</template>


<style scoped>
 .search-input {
     color: var(--extra-dark);
     background-color: var(--surface-primary);
     border: 2px solid var(--border-primary);
     border-radius: 16px;
     height: 48px;
     min-width: 280;
     display: flex;
     align-items: center;
     padding-block: 12px;
     padding-inline: 16px;
     gap: 16px;

     & > .tabler-icon {
         margin: unset;
     }

     &:hover {
         cursor: text;
     }

 }
</style>
