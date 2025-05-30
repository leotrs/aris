<script setup>
  import { inject } from "vue";
  import { IconUserCircle } from "@tabler/icons-vue";

  const user = inject("user");
</script>

<template>
  <HomeLayout>
    <Pane>
      <template #header>
        <IconUserCircle />
        <span class="title">Account</span>
      </template>

      <div class="main">
        <div class="left">
          <Section class="profile-card">
            <template #content>
              <div class="pic"></div>
              <div class="info">
                <div class="text-h6">{{ user.name }}</div>
                <div>{{ user.email }}</div>
                <div>Prestigious University or Institute</div>
                <div>
                  <em>Aris user since{{ user.created_at }}</em>
                </div>
              </div>
            </template>
          </Section>

          <Section>
            <template #title>Profile</template>
            <template #content>
              <InputText label="Name" :placeholder="user.name" />
              <InputText label="Initials" :placeholder="user.initials" />
              <InputText label="Email" :placeholder="user.email" disabled="true" />
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

          <Section class="cta">
            <template #content>
              <Button kind="tertiary">Discard changes</Button>
              <Button kind="primary">Save</Button>
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
              <Button kind="primary danger">Delete account</Button>
            </template>
          </Section>
        </div>
        <div class="right">
          <Button kind="tertiary" size="sm" icon="Lifebuoy" text="Help" />
          <Button kind="tertiary" size="sm" icon="BrandGit" text="Contribute" />
          <Button kind="tertiary" size="sm" icon="Heart" text="Donate" />
          <Button class="logout" kind="secondary" icon="Logout" text="log out" />
        </div>
      </div>
    </Pane>
  </HomeLayout>
</template>

<style scoped>
  .view {
    --transition-duration: 0.3s;
    display: flex;
    width: 100%;
    height: 100%;
    will-change: padding;
    transition: padding var(--transition-duration) ease;
  }

  .profile-card {
    display: flex;
    justify-content: flex-start;
  }

  .profile-card > :deep(.content) {
    padding: 0px;
    border-radius: 16px;
    width: 100%;
    display: flex;
    border: var(--border-thin) solid var(--primary-300);
    box-shadow: var(--shadow-soft);
  }

  .profile-card > .content > .pic {
    height: 150px;
    width: 150px;
    flex-shrink: 0;
    border-radius: calc(16px - var(--border-thin));
    background-color: var(--gray-200);
  }

  .profile-card > .content > .info {
    padding-inline: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;

    & > * {
      margin-bottom: 4px;
    }
  }

  .main {
    display: flex;
  }

  .main > .left {
  }

  .section.cta :deep(.content) {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
  }

  .section.danger :deep(.footer) {
    display: flex;
    justify-content: flex-end;
  }

  .main > .right {
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
</style>
