<script setup>
  import { computed, provide, onMounted } from "vue";
  import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
  import axios from "axios";
  import { createFileStore } from "./FileStore.js";

  // Create API instance with base URL and error handling
  const api = axios.create({
    baseURL: "http://localhost:8000",
    timeout: 10000,
  });
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error(`API Error: ${error.message}`, error);
      return Promise.reject(error);
    }
  );
  provide("api", api);

  // Provide user info
  const user = { id: 1, name: "TER" };
  provide("user", user);

  // Create and provide file store
  const fileStore = createFileStore(api, user);
  provide("fileStore", fileStore);

  // Initialize files and tags
  onMounted(() => {
    fileStore.loadFiles();
    fileStore.loadTags();
  });

  // Provide viewport info
  const breakpoints = useBreakpoints(breakpointsTailwind);
  provide("breakpoints", breakpoints);
  /* const isMobile = computed(() => breakpoints.smaller("md")); */
  const isMobile = computed(() => false);
  provide("isMobile", isMobile);
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
