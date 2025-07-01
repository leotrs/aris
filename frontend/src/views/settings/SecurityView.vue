<script setup>
  import { ref, inject } from "vue";
  import { IconDownload, IconLock } from "@tabler/icons-vue";

  const api = inject("api");
  const user = inject("user");

  const passwordForm = ref({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const changePasswordLoading = ref(false);
  const changePasswordSuccess = ref(false);
  const changePasswordError = ref("");

  const exportLoading = ref(false);
  const exportSuccess = ref(false);

  const changePassword = async () => {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      changePasswordError.value = "New passwords do not match";
      return;
    }

    if (passwordForm.value.newPassword.length < 8) {
      changePasswordError.value = "New password must be at least 8 characters long";
      return;
    }

    changePasswordLoading.value = true;
    changePasswordError.value = "";
    changePasswordSuccess.value = false;

    try {
      await api.post("/auth/change-password", {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword,
      });

      changePasswordSuccess.value = true;
      passwordForm.value = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      };

      setTimeout(() => {
        changePasswordSuccess.value = false;
      }, 3000);
    } catch (error) {
      if (error.response?.status === 401) {
        changePasswordError.value = "Current password is incorrect";
      } else {
        changePasswordError.value = "Failed to change password. Please try again.";
      }
    } finally {
      changePasswordLoading.value = false;
    }
  };

  const exportData = async () => {
    exportLoading.value = true;
    exportSuccess.value = false;

    try {
      const response = await api.get("/users/export-data", {
        responseType: "blob",
      });

      // Create download link
      const blob = new Blob([response.data], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const timestamp = new Date().toISOString().split("T")[0];
      link.download = `aris-data-export-${timestamp}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      exportSuccess.value = true;
      setTimeout(() => {
        exportSuccess.value = false;
      }, 3000);
    } catch (error) {
      console.error("Failed to export data:", error);
    } finally {
      exportLoading.value = false;
    }
  };
</script>

<template>
  <Pane>
    <template #header>
      <IconLock />
      <span class="title">Account Security</span>
    </template>
    <Section>
      <template #title>Change Password</template>
      <template #content>
        <p class="section-description">Update your password to keep your account secure</p>

        <form class="password-form" @submit.prevent="changePassword">
          <div class="form-group">
            <label for="current-password">Current Password</label>
            <input
              id="current-password"
              v-model="passwordForm.currentPassword"
              type="password"
              autocomplete="current-password"
              required
            />
          </div>

          <div class="form-group">
            <label for="new-password">New Password</label>
            <input
              id="new-password"
              v-model="passwordForm.newPassword"
              type="password"
              autocomplete="new-password"
              required
              minlength="8"
            />
            <p class="field-description">Must be at least 8 characters long</p>
          </div>

          <div class="form-group">
            <label for="confirm-password">Confirm New Password</label>
            <input
              id="confirm-password"
              v-model="passwordForm.confirmPassword"
              type="password"
              autocomplete="new-password"
              required
            />
          </div>

          <div v-if="changePasswordError" class="error-message">
            {{ changePasswordError }}
          </div>

          <div v-if="changePasswordSuccess" class="success-message">
            Password changed successfully!
          </div>

          <button
            type="submit"
            :disabled="
              changePasswordLoading ||
              !passwordForm.currentPassword ||
              !passwordForm.newPassword ||
              !passwordForm.confirmPassword
            "
            class="action-button primary"
          >
            {{ changePasswordLoading ? "Changing..." : "Change Password" }}
          </button>
        </form>
      </template>
    </Section>

    <Section>
      <template #title>Download Your Data</template>
      <template #content>
        <p class="section-description">
          Download a copy of all your account data including manuscripts, settings, and metadata
        </p>

        <div class="data-export">
          <div class="export-info">
            <p><strong>What's included:</strong></p>
            <ul>
              <li>All your manuscripts and their content</li>
              <li>File settings and preferences</li>
              <li>Tags and organizational data</li>
              <li>Account information and settings</li>
              <li>Upload history and file assets</li>
            </ul>
            <p class="export-note">
              The export will be provided as a JSON file that you can download immediately.
            </p>
          </div>

          <div v-if="exportSuccess" class="success-message">
            Your data has been downloaded successfully!
          </div>

          <button :disabled="exportLoading" class="action-button secondary" @click="exportData">
            <IconDownload v-if="!exportLoading" />
            {{ exportLoading ? "Preparing download..." : "Download All My Data" }}
          </button>
        </div>
      </template>
    </Section>
  </Pane>
</template>

<style scoped>
  :deep(.section) {
    width: 100%;
  }

  .password-form {
    max-width: 400px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 6px;
  }

  .form-group input {
    width: 100%;
    padding: 10px 12px;
    border: var(--border-thin) solid var(--border-primary);
    border-radius: 6px;
    background: var(--surface-page);
    color: var(--text-primary);
    font-size: 14px;
  }

  .form-group input:focus {
    outline: none;
    border-color: var(--border-action);
  }

  .field-description {
    color: var(--text-secondary);
    font-size: 12px;
    margin: 4px 0 0 0;
  }

  .error-message {
    color: var(--error-700);
    font-size: 14px;
    margin-bottom: 16px;
    padding: 8px 12px;
    background: var(--error-50);
    border: var(--border-thin) solid var(--error-200);
    border-radius: 6px;
  }

  .success-message {
    color: var(--success-600);
    font-size: 14px;
    margin-bottom: 16px;
    padding: 8px 12px;
    background: var(--success-50);
    border: var(--border-thin) solid var(--success-200);
    border-radius: 6px;
  }

  .action-button {
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

  .action-button.primary:hover:not(:disabled) {
    background: var(--surface-action-hover);
  }

  .action-button.secondary {
    background: var(--surface-page);
    color: var(--text-primary);
    border: var(--border-thin) solid var(--border-primary);
  }

  .action-button.secondary:hover:not(:disabled) {
    background: var(--surface-hover);
  }

  .action-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .data-export {
    max-width: 500px;
  }

  .export-info {
    margin-bottom: 24px;
  }

  .export-info ul {
    margin: 8px 0 16px 16px;
    color: var(--text-secondary);
  }

  .export-info li {
    margin-bottom: 4px;
  }

  .export-note {
    color: var(--text-secondary);
    font-size: 13px;
    font-style: italic;
  }
</style>
