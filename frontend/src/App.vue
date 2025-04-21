<script setup>
  import { ref, provide, onMounted, onUnmounted, nextTick } from "vue";
  import axios from "axios";

  /*********** provide user info ***********/
  const user = { id: 1, name: "TER" };
  provide("user", user);

  /*********** Provide userTags ***********/
  const userTags = ref([]);
  const updateUserTag = async (oldTag, newTag) => {
    if (oldTag) {
      const url = `http://localhost:8000/users/${user.id}/tags/${oldTag.id}`;
      try {
        if (newTag == null) {
          await axios.delete(url);
        } else {
          await axios.put(url, newTag);
        }
        reloadDocs();
      } catch (error) {
        console.error("Error updating tag:", error);
      }
    }

    try {
      const response = await axios.get(`http://localhost:8000/users/${user.id}/tags`);
      userTags.value = response.data;
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };
  const createTag = async (name, color = null) => {
    try {
      await axios.post(`http://localhost:8000/users/${user.id}/tags`, {
        name: name,
        color: color || "",
      });
      reloadDocs();
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };
  const addOrRemoveTag = async (tagID, docID, mode) => {
    console.log(mode);
    const url = `http://localhost:8000/users/${user.id}/documents/${docID}/tags/${tagID}`;
    if (mode == "add") {
      try {
        await axios.post(url);
        reloadDocs();
      } catch (error) {
        console.error("Error updating tag:", error);
      }
    } else if (mode == "remove") {
      try {
        await axios.delete(url);
        reloadDocs();
      } catch (error) {
        console.error("Error updating tag:", error);
      }
    }
  };
  provide("userTags", { userTags, updateUserTag, createTag, addOrRemoveTag });
  onMounted(async () => {
    updateUserTag();
  });

  /*********** provide viewport info ***********/
  const isMobile = ref(false);
  const setIsMobile = (el) => {
    isMobile.value = el?.contentRect.width < 432;
  };

  let observer;
  onMounted(() =>
    nextTick(() => {
      observer = new ResizeObserver((entries) => {
        entries.forEach((el) => setIsMobile(el));
      });
      observer.observe(document.documentElement);
      setIsMobile();
    })
  );
  onUnmounted(() => (observer ? observer.disconnect() : null));
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
