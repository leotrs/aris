<script setup>
  import { inject } from "vue";
  import { IconUserCircle } from "@tabler/icons-vue";

  const user = inject("user");
</script>

<template>
  <HomeLayout>
    <Pane>
      <Header class="text-h4">
        <IconUserCircle />
        <span class="title">Account</span>
      </Header>
      <div class="main">
        <div class="left">
          <Section>
            <template #title>Profile</template>
            <template #content>
              <div>picture</div>
              <div>{{ user.name }}</div>
              <div>{{ user.email }}</div>
              <div>affiliation</div>
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
          </Section>
        </div>
        <div class="right">
          <Button :class="logout" kind="secondary" icon="Logout" text="log out" />
          <Button kind="tertiary" size="sm" icon="BrandGit" text="Contribute" />
          <Button kind="tertiary" size="sm" icon="Lifebuoy" text="Help" />
          <Button kind="tertiary" size="sm" icon="Heart" text="Donate" />
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

  .pane-header {
    height: 48px !important;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .pane-header > .title {
    margin-left: 4px;
  }

  .main {
    display: flex;
  }

  .main > .left {
    flex: 4;
  }

  .main > .right {
    flex: 1;
  }

  .main > .right > button.logout {
  }

  .main > .right > button {
    width: 100%;
    margin-bottom: 8px;
  }
</style>
