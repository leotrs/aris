<script setup>
  import { ref, computed, inject, onMounted, onUnmounted } from "vue";
  import { IconUserCircle } from "@tabler/icons-vue";

  const xsMode = inject("xsMode");
  const mobileMode = inject("mobileMode");
  const user = inject("user");
  const api = inject("api");

  // Profile section form submission
  const newName = ref(null);
  const newInitials = ref(null);
  const newEmail = ref(null);
  const onSave = async () => {
    console.log(newName.value, newInitials.value, newEmail.value);
    try {
      const payload = {
        name: newName.value || user.value.name,
        initials: newInitials.value || user.value.initials,
        email: newEmail.value || user.value.email,
      };

      const res = await api.put(`/users/${user.value.id}`, payload);
      Object.assign(user.value, res.data);
      // toast.success("Profile updated")
    } catch (error) {
      console.error("Failed to update user", error);
      // toast.error("Failed to update profile")
    }
  };

  // Profile picture upload
  const fileInputRef = ref(null);
  const selectedFile = ref(null);
  const localPreviewUrl = ref(null);
  const serverAvatarUrl = ref(null);

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
    if (!file.type.startsWith("image/")) {
      console.error("Please select an image file");
      // toast.error('Please select an image file');
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error("File size must be less than 5MB");
      // toast.error('File size must be less than 5MB');
      return;
    }
    selectedFile.value = file;

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
      console.log("Avatar uploaded successfully");
      // toast.success('Avatar updated successfully');

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
      // toast.error('Failed to upload avatar');
    }
  };

  // Lifecycle
  onMounted(() => fetchAvatar());
  onUnmounted(() => {
    if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
    if (serverAvatarUrl.value) URL.revokeObjectURL(serverAvatarUrl.value);
  });
</script>

<template>
  <HomeLayout :fab="false" active="Account">
    <Pane>
      <template #header>
        <IconUserCircle />
        <span class="title">Account</span>
      </template>

      <div class="main" :class="{ mobile: mobileMode, xs: xsMode }">
        <div class="left">
          <Section class="profile-card">
            <template #content>
              <div
                id="pic"
                :style="{
                  backgroundImage: previewUrl ? `url(${previewUrl})` : 'none',
                }"
              >
                <Button
                  kind="tertiary"
                  icon="Upload"
                  class="pic-upload"
                  size="sm"
                  @click="onUpload"
                />
                <!-- Hidden file input -->
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="onFileSelected"
                />
              </div>
              <div class="info">
                <div id="username" class="text-h6">{{ user.name }}</div>
                <div>{{ user.email }}</div>
                <div>Prestigious University or Institute</div>
                <div id="since" class="text-caption">
                  <span id="Aris">Aris</span>
                  <em> user since {{ new Date(user.created_at).toLocaleDateString() }} </em>
                </div>
              </div>
            </template>
          </Section>

          <Section>
            <template #title>Profile</template>
            <template #content>
              <InputText v-model="newName" label="Name" :placeholder="user.name" />
              <InputText v-model="newInitials" label="Initials" :placeholder="user.initials" />
              <InputText v-model="newEmail" label="Email" :placeholder="user.email" />
            </template>
          </Section>

          <Section>
            <template #title>Password</template>
            <template #content>
              <InputText label="Current password" type="password" />
              <InputText label="New password" type="password" />
              <InputText label="Confirm new password" type="password" />
            </template>
          </Section>

          <div class="buttons">
            <Button kind="tertiary">Discard</Button>
            <Button id="cta" kind="primary" @click="onSave">Save</Button>
          </div>

          <Section v-if="mobileMode">
            <template #title>Useful Links</template>
            <template #content>
              <Button kind="tertiary" size="sm" icon="Lifebuoy" text="Help" />
              <Button kind="tertiary" size="sm" icon="BrandGit" text="Contribute" />
              <Button kind="tertiary" size="sm" icon="Heart" text="Donate" />
            </template>
          </Section>

          <Section class="danger">
            <template #title>Danger Zone</template>
            <template #content>
              <div>
                <p>
                  If you wish to delete your account, make sure you back up your files and data
                  first.
                </p>
                <p>This is an irreversible action.</p>
              </div>
            </template>
            <template #footer>
              <Button id="danger" kind="primary danger">Delete account</Button>
            </template>
          </Section>
        </div>
        <div v-if="!mobileMode" class="right">
          <Button kind="tertiary" size="sm" icon="Lifebuoy" text="Help" />
          <Button kind="tertiary" size="sm" icon="BrandGit" text="Contribute" />
          <Button kind="tertiary" size="sm" icon="Heart" text="Donate" />
        </div>
      </div>
    </Pane>
  </HomeLayout>
</template>

<style scoped>
  .view {
    --right-width: 168px;
    --transition-duration: 0.3s;
    display: flex;
    width: 100%;
    height: 100%;
    will-change: padding;
    transition: padding var(--transition-duration) ease;
  }

  .section {
    width: 100%;
  }

  .profile-card {
    display: flex;
    justify-content: flex-start;
    border: var(--border-thin) solid v-bind(user.color);
    border-radius: 16px;
  }

  .profile-card > :deep(.content) {
    width: 100%;
    padding: 0px;
    display: flex;
    flex-direction: row;
    border-radius: 16px;
    box-shadow: var(--shadow-soft);
  }

  #username {
    font-weight: var(--weight-semi);
    padding-bottom: 4px;
  }

  #pic {
    min-height: 150px;
    height: 100%;
    width: 150px;
    flex-shrink: 0;
    border-radius: calc(16px - var(--border-thin));
    background-color: var(--gray-100);
    background-size: cover;
    background-position: center;
    position: relative;
  }

  #pic::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 35%;
    background: linear-gradient(
      to top,
      color-mix(in srgb, v-bind(user.color) 60%, transparent) 0%,
      color-mix(in srgb, v-bind(user.color) 30%, transparent) 70%,
      transparent 100%
    );
    border-radius: 0 0 calc(16px - var(--border-thin)) calc(16px - var(--border-thin));
    pointer-events: none;
  }

  .pic-upload {
    position: absolute;
    bottom: 8px;
    right: 8px;
    & :deep(.tabler-icon) {
      color: var(--almost-white);
    }
  }

  #since {
    font-size: 12px;
    margin-top: 8px;
  }

  #Aris {
    font-weight: var(--weight-semi);
    color: var(--primary-700);
  }

  .main.mobile #pic {
    min-height: 100px;
    height: 100%;
    aspect-ratio: 1/1;
  }

  .profile-card > .content > .info {
    magin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;

    & > * {
      margin-bottom: 4px;
    }
  }

  .main.xs .profile-card > :deep(.content) {
    flex-direction: column;
    align-items: center;
    padding-block: 8px;
    text-align: center;
  }

  .main.xs #pic {
    margin-inline: 32px;
    height: 100px;
    width: 100px;
  }

  .main.xs .profile-card > .content > .info > * {
    white-space: wrap;
  }

  .main {
    display: flex;
  }

  .main > .left {
    width: calc(100% - var(--right-width));
  }

  .main.mobile > .left {
    width: 100%;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
    gap: 16px;
  }

  #cta {
    padding-inline: 48px;
  }

  .section.danger :deep(.footer) {
    display: flex;
    justify-content: flex-end;
  }

  .main > .right {
    width: var(--right-width);
    position: absolute;
    right: calc(32px);
    padding-inline: 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: calc(100% - 48px - 16px - 16px - 16px - 16px);
    gap: 8px;
    padding: 16px;
    padding-bottom: 16px;
  }

  #danger {
    width: fit-content;
  }
</style>
