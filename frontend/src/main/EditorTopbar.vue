<script setup>
  import { ref, inject, watch } from "vue";

  const emit = defineEmits(["compile"]);
  const focusMode = inject("focusMode");
  const mobileMode = inject("mobileMode");
  const file = inject("file");

  const countWords = (text) => {
    if (!text || typeof text !== "string") return 0;

    // Match word characters (letters, numbers, underscores)
    const words = text.match(/\b\w+\b/g);
    return words ? words.length : 0;
  };

  const debouncedCounter = (() => {
    let timeoutId;

    return function countWordsDebounced(text, callback, delay = 200) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const count = countWords(text);
        callback(count);
      }, delay);
    };
  })();

  const numWords = ref(0);
  watch(
    () => file.value.source,
    (newText) => {
      debouncedCounter(newText, (count) => {
        numWords.value = count;
      });
    },
    { immediate: true }
  );
</script>

<template>
  <div class="tb-wrapper" :class="{ focus: focusMode }">
    <div class="left">
      <Tabs :labels="['Source', 'Files']" :icons="['Code', 'Files']">
        <TabPage />
        <TabPage />
      </Tabs>
    </div>
    <div v-if="!mobileMode" class="middle">
      <span class="word-count">{{ numWords }} words</span>
    </div>
    <div class="right">
      <Button kind="tertiary" size="sm" icon="Versions" />
      <Button kind="tertiary" size="sm" icon="Lifebuoy" />
      <Button kind="tertiary" size="sm" icon="Settings" />
      <Button kind="primary" size="sm" text="compile" class="cta" @click="emit('compile')" />
    </div>
  </div>
</template>

<style scoped>
  .tb-wrapper {
    --outer-padding: 8px;
    --sidebar-width: 64px;
    --links-width: 151px;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    border-top-left-radius: 16px;
    opacity: 1;
    transform: translateY(0);
    will-change: opacity, transform, width;
    transition:
      opacity var(--transition-duration) ease,
      transform var(--transition-duration) ease,
      width var(--transition-duration) ease;
  }

  .tabs-wrapper :deep(.tabs-header) {
    border-radius: 8px 8px 0 0 !important;
  }

  .tabs-wrapper :deep(.tab-wrapper) {
    width: 56px;
  }

  .tabs-wrapper :deep(.tabs-content) {
    display: none !important;
    padding: 0px !important;
    margin: 0px !important;
  }

  .word-count {
    font-size: 13px;
    font-weight: 400;
    color: var(--gray-600);
    letter-spacing: 0.01em;
  }

  .right {
    display: flex;
    gap: 4px;
    height: 100%;
    padding-block: 8px;
  }

  .right .version {
    display: flex;
    align-items: center;
  }
</style>
