<script setup>
  import { ref, inject } from "vue";
  import { toast } from "@/utils/toast.js";

  const user = inject("user");
  const api = inject("api");

  // Data export
  const isExporting = ref(false);

  const onExportData = async () => {
    if (isExporting.value) return;
    isExporting.value = true;

    try {
      const response = await api.get(`/users/${user.value.id}/export`, {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${user.value.name}-data-export.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Data export downloaded successfully");
    } catch (error) {
      console.error("Failed to export data", error);
      toast.error("Failed to export data", {
        description: "Please try again later.",
      });
    } finally {
      isExporting.value = false;
    }
  };

  // Account deletion
  const showDeleteConfirm = ref(false);
  const deleteConfirmText = ref("");
  const isDeletingAccount = ref(false);

  const onDeleteAccount = async () => {
    if (isDeletingAccount.value) return;

    if (deleteConfirmText.value !== "DELETE") {
      toast.error('Please type "DELETE" to confirm account deletion');
      return;
    }

    isDeletingAccount.value = true;

    try {
      await api.delete(`/users/${user.value.id}`);
      toast.success("Account deleted successfully");
      // Redirect to logout or home page
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to delete account", error);
      toast.error("Failed to delete account", {
        description: "Please try again later.",
      });
    } finally {
      isDeletingAccount.value = false;
    }
  };
</script>

<template>
  <Pane>
    <template #header>
      <Icon name="Eye" />
      <span class="title">Privacy</span>
    </template>

    <div class="privacy-layout">
      <!-- Data Management -->
      <div class="content-section">
        <div class="section-header">
          <h2>Data Management</h2>
          <p>Export or delete your account data</p>
        </div>

        <div class="data-actions">
          <div class="data-action">
            <div class="action-content">
              <h3>Export Your Data</h3>
              <p>Download a copy of all your account data, research, and settings</p>
            </div>
            <Button
              kind="tertiary"
              :icon="isExporting ? 'Loader2' : 'Download'"
              :disabled="isExporting"
              @click="onExportData"
            >
              {{ isExporting ? "Exporting..." : "Export Data" }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="content-section danger-zone">
        <div class="section-header">
          <h3>Danger Zone</h3>
          <p>Irreversible and destructive actions</p>
        </div>

        <div class="danger-content">
          <div class="danger-action">
            <div class="action-content">
              <h3>Delete Account</h3>
              <p>
                Permanently delete your account and all associated data. This action cannot be
                undone.
              </p>
            </div>

            <div v-if="!showDeleteConfirm" class="action-button">
              <Button kind="secondary" icon="Trash" @click="showDeleteConfirm = true">
                Delete Account
              </Button>
            </div>

            <div v-else class="delete-confirm">
              <div class="confirm-input">
                <InputText
                  v-model="deleteConfirmText"
                  label="Type 'DELETE' to confirm"
                  placeholder="DELETE"
                  direction="column"
                />
              </div>
              <div class="confirm-actions">
                <Button
                  kind="tertiary"
                  @click="
                    showDeleteConfirm = false;
                    deleteConfirmText = '';
                  "
                >
                  Cancel
                </Button>
                <Button
                  kind="secondary"
                  :icon="isDeletingAccount ? 'Loader2' : 'Trash'"
                  :disabled="isDeletingAccount || deleteConfirmText !== 'DELETE'"
                  @click="onDeleteAccount"
                >
                  {{ isDeletingAccount ? "Deleting..." : "Delete Forever" }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Pane>
</template>

<style scoped>
  /* Header Title */
  .title {
    margin-left: 8px;
    font-weight: var(--weight-medium);
  }

  /* Privacy Layout Container */
  .privacy-layout {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* Content Section */
  .content-section {
    background: var(--surface-primary);
    border-radius: 16px;
    border: var(--border-thin) solid var(--gray-200);
    box-shadow: none;
    padding: 24px;
    transition: box-shadow 0.2s ease;
  }

  .content-section:hover {
    box-shadow: var(--shadow-soft);
  }

  .section-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: var(--border-thin) solid var(--gray-200);
  }

  .section-header h2 {
    font-size: 20px;
    font-weight: var(--weight-semi);
    color: var(--gray-900);
    margin: 0 0 4px 0;
  }

  .section-header h3 {
    font-size: 18px;
    font-weight: var(--weight-semi);
    color: var(--gray-900);
    margin: 0 0 4px 0;
  }

  .section-header p {
    font-size: 14px;
    color: var(--gray-600);
    margin: 0;
  }

  /* Data Management */
  .data-actions {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .data-action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
    border: var(--border-thin) solid var(--gray-200);
    border-radius: 12px;
  }

  .action-content {
    flex: 1;
    min-width: 0;
  }

  .action-content h3 {
    font-size: 14px;
    font-weight: var(--weight-medium);
    color: var(--gray-900);
    margin: 0 0 4px 0;
  }

  .action-content p {
    font-size: 13px;
    color: var(--gray-600);
    margin: 0;
  }

  /* Danger Zone */
  .danger-zone {
    border-color: var(--red-200) !important;
  }

  .danger-zone .section-header {
    border-bottom-color: var(--red-100);
  }

  .danger-zone .section-header h3 {
    color: var(--red-700);
  }

  .danger-zone .section-header p {
    color: var(--red-600);
  }

  .danger-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .danger-action {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .danger-action .action-content h3 {
    color: var(--red-700);
  }

  .danger-action .action-content p {
    color: var(--red-600);
  }

  .action-button {
    align-self: flex-start;
  }

  .action-button :deep(button.secondary) {
    background-color: var(--red-500) !important;
    border-color: var(--red-500) !important;
    color: white !important;
  }

  .action-button :deep(button.secondary:hover) {
    background-color: var(--red-600) !important;
    border-color: var(--red-600) !important;
  }

  .delete-confirm {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    background-color: var(--red-50);
    border: var(--border-thin) solid var(--red-200);
    border-radius: 8px;
  }

  .confirm-input {
    max-width: 200px;
  }

  .confirm-actions {
    display: flex;
    gap: 12px;
  }

  .confirm-actions :deep(button.secondary) {
    background-color: var(--red-500) !important;
    border-color: var(--red-500) !important;
    color: white !important;
  }

  .confirm-actions :deep(button.secondary:hover) {
    background-color: var(--red-600) !important;
    border-color: var(--red-600) !important;
  }

  /* Loading states */
  :deep(.tabler-icon-loader-2) {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .content-section {
      padding: 20px;
    }

    .data-action {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .confirm-actions {
      flex-direction: column;
      gap: 8px;
    }
  }

  @media (max-width: 480px) {
    .content-section {
      padding: 16px;
    }
  }
</style>
