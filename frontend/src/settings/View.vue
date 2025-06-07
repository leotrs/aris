<script setup>
  import { ref, inject, provide, onMounted } from "vue";
  import { IconSettings, IconInfoCircle } from "@tabler/icons-vue";
  import { File } from "../File.js";

  const user = inject("user");
  const api = inject("api");
  const file = ref(
    new File(
      {
        id: null,
        title: "Sample Title",
        last_edited_at: new Date().toISOString(),
        tags: [],
        minimap: null,
        ownerId: user.id,
        selected: false,
        filtered: false,
        isMountedAt: null,
        html: "",
        source: `:rsm:
# Sample Title
Sample text.
::`,
      },
      null
    )
  );
  provide("file", file);

  onMounted(async () => {
    const response = await api.post("render", { source: file.value.source });
    file.value.html = response.data;
  });
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
          <ManuscriptWrapper :html-string="file?.html || ''" :keys="false" :show-footer="false" />
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

  .settings {
    outline: 2px solid pink;
  }

  :deep(.settings > .pane) {
    padding: 0;
    width: 100%;
  }

  :deep(.settings > .pane > .content) {
    padding: 0 0 8px 0;
    width: 100%;
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

  .rsm-manuscript {
    box-shadow: var(--shadow-soft);
    padding-block: 16px;
    border-radius: 8px;
  }
</style>
