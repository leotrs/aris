<script setup>
  import { ref, computed, useTemplateRef, nextTick, onBeforeMount } from "vue";
  import Manuscript from "@/components/manuscript/Manuscript.vue";
  import { createDemoApi } from "@/views/demo/demoData.js";

  const props = defineProps({
    htmlString: { type: String, required: true },
    keys: { type: Boolean, required: true },
    showFooter: { type: Boolean, default: false },
    settings: { type: Object, default: () => {} },
  });

  const emit = defineEmits(["mounted-at"]);

  const selfRef = useTemplateRef("self-ref");
  const onload = ref(null);
  const api = createDemoApi();

  // Load RSM dependencies to enable handrails functionality
  onBeforeMount(async () => {
    const base = api.getUri();
    try {
      await import(/* @vite-ignore */ `${base}/static/jquery-3.6.0.js`);
      await import(/* @vite-ignore */ `${base}/static/tooltipster.bundle.js`);
      const module = await import(/* @vite-ignore */ `${base}/static/onload.js`);
      onload.value = module.onload;
    } catch (error) {
      console.error(error);
    }
  });

  const mountPoint = computed(() => selfRef.value);

  // Execute RSM onload functionality and emit mounted event
  const tryExecuteOnload = async () => {
    if (!onload.value || !selfRef.value || !props.htmlString) return;
    await nextTick();
    try {
      await onload.value(selfRef.value);
    } catch (error) {
      console.error(error);
    }
    emit("mounted-at", selfRef.value);
  };

  // Emit mounted event after next tick
  const tryEmitMounted = async () => {
    if (!selfRef.value || !props.htmlString) return;
    await nextTick();
    emit("mounted-at", selfRef.value);
  };

  // Watch for changes and execute onload or emit mounted event
  const handleMount = async () => {
    await nextTick();
    if (onload.value) {
      await tryExecuteOnload();
    } else {
      // If onload hasn't loaded yet, wait a bit and try again
      setTimeout(async () => {
        if (onload.value) {
          await tryExecuteOnload();
        } else {
          await tryEmitMounted();
        }
      }, 100);
    }
  };

  nextTick(handleMount);
</script>

<template>
  <div ref="self-ref" class="manuscript-wrapper demo-mode">
    <Manuscript
      v-if="htmlString"
      :html-string="htmlString"
      :show-footer="showFooter"
      :settings="settings"
    />
  </div>
</template>

<style scoped>
  .manuscript-wrapper.demo-mode {
    font-family: "Source Sans 3", sans-serif;
    line-height: 1.6;
    color: var(--extra-dark);
  }

  .manuscript-wrapper.demo-mode :deep(.rsm-manuscript) {
    max-width: none;
    padding: 32px;
  }

  .manuscript-wrapper.demo-mode :deep(h1) {
    font-size: 2.25rem;
    font-weight: 700;
    margin: 2rem 0 1rem;
    color: var(--extra-dark);
  }

  .manuscript-wrapper.demo-mode :deep(h2) {
    font-size: 1.875rem;
    font-weight: 600;
    margin: 1.75rem 0 0.875rem;
    color: var(--extra-dark);
  }

  .manuscript-wrapper.demo-mode :deep(h3) {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1.5rem 0 0.75rem;
    color: var(--extra-dark);
  }

  .manuscript-wrapper.demo-mode :deep(p) {
    margin: 1rem 0;
  }

  .manuscript-wrapper.demo-mode :deep(blockquote) {
    border-left: 4px solid var(--blue-500);
    padding-left: 1rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: var(--dark);
    background-color: var(--blue-50);
    padding: 1rem;
    border-radius: 4px;
  }

  .manuscript-wrapper.demo-mode :deep(code) {
    background-color: var(--gray-100);
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
    font-family: "Monaco", "Menlo", monospace;
    font-size: 0.875rem;
  }

  .manuscript-wrapper.demo-mode :deep(pre) {
    background-color: var(--gray-900);
    color: var(--gray-100);
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  .manuscript-wrapper.demo-mode :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
  }

  .manuscript-wrapper.demo-mode :deep(th),
  .manuscript-wrapper.demo-mode :deep(td) {
    border: 1px solid var(--border-primary);
    padding: 0.75rem;
    text-align: left;
  }

  .manuscript-wrapper.demo-mode :deep(th) {
    background-color: var(--gray-100);
    font-weight: 600;
  }

  .manuscript-wrapper.demo-mode :deep(tr:nth-child(even)) {
    background-color: var(--gray-50);
  }
</style>
