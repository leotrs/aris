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
              <div><label>Name</label>{{ user.name }}</div>
              <div><label>Email</label>{{ user.email }}</div>
              <div><label>Affiliation</label></div>
            </template>
          </Section>

          <Section>
            <template #title>Password</template>
            <template #content>
              <div>current pwd</div>
              <div>new pwd</div>
              <div>confirm</div>
            </template>
          </Section>

          <Section class="cta">
            <template #content>
              <Button kind="tertiary">Discard changes</Button>
              <Button kind="primary">Save settings</Button>
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
    width: fit-content;
    display: flex;
    justify-content: center;
    border: var(--border-thin) solid var(--primary-300);
  }

  .profile-card > .content > .pic {
    height: 150px;
    width: 150px;
    border-radius: calc(16px - var(--border-thin));
    background-color: var(--gray-200);
  }

  .profile-card > .content > .info {
    padding-inline: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    & > * {
      margin-bottom: 4px;
    }
  }

  .main {
    display: flex;
  }

  .main > .left {
  }

  .main .section.cta :deep(.content) {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
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
    padding-bottom: 32px;
  }

  .main > .right > :deep(button) {
    width: 100%;
  }

  .main > .right > button.logout {
  }
</style>
