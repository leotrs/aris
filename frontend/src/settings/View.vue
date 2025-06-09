<script setup>
  import { ref, reactive, inject, provide, onMounted, useTemplateRef } from "vue";
  import { IconSettings, IconInfoCircle } from "@tabler/icons-vue";
  import { File } from "@/File.js";

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
# File Settings Preview

:author:
:name: ${user.value.name}
:email: ${user.value.email}
::

## Sample Section Heading
:label: sec

Aris\\: the web-native, human-first ResOps platform.

### And a subsection

Lorem ipsum.

:remark:
Insightful remark goes here, with a reference to the earlier :ref:sec::.
::

::`,
      },
      null
    )
  );

  const defaultSettings = reactive({});
  const fileSettingsRef = useTemplateRef("file-settings-ref");
  onMounted(async () => {
    const fromDb = await File.getSettings(file.value, api);
    Object.assign(defaultSettings, fromDb);
    fileSettingsRef.value.startReceivingUserInput();
  });
  provide("file", file);

  onMounted(async () => {
    const response = await api.post("render", { source: file.value.source });
    file.value.html = response.data;
  });

  const onSave = async (settingsObj) => {
    try {
      await File.updateDefaultSettings(settingsObj, api);
    } catch (error) {
      console.error("Failed trying to update default settings.");
      console.error(error);
    }
  };
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
          <FileSettings
            ref="file-settings-ref"
            v-model="defaultSettings"
            :header="false"
            @save="onSave"
          />
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
          <ManuscriptWrapper
            :html-string="file?.html || ''"
            :keys="false"
            :settings="defaultSettings"
          />
        </div>
      </div>
    </Pane>
  </HomeLayout>
</template>

<style scoped>
  .view {
    --settings-width: 324px;
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
  }

  .settings > :deep(.pane) {
    padding: 0;
  }

  .settings > :deep(.pane > .content) {
    padding: 0 0 8px 0;
  }

  .settings > :deep(.pane > .content > .section) {
    width: 100%;
  }

  .main {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 16px;
  }

  .left {
    max-width: var(--settings-width);
  }

  .left,
  .right {
    flex: 1;
  }

  .rsm-manuscript {
    box-shadow: var(--shadow-soft);
    padding-block: 16px;
    border-radius: 8px;
    height: 100%;
  }

  :deep(.manuscriptwrapper) {
    padding-bottom: 0 !important;
  }
</style>
