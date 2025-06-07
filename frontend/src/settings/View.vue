<script setup>
  import { inject } from "vue";
  import { IconSettings, IconInfoCircle } from "@tabler/icons-vue";

  const user = inject("user");
</script>

<template>
  <HomeLayout :fab="false" active="Settings">
    <Pane>
      <template #header>
        <IconSettings />
        <span class="title">Settings</span>
      </template>

      <div class="main">
        <div class="left">
          <FileSettings :header="false" />
          <div class="info">
            <IconInfoCircle />
            <p>
              These settings will be applied to <em>new</em> files. Modify the settings of
              <em>existing</em> files by opening them and choosing the Settings option in the
              sidebar.
            </p>
          </div>
        </div>
        <div class="right">
          <ManuscriptWrapper html-string=":rsm: foo ::" :keys="false" :show-footer="false" />
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

  .info {
    display: flex;
    align-items: center;
    padding-block: 16px;
    padding-inline: 8px;
    background-color: var(--surface-information);
    border: var(--border-thin) solid var(--border-information);
    border-radius: 8px;
    margin-top: 16px;

    & .tabler-icon {
      flex-shrink: 0;
      color: var(--icon-information);
    }

    & p {
      padding-inline: 8px;
      font-size: 14px;
      color: var(--information-700);
    }
  }

  :deep(.settings > .pane) {
    padding: 0;
  }

  :deep(.settings > .pane > .content) {
    padding: 0 0 8px 0;
  }

  .main {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 16px;
  }

  .left,
  .right {
    flex: 1;
  }
</style>
