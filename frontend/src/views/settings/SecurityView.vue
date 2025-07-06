<script setup>
  import { IconLock } from "@tabler/icons-vue";
</script>

<template>
  <Pane>
    <template #header>
      <IconLock />
      <h1>Security Settings</h1>
    </template>
    <Section>
      <template #title>Security & Privacy</template>
      <template #content>
        <p class="section-description">
          For password changes and data management, please visit your Account settings.
        </p>

        <div class="redirect-info">
          <p><strong>Available in Account Settings:</strong></p>
          <ul>
            <li>Change password</li>
            <li>Email verification</li>
            <li>Export account data</li>
            <li>Delete account</li>
          </ul>

          <div class="redirect-actions">
            <router-link to="/account/security" class="action-button primary">
              Go to Account Security
            </router-link>
            <router-link to="/account/privacy" class="action-button secondary">
              Go to Account Privacy
            </router-link>
          </div>
          <Button :disabled="exportLoading" kind="secondary" @click="exportData">
            <IconDownload v-if="!exportLoading" />
            {{ exportLoading ? "Preparing download..." : "Download All My Data" }}
          </Button>
        </div>
      </template>
    </Section>
  </Pane>
</template>

<style scoped>
    :deep(.section) {
      width: 100%;
    }

    .section-description {
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    .redirect-info {
      max-width: 500px;
    }

    .redirect-info ul {
      margin: 16px 0 24px 16px;
      color: var(--text-secondary);
    }

    .redirect-info li {
      margin-bottom: 8px;
    }

    .redirect-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .action-button {
      text-decoration: none;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .action-button.primary {
      background: var(--surface-action);
      color: white;
    }

    .action-button.primary:hover {
      background: var(--surface-action-hover);
    }

    .action-button.secondary {
      background: var(--surface-page);
      color: var(--text-primary);
      border: var(--border-thin) solid var(--border-primary);
    }

    .action-button.secondary:hover {
      background: var(--surface-hover);
    }
</style>
