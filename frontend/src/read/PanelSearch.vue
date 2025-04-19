<script setup>
import { ref, inject, onMounted, onUpdated, onUnmounted, useTemplateRef } from "vue";
import highlightSearchMatches from "./highlightSearchMatches.js";

const emit = defineEmits(["showComponent", "hideComponent"]);

const manuscriptRef = inject("manuscriptRef");
const searchBar = useTemplateRef("searchBar");
const onSubmit = (searchString) => {
  if (!manuscriptRef.value) return;
  highlightSearchMatches(manuscriptRef.value.$el, searchString);
}
onMounted(() => searchBar.value?.focusInput())
</script>

<template>
  <SearchBar ref="searchBar" @submit="onSubmit" />
</template>

<style scoped></style>
