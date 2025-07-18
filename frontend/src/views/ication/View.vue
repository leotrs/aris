<script setup>
  import { ref, reactive, computed, provide, onMounted, inject } from "vue";
  import { useRoute } from "vue-router";
  import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";
  import {
    fetchPublicationData,
    createPublicationFileStore,
    createPublicationUser,
    createPublicationAnnotations,
  } from "./publicationData.js";
  import Sidebar from "@/views/workspace/Sidebar.vue";
  import Canvas from "@/views/workspace/Canvas.vue";
  import Icon from "@/components/base/Icon.vue";
  import CitationModal from "@/components/citations/CitationModal.vue";

  // Get route parameters
  const route = useRoute();
  const identifier = computed(() => route.params.identifier);

  const api = inject("api");
  provide("api", api);

  // Use ONLY injected values from App.vue (single source of truth)
  const breakpoints = inject("breakpoints");
  const xsMode = inject("xsMode");
  const mobileMode = inject("mobileMode");

  // Provide the injected values to child components
  provide("breakpoints", breakpoints);
  provide("xsMode", xsMode);

  // Preprint data
  const publicationFile = ref(null);
  const publicationMetadata = ref(null);
  const user = ref(createPublicationUser());
  const fileStore = ref(null);
  const annotations = reactive(createPublicationAnnotations());

  // Provide reactive data to child components
  provide("user", user);
  provide("annotations", annotations);

  // Track loading and error states
  const isContentLoaded = ref(false);
  const loadingError = ref(null);

  // Computed file for reactivity
  const file = computed(() => publicationFile.value);
  provide("file", file);

  // File settings
  const fileSettings = ref(null);
  provide("fileSettings", fileSettings);

  // Panel component management (disabled for public viewing)
  const showEditor = ref(false);
  const showSearch = ref(false);
  const showComponent = (compName) => {
    // Disable editor and search for public viewing
    // Can be customized later for preprint-specific panels
  };
  const hideComponent = (compName) => {
    // Disable editor and search for public viewing
  };

  // Sidebar drawer
  const drawerOpen = ref(false);
  provide("drawerOpen", drawerOpen);
  const sidebarWidth = computed(() => (drawerOpen.value ? "360px" : "64px"));

  // Focus Mode
  const focusMode = ref(false);
  provide("focusMode", focusMode);

  // Citation modal
  const showCitationModal = ref(false);
  const openCitationModal = () => {
    showCitationModal.value = true;
  };
  const closeCitationModal = () => {
    showCitationModal.value = false;
  };

  // Initialize preprint content
  onMounted(async () => {
    try {
      // Fetch preprint data
      const { file: fetchedFile, metadata } = await fetchPublicationData(identifier.value);

      // Render RSM content first
      const renderResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/render`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source: fetchedFile.source }),
      });
      if (!renderResponse.ok) {
        throw new Error(`Render failed: ${renderResponse.status}`);
      }
      fetchedFile.html = await renderResponse.json();

      publicationFile.value = fetchedFile;
      publicationMetadata.value = metadata;
      fileSettings.value = fetchedFile._settings;

      // Create file store
      fileStore.value = createPublicationFileStore(fetchedFile);
      provide("fileStore", fileStore);

      isContentLoaded.value = true;
    } catch (error) {
      console.error("Failed to load preprint:", error);
      loadingError.value = error;

      // Handle 404 errors for non-existent preprints
      if (error.message.includes("404")) {
        loadingError.value = new Error("Preprint not found or not published");
      }
    }
  });

  // Keyboard shortcuts
  useKeyboardShortcuts({
    c: () => (focusMode.value = !focusMode.value),
    q: () => openCitationModal(),
  });

  // Main sidebar collapsed state
  const sidebarIsCollapsed = ref(false);
  provide("sidebarIsCollapsed", sidebarIsCollapsed);

  // Development mode
  const isDev = ref(false);
  provide("isDev", isDev);
</script>

<template>
  <div class="ication-root">
    <!-- Preprint banner -->
    <div
      v-if="!focusMode && publicationMetadata"
      class="preprint-banner"
      data-testid="preprint-banner"
    >
      <div class="preprint-banner-content">
        <Icon name="FileText" icon-class="preprint-icon" />
        <span>Public Preprint</span>
        <div class="preprint-meta">
          <span v-if="publicationMetadata.authors">{{ publicationMetadata.authors }}</span>
          <span v-if="publicationMetadata.published_at">
            • Published {{ new Date(publicationMetadata.published_at).toLocaleDateString() }}
          </span>
        </div>
        <div class="preprint-actions">
          <button class="cite-button" data-testid="cite-button" @click="openCitationModal">
            <Icon name="Quote" />
            Cite
          </button>
          <a href="/" class="preprint-link" data-testid="preprint-home-link">← Back to Aris</a>
        </div>
      </div>
    </div>

    <div
      class="view ication-view"
      data-testid="ication-container"
      :class="{ focus: focusMode, mobile: mobileMode }"
    >
      <Sidebar @show-component="showComponent" @hide-component="hideComponent" />

      <!-- Loading state -->
      <div
        v-if="!isContentLoaded && !loadingError"
        class="ication-loading"
        data-testid="ication-loading"
      >
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <p>Loading preprint...</p>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="loadingError" class="ication-error" data-testid="ication-error">
        <div class="error-content">
          <Icon name="AlertCircle" icon-class="error-icon" />
          <h2>{{ loadingError.message }}</h2>
          <p>This preprint may not exist or has not been published yet.</p>
          <a href="/" class="error-link">← Back to Aris</a>
        </div>
      </div>

      <!-- Preprint canvas -->
      <Canvas
        v-else
        v-model="publicationFile"
        data-testid="ication-canvas"
        data-loaded="true"
        :show-editor="showEditor"
        :show-search="showSearch"
      />
    </div>

    <!-- Citation modal -->
    <CitationModal
      v-if="identifier && showCitationModal"
      :identifier="identifier"
      :is-open="showCitationModal"
      @close="closeCitationModal"
    />
  </div>
</template>

<style scoped>
  .ication-root {
    height: 100vh;
    width: 100vw;
    max-width: 100vw;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
  }

  .view {
    --transition-duration: 0.3s;
    --sidebar-width: v-bind(sidebarWidth);

    display: flex;
    width: 100%;
    max-width: 100vw;
    flex: 1;
    padding: 8px 8px 8px 0;
    will-change: padding;
    transition: padding var(--transition-duration) ease;
    position: relative;
    overflow-x: hidden;
  }

  .view.mobile {
    padding: 0;
  }

  .view.focus {
    padding: 0;
  }

  .outer {
    width: calc(100% - 64px);
    position: relative;
    left: var(--sidebar-width);
  }

  .view.mobile > .outer {
    width: 100%;
    left: 0;
  }

  .preprint-banner {
    background: linear-gradient(135deg, var(--green-100) 0%, var(--blue-100) 100%);
    border-bottom: 1px solid var(--border-primary);
    padding: 8px 16px;
    z-index: 1000;
    position: relative;
    flex-shrink: 0;
    min-height: 40px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }

  /* Push sidebar down to account for preprint banner */
  .ication-view :deep(.sb-wrapper) {
    top: 56px;
  }

  .preprint-banner-content {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--dark);
    width: 100%;
  }

  .preprint-icon {
    color: var(--green-600);
  }

  .preprint-meta {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--gray-600);
    font-size: 13px;
    margin-left: 8px;
  }

  .preprint-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-left: auto;
    flex-shrink: 0;
  }

  .cite-button {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--blue-600);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cite-button:hover {
    background: var(--blue-700);
    transform: translateY(-1px);
  }

  .cite-button:active {
    transform: translateY(0);
  }

  .preprint-link {
    color: var(--blue-600);
    text-decoration: none;
    flex-shrink: 0;
  }

  .preprint-link:hover {
    text-decoration: underline;
  }

  .ication-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
    min-height: 50vh;
  }

  .loading-content {
    text-align: center;
    color: var(--gray-600);
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--gray-200);
    border-top: 3px solid var(--primary-500);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
  }

  .ication-error {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
    min-height: 50vh;
  }

  .error-content {
    text-align: center;
    color: var(--gray-600);
  }

  .error-icon {
    color: var(--red-500);
    font-size: 48px;
    margin-bottom: 16px;
  }

  .error-content h2 {
    color: var(--gray-900);
    font-size: 24px;
    margin-bottom: 8px;
  }

  .error-content p {
    margin-bottom: 16px;
  }

  .error-link {
    color: var(--blue-600);
    text-decoration: none;
  }

  .error-link:hover {
    text-decoration: underline;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
