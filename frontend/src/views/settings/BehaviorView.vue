<script setup>
  import { ref, reactive, onMounted, inject } from "vue";
  import { IconSettings2 } from "@tabler/icons-vue";

  const api = inject("api");

  const settings = reactive({
    autoSaveInterval: 30,
    focusModeAutoHide: true,
    sidebarAutoCollapse: false,
    drawerDefaultAnnotations: false,
    drawerDefaultMargins: false,
    drawerDefaultSettings: false,
    soundNotifications: true,
    autoCompileDelay: 1000,
    mobileMenuBehavior: "standard",
  });

  const loading = ref(false);
  const saved = ref(false);

  onMounted(async () => {
    try {
      const response = await api.get("/user-settings");
      Object.assign(settings, response.data);
    } catch (error) {
      console.error("Failed to load user settings:", error);
    }
  });

  const saveSettings = async () => {
    loading.value = true;
    saved.value = false;

    try {
      await api.post("/user-settings", settings);
      saved.value = true;
      setTimeout(() => {
        saved.value = false;
      }, 2000);
    } catch (error) {
      console.error("Failed to save user settings:", error);
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <Pane>
    <template #header>
      <IconSettings2 />
      <span class="title">Behavior</span>
    </template>
    <Section>
      <template #title>Auto-save & Performance</template>
      <template #content>
        <div class="setting-item">
          <label for="auto-save-interval">Auto-save interval (seconds)</label>
          <select id="auto-save-interval" v-model="settings.autoSaveInterval">
            <option :value="10">10 seconds</option>
            <option :value="30">30 seconds</option>
            <option :value="60">1 minute</option>
            <option :value="300">5 minutes</option>
          </select>
        </div>

        <div class="setting-item">
          <label for="auto-compile-delay">Auto-compile delay (milliseconds)</label>
          <select id="auto-compile-delay" v-model="settings.autoCompileDelay">
            <option :value="500">500ms</option>
            <option :value="1000">1 second</option>
            <option :value="2000">2 seconds</option>
            <option :value="5000">5 seconds</option>
          </select>
        </div>
      </template>
    </Section>

    <Section>
      <template #title>Focus Mode</template>
      <template #content>
        <div class="setting-item">
          <Checkbox id="focus-mode-auto-hide" v-model="settings.focusModeAutoHide">
            Auto-hide UI elements in focus mode
          </Checkbox>
          <p class="setting-description">
            Automatically hide navigation and toolbars when entering focus mode
          </p>
        </div>
      </template>
    </Section>

    <Section>
      <template #title>Interface Layout</template>
      <template #content>
        <div class="setting-item">
          <Checkbox id="sidebar-auto-collapse" v-model="settings.sidebarAutoCollapse">
            Auto-collapse sidebar
          </Checkbox>
          <p class="setting-description">Automatically collapse the sidebar when not in use</p>
        </div>
      </template>
    </Section>

    <Section>
      <template #title>Drawer Defaults</template>
      <template #content>
        <p class="setting-description">Set the default open/closed state for workspace drawers</p>

        <div class="setting-item">
          <Checkbox id="drawer-annotations" v-model="settings.drawerDefaultAnnotations">
            Open annotations drawer by default
          </Checkbox>
        </div>

        <div class="setting-item">
          <Checkbox id="drawer-margins" v-model="settings.drawerDefaultMargins">
            Open margins drawer by default
          </Checkbox>
        </div>

        <div class="setting-item">
          <Checkbox id="drawer-settings" v-model="settings.drawerDefaultSettings">
            Open settings drawer by default
          </Checkbox>
        </div>
      </template>
    </Section>

    <Section>
      <template #title>Audio & Mobile</template>
      <template #content>
        <div class="setting-item">
          <Checkbox id="sound-notifications" v-model="settings.soundNotifications">
            Enable sound notifications
          </Checkbox>
          <p class="setting-description">Play audio feedback for actions and notifications</p>
        </div>

        <div class="setting-item">
          <label for="mobile-menu-behavior">Mobile menu behavior</label>
          <select id="mobile-menu-behavior" v-model="settings.mobileMenuBehavior">
            <option value="standard">Standard</option>
            <option value="compact">Compact</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>
      </template>
    </Section>

    <Section>
      <template #content>
        <div class="settings-actions">
          <button
            :disabled="loading"
            class="save-button"
            :class="{ saved: saved }"
            @click="saveSettings"
          >
            {{ loading ? "Saving..." : saved ? "Saved!" : "Save Settings" }}
          </button>
        </div>
      </template>
    </Section>
  </Pane>
</template>

<style scoped>
  :deep(.section) {
    width: 100%;
  }

  .setting-item {
    margin-bottom: 16px;
  }

  .setting-item label {
    display: block;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .checkbox-wrapper label {
    margin: 0;
    cursor: pointer;
  }

  .checkbox-wrapper input[type="checkbox"] {
    margin: 0;
    cursor: pointer;
  }

  .setting-description {
    color: var(--text-secondary);
    font-size: 13px;
    margin: 4px 0 0 0;
  }

  select {
    padding: 8px 12px;
    border: var(--border-thin) solid var(--border-subtle);
    border-radius: 6px;
    background: var(--surface-page);
    color: var(--text-primary);
    font-size: 14px;
  }

  select:focus {
    outline: none;
    border-color: var(--accent-500);
  }

  .settings-actions {
    margin-top: 16px;
  }

  .save-button {
    background: var(--accent-500);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .save-button:hover:not(:disabled) {
    background: var(--accent-600);
  }

  .save-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .save-button.saved {
    background: var(--success-500);
  }
</style>
