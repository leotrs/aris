<script setup>
  import { computed } from "vue";

  const props = defineProps({
    preprint: {
      type: Object,
      required: true,
    },
    citationData: {
      type: Object,
      required: true,
    },
  });

  // Format publication date
  const formattedDate = computed(() => {
    if (!props.preprint.published_at) return "Not published";

    return new Date(props.preprint.published_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Extract authors (placeholder until proper author model is implemented)
  const authors = computed(() => {
    // TODO: Replace with proper author extraction when author model is available
    return [
      {
        name: props.citationData.authors || "Unknown Author",
        affiliation: null,
        orcid: null,
        email: null,
        isCorresponding: false,
      },
    ];
  });

  // Generate permalink URL
  const permalinkUrl = computed(() => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/ication/${props.preprint.public_uuid}`;
  });

  // Generate DOI URL (placeholder)
  const doiUrl = computed(() => {
    // TODO: Add DOI support when available
    return null;
  });

  // Format keywords
  const keywordsList = computed(() => {
    if (!props.preprint.keywords) return [];
    return props.preprint.keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k);
  });
</script>

<template>
  <div class="author-metadata-display">
    <!-- Authors Section -->
    <div class="metadata-section">
      <h4 class="section-title">
        <Icon name="Users" class="section-icon" />
        Authors
      </h4>
      <div class="authors-list">
        <div v-for="(author, index) in authors" :key="index" class="author-item">
          <div class="author-info">
            <span class="author-name">{{ author.name }}</span>
            <span v-if="author.isCorresponding" class="corresponding-badge">
              Corresponding Author
            </span>
          </div>

          <div v-if="author.affiliation" class="author-affiliation">
            <Icon name="Building" class="affiliation-icon" />
            {{ author.affiliation }}
          </div>

          <div class="author-links">
            <a v-if="author.email" :href="`mailto:${author.email}`" class="author-link">
              <Icon name="Mail" />
              {{ author.email }}
            </a>

            <a
              v-if="author.orcid"
              :href="author.orcid"
              target="_blank"
              class="author-link orcid-link"
            >
              <Icon name="ExternalLink" />
              ORCID
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Publication Details -->
    <div class="metadata-section">
      <h4 class="section-title">
        <Icon name="FileText" class="section-icon" />
        Publication Details
      </h4>
      <div class="publication-grid">
        <div class="detail-item">
          <span class="detail-label">Published:</span>
          <span class="detail-value">{{ formattedDate }}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">Publisher:</span>
          <span class="detail-value">Aris Preprint</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">Version:</span>
          <span class="detail-value">{{ preprint.version || 1 }}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">Preprint ID:</span>
          <span class="detail-value preprint-id">{{ preprint.public_uuid }}</span>
        </div>

        <div v-if="doiUrl" class="detail-item">
          <span class="detail-label">DOI:</span>
          <a :href="doiUrl" target="_blank" class="detail-value detail-link">
            {{ preprint.doi }}
          </a>
        </div>

        <div class="detail-item">
          <span class="detail-label">Permalink:</span>
          <a :href="permalinkUrl" class="detail-value detail-link">
            {{ permalinkUrl }}
          </a>
        </div>
      </div>
    </div>

    <!-- Keywords Section -->
    <div v-if="keywordsList.length" class="metadata-section">
      <h4 class="section-title">
        <Icon name="Tags" class="section-icon" />
        Keywords
      </h4>
      <div class="keywords-container">
        <span v-for="keyword in keywordsList" :key="keyword" class="keyword-tag">
          {{ keyword }}
        </span>
      </div>
    </div>

    <!-- Abstract Section -->
    <div v-if="preprint.abstract" class="metadata-section">
      <h4 class="section-title">
        <Icon name="AlignLeft" class="section-icon" />
        Abstract
      </h4>
      <div class="abstract-content">
        {{ preprint.abstract }}
      </div>
    </div>

    <!-- License Section -->
    <div class="metadata-section">
      <h4 class="section-title">
        <Icon name="Scale" class="section-icon" />
        License
      </h4>
      <div class="license-content">
        <span class="license-text">All rights reserved</span>
        <span class="license-note">© {{ new Date().getFullYear() }} {{ authors[0]?.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .author-metadata-display {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .metadata-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--gray-900);
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-primary);
  }

  .section-icon {
    color: var(--primary-600);
    font-size: 18px;
  }

  .authors-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .author-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 12px;
    background: var(--gray-50);
    border-radius: 8px;
  }

  .author-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .author-name {
    font-weight: 600;
    color: var(--gray-900);
  }

  .corresponding-badge {
    background: var(--blue-100);
    color: var(--blue-700);
    font-size: 11px;
    font-weight: 500;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .author-affiliation {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--gray-600);
  }

  .affiliation-icon {
    color: var(--gray-500);
    font-size: 14px;
  }

  .author-links {
    display: flex;
    gap: 12px;
    margin-top: 4px;
  }

  .author-link {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--blue-600);
    text-decoration: none;
    font-size: 13px;
    transition: color 0.2s ease;
  }

  .author-link:hover {
    color: var(--blue-700);
    text-decoration: underline;
  }

  .author-link svg {
    font-size: 12px;
  }

  .orcid-link {
    color: var(--green-600);
  }

  .orcid-link:hover {
    color: var(--green-700);
  }

  .publication-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 12px;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .detail-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--gray-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .detail-value {
    font-size: 14px;
    color: var(--gray-900);
  }

  .detail-value.preprint-id {
    font-family: var(--font-mono);
    font-size: 13px;
  }

  .detail-link {
    color: var(--blue-600);
    text-decoration: none;
    word-break: break-all;
  }

  .detail-link:hover {
    color: var(--blue-700);
    text-decoration: underline;
  }

  .keywords-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .keyword-tag {
    background: var(--primary-100);
    color: var(--primary-700);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  .abstract-content {
    font-size: 14px;
    line-height: 1.6;
    color: var(--gray-700);
    background: var(--gray-50);
    padding: 16px;
    border-radius: 8px;
    border-left: 4px solid var(--primary-500);
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
