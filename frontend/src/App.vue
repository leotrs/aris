<script setup>
 import { RouterLink } from 'vue-router';
</script>


<template>
  <RouterView />
</template>


<style>
 #app {
     background-color: var(--extra-light);
     display: flex;
     height: 100%;
     font-family: "Source Sans 3", sans-serif;
     font-weight: var(--weight-regular);
     font-size: 16px;
     line-height: 1.25;
     color: var(--extra-dark);
 }
</style>
