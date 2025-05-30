<script setup>
  import { inject } from "vue";
  import { IconSettings } from "@tabler/icons-vue";

  const user = inject("user");
</script>

<template>
  <HomeLayout>
    <Pane>
      <Header class="text-h4">
        <IconSettings />
        <span class="title">Settings</span>
      </Header>
      <div class="main">
        <Section>
          <template #title>Appearance</template>
          <template #content>
            <span class="text-label">Theme</span>
            <ThemeSwitch :labels="true" />
          </template>
        </Section>
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
    flex-direction: column;
  }
</style>
