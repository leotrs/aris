<script setup>
  import { ref, computed, onMounted } from "vue";
  import { fetchCitationMetadata } from "@/views/ication/publicationData.js";
  import AuthorMetadataDisplay from "./AuthorMetadataDisplay.vue";

  const props = defineProps({
    identifier: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(["close"]);

  // Citation data and loading state
  const citationData = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // Active citation format
  const activeFormatIndex = ref(0);
  const formatOptions = ["APA", "Chicago", "MLA", "BibTeX"];
  const activeFormat = computed(() => formatOptions[activeFormatIndex.value]);

  // Copy functionality
  const copySuccess = ref(false);
  const citationTextRef = ref(null);

  // Computed citation content
  const formattedCitation = computed(() => {
    if (!citationData.value?.citation_info?.formats) return "";

    const format = activeFormat.value.toLowerCase();
    return citationData.value.citation_info.formats[format] || "";
  });

  // Copy button text
  const copyButtonText = computed(() => {
    return copySuccess.value ? "Copied!" : "Copy Citation";
  });

  // Static HTML URL
  const staticHtmlUrl = computed(() => {
    return `/ication/${props.identifier}/static-html`;
  });

  // BibTeX download URL
  const bibtexDownloadUrl = computed(() => {
    return `/api/ication/${props.identifier}/export/bibtex`;
  });

  // Fetch citation metadata
  const fetchCitationData = async () => {
    if (!props.identifier) return;

    isLoading.value = true;
    error.value = null;

    try {
      const data = await fetchCitationMetadata(props.identifier);
      citationData.value = data;
    } catch (err) {
      error.value = err.message || "Failed to load citation data";
      console.error("Citation fetch error:", err);
    } finally {
      isLoading.value = false;
    }
  };

  // Copy citation to clipboard
  const copyCitation = async (event) => {
    event.stopPropagation();
    if (!formattedCitation.value) return;

    try {
      await navigator.clipboard.writeText(formattedCitation.value);
      copySuccess.value = true;
      setTimeout(() => {
        copySuccess.value = false;
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = formattedCitation.value;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        copySuccess.value = true;
        setTimeout(() => {
          copySuccess.value = false;
        }, 2000);
      } catch (fallbackErr) {
        console.error("Copy failed:", fallbackErr);
      }
    }
  };

  // Download BibTeX file
  const downloadBibTeX = (event) => {
    event.stopPropagation();
    const link = document.createElement("a");
    link.href = bibtexDownloadUrl.value;
    link.download = `${props.identifier}.bib`;
    link.click();
  };

  // Handle format change from SegmentedControl
  const handleFormatChange = (event) => {
    // Prevent modal from closing when changing formats
    event?.stopPropagation();
    // The activeFormatIndex is handled by v-model automatically
  };

  // Watch for modal open/close
  onMounted(() => {
    if (props.isOpen) {
      fetchCitationData();
    }
  });

  // Refetch when modal opens
  const handleModalOpen = () => {
    fetchCitationData();
  };

  // Close modal
  const handleClose = () => {
    emit("close");
  };
</script>

<template>
  <Modal :is-open="isOpen" :width="700" @close="handleClose" @open="handleModalOpen">
    <template #header>
      <div class="modal-header">
        <span class="header-title">Cite</span>
        <Button
          icon="X"
          size="sm"
          kind="tertiary"
          data-testid="close-modal-button"
          @click="handleClose"
        />
      </div>
    </template>
    <div class="citation-modal">
      <!-- Loading state -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading citation data...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-state">
        <Icon name="AlertCircle" class="error-icon" />
        <p>{{ error }}</p>
        <Button size="sm" kind="secondary" @click="fetchCitationData"> Try Again </Button>
      </div>

      <!-- Citation content -->
      <div v-else-if="citationData" class="citation-content" @click.stop>
        <!-- Format selector with inline action buttons -->
        <div class="format-controls" @click.stop>
          <div class="format-selector">
            <SegmentedControl
              v-model="activeFormatIndex"
              :labels="formatOptions"
              :default-active="0"
              @change="handleFormatChange"
            />
          </div>

          <div class="citation-actions">
            <Button
              :icon="copySuccess ? 'Check' : 'Copy'"
              size="sm"
              kind="secondary"
              :class="{ 'copy-success': copySuccess }"
              data-testid="copy-citation-button"
              @click="copyCitation"
            />

            <Button
              v-if="activeFormat === 'BibTeX'"
              icon="Download"
              size="sm"
              kind="secondary"
              data-testid="download-bibtex-button"
              @click="downloadBibTeX"
            />
          </div>
        </div>

        <!-- Citation display -->
        <div class="citation-display">
          <div
            ref="citationTextRef"
            class="citation-text"
            :class="{ 'bibtex-format': activeFormat === 'BibTeX' }"
          >
            {{ formattedCitation }}
          </div>
        </div>

        <!-- Author and metadata section -->
        <div class="metadata-section">
          <h4>Publication Information</h4>
          <AuthorMetadataDisplay
            :preprint="citationData"
            :citation-data="citationData.citation_info"
            :show-abstract="false"
            :show-license="false"
          />
        </div>

        <!-- Links section -->
        <div class="links-section">
          <h4>Links</h4>
          <div class="links-list">
            <div class="link-item">
              <a :href="`/ication/${props.identifier}`" class="link">
                <Icon name="Link" class="link-icon" />
                Permalink
              </a>
            </div>
            <div class="link-item">
              <a :href="staticHtmlUrl" target="_blank" class="link">
                <Icon name="Search" class="link-icon" />
                SEO-optimized version
              </a>
            </div>
            <div class="link-item">
              <a href="#" class="link disabled">
                <Icon name="Crown" class="link-icon" />
                Premium link
                <span class="upgrade-note">Upgrade to Pro</span>
              </a>
            </div>
          </div>
        </div>

        <!-- License section -->
        <div class="license-section">
          <h4>License</h4>
          <div class="license-content">
            <span class="license-text">All rights reserved</span>
            <span class="license-note">© {{ new Date().getFullYear() }} Unknown Author</span>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .header-title {
    font-weight: 600;
    color: var(--gray-900);
    flex: 1;
  }

  .citation-modal {
    padding: 0;
    padding-inline: 8px;
  }

  .loading-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--gray-600);
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--gray-200);
    border-top: 3px solid var(--primary-500);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .error-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--red-600);
  }

  .error-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .citation-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .format-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .format-selector {
    flex: 1;
    display: flex;
    justify-content: flex-start;
  }

  .citation-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }

  .citation-display {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .citation-text {
    background: var(--gray-50);
    border: 1px solid var(--border-primary);
    border-radius: 8px;
    padding: 16px;
    font-family: var(--font-mono);
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-900);
    min-height: 60px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .citation-text.bibtex-format {
    font-size: 13px;
    line-height: 1.4;
  }

  @media (max-width: 500px) {
    .format-controls {
      flex-direction: column;
      gap: 12px;
    }

    .format-selector {
      justify-content: flex-start;
    }

    .citation-actions {
      justify-content: flex-start;
    }
  }

  .copy-success {
    color: var(--green-600) !important;
  }

  .metadata-section {
    border-top: 1px solid var(--border-primary);
    padding-top: 20px;
  }

  .metadata-section h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .links-section {
    border-top: 1px solid var(--border-primary);
    padding-top: 20px;
  }

  .links-section h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .links-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .link-item {
    display: flex;
    align-items: center;
  }

  .link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--blue-600);
    text-decoration: none;
    font-size: 14px;
    padding: 8px 12px;
    border-radius: 6px;
    transition: background-color 0.2s;
  }

  .link:hover:not(.disabled) {
    background-color: var(--blue-50);
    color: var(--blue-700);
  }

  .link.disabled {
    color: var(--gray-400);
    cursor: not-allowed;
  }

  .link-icon {
    flex-shrink: 0;
    font-size: 16px;
  }

  .upgrade-note {
    margin-left: auto;
    font-size: 12px;
    color: var(--orange-600);
    background: var(--orange-50);
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 500;
  }

  .license-section {
    border-top: 1px solid var(--border-primary);
    padding-top: 20px;
  }

  .license-section h4 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .license-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .license-text {
    font-size: 14px;
    color: var(--gray-900);
    font-weight: 500;
  }

  .license-note {
    font-size: 12px;
    color: var(--gray-600);
  }
</style>
