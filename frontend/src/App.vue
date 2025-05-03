<script setup>
  import { ref, computed, provide, onMounted, reactive } from "vue";
  import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
  import axios from "axios";
  import RelativeTime from "@yaireo/relative-Time";

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

  // Provide user info
  const user = reactive({ id: 1, name: "TER" });
  provide("user", user);

  // Date utilities
  const relativeTime = new RelativeTime({ locale: "en" });
  const formatDate = (doc) => relativeTime.from(new Date(doc.last_edited_at));

  // Provide userDocs
  const userDocs = ref([]);
  const reloadDocs = async () => {
    try {
      const response = await api.get(`/users/${user.id}/documents`, {
        params: { with_tags: true, with_minimap: true },
      });

      // Preserve selected and filtered states when reloading
      userDocs.value = response.data.map((newDoc) => {
        const existingDoc = userDocs.value.find((d) => d.id === newDoc.id);
        return {
          ...newDoc,
          last_edited_at: formatDate(newDoc),
          filtered: existingDoc ? existingDoc.filtered : false,
          selected: existingDoc ? existingDoc.selected : false,
        };
      });
    } catch (error) {
      console.error("Error in reloadDocs:", error);
    }
  };
  onMounted(() => reloadDocs());

  const sortDocs = (compareFunc) => userDocs.value.sort(compareFunc);
  const filterDocs = (filterFunc) => {
    userDocs.value.forEach((doc) => (doc.filtered = filterFunc(doc)));
  };
  const clearFilterDocs = () => {
    userDocs.value.forEach((doc) => (doc.filtered = false));
  };
  const selectFile = (doc) => {
    if (doc.selected) return;
    const currentSelected = userDocs.value.find((d) => d.selected);
    if (currentSelected) currentSelected.selected = false;
    doc.selected = true;
  };
  const clearSelection = () => {
    const selected = userDocs.value.find((d) => d.selected);
    if (selected) selected.selected = false;
  };
  const selectedFile = computed(() => userDocs.value.find((d) => d.selected) || {});

  provide("userDocs", {
    userDocs,
    reloadDocs,
    sortDocs,
    filterDocs,
    clearFilterDocs,
    selectFile,
    clearSelection,
    selectedFile,
  });

  // Provide userTags
  const userTags = ref([]);
  const fetchTags = async () => {
    try {
      const response = await api.get(`/users/${user.id}/tags`);
      userTags.value = response.data;
    } catch (error) {
      console.error("Error in fetchTags:", error);
    }
  };
  const updateUserTag = async (oldTag, newTag) => {
    if (!oldTag) return await fetchTags();

    const url = `/users/${user.id}/tags/${oldTag.id}`;
    try {
      if (newTag == null) {
        await api.delete(url);
      } else {
        await api.put(url, newTag);
      }
      await reloadDocs();
      await fetchTags();
    } catch (error) {
      console.error("Error in updateUserTag:", error);
    }
  };
  const createTag = async (name, color = null) => {
    try {
      await api.post(`/users/${user.id}/tags`, {
        name,
        color: color || "",
      });
      await reloadDocs();
      await fetchTags();
    } catch (error) {
      console.error("Error in createTag:", error);
    }
  };
  const addOrRemoveTag = async (tagID, docID, mode) => {
    const url = `/users/${user.id}/documents/${docID}/tags/${tagID}`;
    try {
      if (mode === "add") {
        await api.post(url);
      } else if (mode === "remove") {
        await api.delete(url);
      } else {
        console.warn(`Invalid tag operation mode: ${mode}`);
        return;
      }
      await reloadDocs();
    } catch (error) {
      console.error("Error in addOrRemoveTag:", error);
    }
  };
  provide("userTags", { userTags, updateUserTag, createTag, addOrRemoveTag });
  onMounted(() => fetchTags());

  // Provide viewport info
  const breakpoints = useBreakpoints(breakpointsTailwind);
  provide("breakpoints", breakpoints);
  const isMobile = computed(() => breakpoints.smaller("md"));
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
    overflow: hidden;
  }
</style>
