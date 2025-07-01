<script setup>
  import { ref, computed, inject, onMounted, onUnmounted, watch } from "vue";
  import { useRoute } from "vue-router";
  import { IconUserCircle } from "@tabler/icons-vue";
  import { toast } from "@/utils/toast.js";
  import PasswordStrength from "@/components/ui/PasswordStrength.vue";

  const xsMode = inject("xsMode");
  const mobileMode = inject("mobileMode");
  const user = inject("user");
  const api = inject("api");
  const route = useRoute();

  // Profile section form submission
  const newName = ref(null);
  const newInitials = ref(null);
  const newEmail = ref(null);
  const isSaving = ref(false);

  // Password change functionality
  const currentPassword = ref("");
  const newPassword = ref("");
  const confirmPassword = ref("");
  const isChangingPassword = ref(false);

  // Dirty state tracking
  const hasUnsavedProfileChanges = computed(() => {
    return !!(
      (newName.value && newName.value !== user.value?.name) ||
      (newInitials.value && newInitials.value !== user.value?.initials) ||
      (newEmail.value && newEmail.value !== user.value?.email)
    );
  });

  const hasUnsavedPasswordChanges = computed(() => {
    return !!(currentPassword.value || newPassword.value || confirmPassword.value);
  });

  const hasUnsavedChanges = computed(() => {
    return hasUnsavedProfileChanges.value || hasUnsavedPasswordChanges.value;
  });

  const onSave = async () => {
    if (isSaving.value) return;
    isSaving.value = true;
    try {
      const payload = {
        name: newName.value || user.value.name,
        initials: newInitials.value || user.value.initials,
        email: newEmail.value || user.value.email,
      };

      const res = await api.put(`/users/${user.value.id}`, payload);
      Object.assign(user.value, res.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update user", error);
      toast.error("Failed to update profile", {
        description: "Please check your connection and try again.",
      });
    } finally {
      isSaving.value = false;
    }
  };

  const onDiscard = () => {
    if (!hasUnsavedChanges.value) return;

    if (confirm("Are you sure you want to discard your unsaved changes?")) {
      // Reset profile fields
      newName.value = null;
      newInitials.value = null;
      newEmail.value = null;

      // Reset password fields
      currentPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";

      toast.info("Changes discarded");
    }
  };

  const onChangePassword = async () => {
    if (isChangingPassword.value) return;

    // Basic validation
    if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.value.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    isChangingPassword.value = true;

    try {
      await api.post(`/users/${user.value.id}/change-password`, {
        current_password: currentPassword.value,
        new_password: newPassword.value,
      });

      // Clear password fields
      currentPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";

      toast.success("Password changed successfully");
    } catch (error) {
      console.error("Failed to change password", error);
      if (error.response?.status === 401) {
        toast.error("Current password is incorrect");
      } else {
        toast.error("Failed to change password", {
          description: "Please check your connection and try again.",
        });
      }
    } finally {
      isChangingPassword.value = false;
    }
  };

  // Profile picture upload
  const fileInputRef = ref(null);
  const selectedFile = ref(null);
  const localPreviewUrl = ref(null);
  const serverAvatarUrl = ref(null);
  const isUploadingAvatar = ref(false);

  const fetchAvatar = async () => {
    if (!user.value) return;
    try {
      const response = await api.get(`/users/${user.value.id}/avatar`, {
        responseType: "blob",
      });
      if (serverAvatarUrl.value) {
        URL.revokeObjectURL(serverAvatarUrl.value);
      }
      serverAvatarUrl.value = URL.createObjectURL(response.data);
    } catch (error) {
      // Silent failure for avatar fetch - this is expected when user has no avatar
      console.log("No avatar found or error fetching avatar:", error);
      serverAvatarUrl.value = null;
    }
  };

  const previewUrl = computed(() =>
    localPreviewUrl.value ? localPreviewUrl.value : serverAvatarUrl.value || ""
  );

  const onUpload = () => fileInputRef.value?.click();

  const onFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (isUploadingAvatar.value) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    selectedFile.value = file;
    isUploadingAvatar.value = true;

    // Create new preview URL
    if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
    localPreviewUrl.value = URL.createObjectURL(file);

    // Upload the file immediately
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      await api.post(`/users/${user.value.id}/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Avatar updated successfully");

      // Clear local preview and refetch from server
      setTimeout(async () => {
        if (localPreviewUrl.value) {
          URL.revokeObjectURL(localPreviewUrl.value);
          localPreviewUrl.value = null;
        }
        // Refetch the avatar from server
        await fetchAvatar();
      }, 500);
    } catch (error) {
      console.error("Failed to upload avatar", error);
      toast.error("Failed to upload avatar", {
        description: "Please check your connection and try again.",
      });
    } finally {
      isUploadingAvatar.value = false;
    }
  };

  // Warn before leaving with unsaved changes
  const handleBeforeUnload = (e) => {
    if (hasUnsavedChanges.value) {
      e.preventDefault();
      e.returnValue = "";
      return "";
    }
  };

  // Watch for unsaved changes and add/remove beforeunload listener
  watch(hasUnsavedChanges, (hasChanges) => {
    if (hasChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  });

  // Lifecycle
  onMounted(() => fetchAvatar());
  onUnmounted(() => {
    if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
    if (serverAvatarUrl.value) URL.revokeObjectURL(serverAvatarUrl.value);
    window.removeEventListener("beforeunload", handleBeforeUnload);
  });

  // Sidebar navigation items for account view
  const accountSidebarItems = computed(() => [
    {
      icon: "Home",
      text: "Home",
      active: route.path === "/",
      route: "/",
    },
    { separator: true },
    { includeRecentFiles: true },
    { separator: true },
    {
      icon: "User",
      text: "Account",
      active: route.path === "/account",
      route: "/account",
    },
    {
      icon: "Settings",
      text: "Settings",
      active: route.path === "/settings",
      route: "/settings",
    },
    { separator: true },
    {
      icon: "LayoutSidebarLeftCollapse",
      iconCollapsed: "LayoutSidebarLeftExpand",
      text: "Collapse",
      tooltip: "Expand",
      action: "collapse",
    },
  ]);
</script>

<template>
  <BaseLayout :sidebar-items="accountSidebarItems" :fab="false">
    <Pane>
      <template #header>
        <Icon name="User" />
        <span class="title">Account</span>
      </template>

      <div class="account-layout">
        <!-- Hero Section: Profile Overview -->
        <div class="hero-section">
          <div class="profile-hero">
            <div class="avatar-container">
              <div
                class="avatar"
                :style="{
                  backgroundImage: previewUrl ? `url(${previewUrl})` : 'none',
                }"
              >
                <div v-if="!previewUrl" class="avatar-placeholder">
                  <Icon name="User" size="32" />
                </div>
                <Button
                  kind="tertiary"
                  :icon="isUploadingAvatar ? 'Loader2' : 'Camera'"
                  class="avatar-upload"
                  size="sm"
                  :disabled="isUploadingAvatar"
                  @click="onUpload"
                />
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="onFileSelected"
                />
              </div>
            </div>
            <div class="profile-info">
              <h1 class="user-name">{{ user.name }}</h1>
              <p class="user-email">{{ user.email }}</p>
              <div class="user-meta">
                <span class="affiliation">Prestigious University or Institute</span>
                <span class="member-since">
                  <Icon name="Calendar" size="14" />
                  Member since {{ new Date(user.created_at).toLocaleDateString() }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="content-sections">
          <!-- Profile Settings -->
          <div class="content-section">
            <div class="section-header">
              <h2>Profile Information</h2>
              <p>Update your personal information and preferences</p>
            </div>

            <div class="form-group">
              <InputText
                v-model="newName"
                label="Full Name"
                :placeholder="user.name"
                direction="column"
              />
              <InputText
                v-model="newInitials"
                label="Initials"
                :placeholder="user.initials"
                direction="column"
              />
              <InputText
                v-model="newEmail"
                label="Email Address"
                :placeholder="user.email"
                type="email"
                direction="column"
              />
            </div>

            <div class="form-actions">
              <Button
                kind="tertiary"
                :disabled="isSaving || !hasUnsavedProfileChanges"
                @click="onDiscard"
              >
                Reset
              </Button>
              <Button
                kind="primary"
                :disabled="isSaving || !hasUnsavedProfileChanges"
                :icon="isSaving ? 'Loader2' : undefined"
                @click="onSave"
              >
                {{ isSaving ? "Saving..." : "Save Changes" }}
              </Button>
            </div>

            <div v-if="hasUnsavedProfileChanges" class="status-message warning">
              <Icon name="AlertCircle" size="16" />
              <span>You have unsaved changes</span>
            </div>
          </div>

          <!-- Security Settings -->
          <div class="content-section">
            <div class="section-header">
              <h2>Security</h2>
              <p>Manage your password and account security</p>
            </div>

            <div class="form-group">
              <InputText
                v-model="currentPassword"
                label="Current Password"
                type="password"
                :disabled="isChangingPassword"
                direction="column"
              />
              <div class="password-field">
                <InputText
                  v-model="newPassword"
                  label="New Password"
                  type="password"
                  :disabled="isChangingPassword"
                  direction="column"
                />
                <PasswordStrength :password="newPassword" />
              </div>
              <InputText
                v-model="confirmPassword"
                label="Confirm New Password"
                type="password"
                :disabled="isChangingPassword"
                direction="column"
              />
            </div>

            <div class="form-actions">
              <Button
                kind="secondary"
                :disabled="isChangingPassword"
                :icon="isChangingPassword ? 'Loader2' : undefined"
                @click="onChangePassword"
              >
                {{ isChangingPassword ? "Updating..." : "Update Password" }}
              </Button>
            </div>
          </div>

          <!-- Support & Resources -->
          <div class="content-section">
            <div class="section-header">
              <h3>Support & Resources</h3>
            </div>
            <div class="action-links">
              <Button kind="tertiary" size="sm" icon="Lifebuoy" text="Get Help" />
              <Button kind="tertiary" size="sm" icon="BrandGit" text="Contribute" />
              <Button kind="tertiary" size="sm" icon="Heart" text="Support Us" />
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="content-section danger-zone">
            <div class="section-header">
              <h3>Danger Zone</h3>
              <p>Irreversible and destructive actions</p>
            </div>
            <div class="danger-content">
              <p>Once you delete your account, there is no going back. Please be certain.</p>
              <Button kind="secondary" size="sm" icon="Trash" text="Delete Account" />
            </div>
          </div>
        </div>
      </div>
    </Pane>
  </BaseLayout>
</template>

<style scoped>
  /* Header Title */
  .title {
    margin-left: 8px;
    font-weight: var(--weight-medium);
  }

  /* Account Layout Container */
  .account-layout {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }

  /* Hero Section */
  .hero-section {
    background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
    margin: 0 0 24px 0;
    border-radius: 16px;
    padding: 32px;
    border: var(--border-thin) solid var(--primary-200);
  }

  .profile-hero {
    display: flex;
    align-items: center;
    gap: 24px;
    max-width: 100%;
  }

  /* Avatar Container */
  .avatar-container {
    position: relative;
    flex-shrink: 0;
  }

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: var(--gray-100);
    background-size: cover;
    background-position: center;
    border: 4px solid var(--surface-primary);
    box-shadow: var(--shadow-soft);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar-placeholder {
    color: var(--gray-400);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar-upload {
    position: absolute;
    bottom: 8px;
    right: 8px;
    border-radius: 50% !important;
    box-shadow: var(--shadow-soft);
    background: var(--surface-primary) !important;
    border: 2px solid var(--surface-primary) !important;
  }

  .avatar-upload :deep(.tabler-icon) {
    color: var(--gray-600);
  }

  /* Profile Info */
  .profile-info {
    flex: 1;
    min-width: 0;
  }

  .user-name {
    font-size: 32px;
    font-weight: var(--weight-semi);
    color: var(--gray-900);
    margin: 0 0 4px 0;
    line-height: 1.2;
  }

  .user-email {
    font-size: 16px;
    color: var(--gray-600);
    margin: 0 0 12px 0;
  }

  .user-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .affiliation {
    font-size: 14px;
    color: var(--gray-700);
    font-weight: var(--weight-medium);
  }

  .member-since {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--gray-500);
  }

  /* Content Sections */
  .content-sections {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

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

  /* Form Styling */
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 24px;
  }

  .password-field {
    position: relative;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: var(--border-thin) solid var(--gray-200);
  }

  /* Status Messages */
  .status-message {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    margin-top: 16px;
  }

  .status-message.warning {
    background-color: var(--surface-warning);
    border: var(--border-thin) solid var(--border-warning);
    color: var(--warning-700);
  }

  .status-message :deep(.tabler-icon) {
    flex-shrink: 0;
  }

  .status-message.warning :deep(.tabler-icon) {
    color: var(--warning-600);
  }

  /* Secondary Content */
  .secondary-content {
    display: flex;
    flex-direction: column;
  }

  /* Support & Resources */
  .action-links {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .action-links :deep(.btn) {
    justify-content: flex-start;
    padding: 12px 16px;
    font-weight: var(--weight-medium);
    width: fit-content !important;
    align-self: flex-start;
    flex: none;
    max-width: none;
  }

  .action-links :deep(button) {
    width: fit-content !important;
    flex: none;
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

  .danger-content p {
    font-size: 14px;
    color: var(--red-600);
    margin: 0;
    line-height: 1.5;
  }

  .danger-content :deep(button.secondary) {
    align-self: flex-start;
    width: auto;
    background-color: var(--red-500) !important;
    border-color: var(--red-500) !important;
    color: white !important;
  }

  .danger-content :deep(button.secondary:hover) {
    background-color: var(--red-600) !important;
    border-color: var(--red-600) !important;
    color: white !important;
    box-shadow: none !important;
  }

  .danger-content :deep(button.secondary .btn-icon) {
    color: white !important;
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
    .hero-section {
      padding: 24px;
    }

    .profile-hero {
      flex-direction: column;
      text-align: center;
      gap: 16px;
    }

    .avatar {
      width: 100px;
      height: 100px;
    }

    .user-name {
      font-size: 28px;
    }

    .content-section {
      padding: 20px;
    }

    .form-actions {
      flex-direction: column-reverse;
      gap: 12px;
    }

    .action-links {
      gap: 12px;
    }
  }

  @media (max-width: 480px) {
    .hero-section {
      padding: 20px;
    }

    .user-name {
      font-size: 24px;
    }

    .content-section {
      padding: 16px;
    }
  }
</style>
