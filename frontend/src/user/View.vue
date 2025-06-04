<script setup>
  import { ref, inject } from "vue";
  import { IconUserCircle } from "@tabler/icons-vue";

  const xsMode = inject("xsMode");
  const mobileMode = inject("mobileMode");
  const user = inject("user");
  const api = inject("api");

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
      user.value.name = res.data.name;
      user.value.initials = res.data.initials;
      user.value.email = res.data.email;
      // toast.success("Profile updated")
    } catch (error) {
      console.error("Failed to update user", error);
      // toast.error("Failed to update profile")
    }
  };
</script>

<template>
  <HomeLayout :fab="false">
    <Pane>
      <template #header>
        <IconUserCircle />
        <span class="title">Account</span>
      </template>

      <div class="main" :class="{ mobile: mobileMode, xs: xsMode }">
        <div class="left">
          <Section class="profile-card">
            <template #content>
              <div id="pic">
                <Button kind="tertiary" icon="Upload" class="pic-upload" size="sm" />
              </div>
              <div class="info">
                <div id="username" class="text-h6">{{ user.name }}</div>
                <div>{{ user.email }}</div>
                <div>Prestigious University or Institute</div>
                <div id="since">
                  <em
                    >Aris user since
                    {{ new Date(user.created_at).toLocaleString(undefined, {}) }}</em
                  >
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
            <Button id="cta" kind="primary" @click="onSave">Save Defaults</Button>
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
    height: 150px;
    width: 150px;
    flex-shrink: 0;
    border-radius: calc(16px - var(--border-thin));
    background-color: var(--gray-100);
    position: relative;
  }

  .pic-upload {
    position: absolute;
    bottom: 8px;
    right: 8px;
  }

  #since {
    font-size: 14px;
  }

  .main.mobile #pic {
    min-height: 100px;
    height: 100%;
    aspect-ratio: 1/1;
  }

  .profile-card > .content > .info {
    padding-inline: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    & > * {
      margin-bottom: 4px;
      white-space: nowrap;
    }
  }

  .main.xs .profile-card > :deep(.content) {
    flex-direction: column;
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
