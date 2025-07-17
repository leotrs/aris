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
  const activeFormat = ref("APA");
  const formatOptions = ["APA", "BibTeX", "Chicago", "MLA"];

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
  const copyCitation = async () => {
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
  const downloadBibTeX = () => {
    const link = document.createElement("a");
    link.href = bibtexDownloadUrl.value;
    link.download = `${props.identifier}.bib`;
    link.click();
  };

  // Handle format change
  const handleFormatChange = (index) => {
    activeFormat.value = formatOptions[index];
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
  <Modal
    :is-open="isOpen"
    :title="citationData?.title || 'Citation'"
    :width="700"
    @close="handleClose"
    @open="handleModalOpen"
  >
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
      <div v-else-if="citationData" class="citation-content">
        <!-- Format selector -->
        <div class="format-selector">
          <SegmentedControl
            :labels="formatOptions"
            :default-active="0"
            @change="handleFormatChange"
          />
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

          <!-- Action buttons -->
          <div class="citation-actions">
            <Button
              :icon="copySuccess ? 'Check' : 'Copy'"
              size="sm"
              kind="secondary"
              :class="{ 'copy-success': copySuccess }"
              @click="copyCitation"
            >
              {{ copyButtonText }}
            </Button>

            <Button
              v-if="activeFormat === 'BibTeX'"
              icon="Download"
              size="sm"
              kind="secondary"
              @click="downloadBibTeX"
            >
              Download .bib
            </Button>
          </div>
        </div>

        <!-- Reference manager section -->
        <div class="reference-manager-section">
          <h4>Export to Reference Manager</h4>
          <div class="export-options">
            <Button
              icon="FileText"
              size="sm"
              kind="tertiary"
              class="export-button"
              @click="downloadBibTeX"
            >
              <div class="export-button-content">
                <span>BibTeX (.bib)</span>
                <span class="export-note">For Zotero, Mendeley, LaTeX</span>
              </div>
            </Button>
          </div>
        </div>

        <!-- Author and metadata section -->
        <div class="metadata-section">
          <h4>Publication Information</h4>
          <AuthorMetadataDisplay
            :preprint="citationData"
            :citation-data="citationData.citation_info"
          />
        </div>

        <!-- SEO notice -->
        <div class="seo-notice">
          <Icon name="Info" class="info-icon" />
          <p>
            This preprint is also available as a
            <a :href="staticHtmlUrl" target="_blank" class="static-link">
              search engine optimized page
            </a>
            for academic indexing.
          </p>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
  .citation-modal {
    padding: 20px;
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

  .format-selector {
    display: flex;
    justify-content: center;
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

  .citation-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  .copy-success {
    color: var(--green-600) !important;
  }

  .reference-manager-section {
    border-top: 1px solid var(--border-primary);
    padding-top: 20px;
  }

  .reference-manager-section h4 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
  }

  .export-options {
    display: flex;
    gap: 12px;
  }

  .export-button {
    flex: 1;
    min-width: 0;
  }

  .export-button-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .export-note {
    font-size: 12px;
    color: var(--gray-500);
    font-weight: normal;
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

  .seo-notice {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--blue-50);
    border: 1px solid var(--blue-200);
    border-radius: 8px;
    padding: 12px;
    font-size: 13px;
    color: var(--blue-800);
  }

  .info-icon {
    color: var(--blue-600);
    flex-shrink: 0;
  }

  .static-link {
    color: var(--blue-600);
    text-decoration: underline;
  }

  .static-link:hover {
    color: var(--blue-700);
  }
</style>
