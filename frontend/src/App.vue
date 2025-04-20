<script setup>
  import { ref, provide, onMounted, onUnmounted, nextTick } from "vue";

  /*********** provide user info ***********/
  const user = { id: 1, name: "TER" };
  provide("user", user);

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
