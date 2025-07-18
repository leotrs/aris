<script setup>
  import { reactive, computed, watch, onMounted, useTemplateRef } from "vue";

  /**
   * Tabs - Complete tab navigation component
   *
   * A fully-featured tab component that manages multiple tab pages with labels and icons.
   * Handles tab switching, content visibility, and keyboard navigation automatically.
   *
   * @displayName Tabs
   * @example
   * // Basic usage with labels
   * <Tabs
   *   :labels="['Dashboard', 'Settings', 'Profile']"
   *   :icons="['Home', 'Settings', 'User']"
   *   v-model="activeTabIndex"
   * >
   *   <TabPage>Dashboard content</TabPage>
   *   <TabPage>Settings content</TabPage>
   *   <TabPage>Profile content</TabPage>
   * </Tabs>
   *
   * @example
   * // Dynamic tabs
   * <Tabs :labels="tabLabels" :icons="tabIcons" v-model="currentTab">
   *   <TabPage v-for="(content, index) in tabContents" :key="index">
   *     {{ content }}
   *   </TabPage>
   * </Tabs>
   */

  const props = defineProps({
    /**
     * Array of tab labels to display
     * @values ["Tab 1", "Tab 2", "Tab 3"]
     */
    labels: { type: Array, default: null },
    /**
     * Array of icon names for each tab (from Tabler icons)
     * @values ["Home", "Settings", "User"]
     */
    icons: { type: Array, default: null },
  });
  const numTabs = computed(() => props.labels?.length ?? 0);

  /**
   * The index of the currently active tab (v-model)
   */
  const activeIndex = defineModel({ type: Number, default: 0 });
  const tabStates = reactive({
    active: Array.from({ length: numTabs.value }).map(() => false),
  });
  watch(
    () => [...tabStates.active],
    (newVal, oldVal) => {
      for (let i = 0; i < newVal.length; i++) {
        if (newVal[i] && !oldVal[i]) {
          tabStates.active.fill(false);
          tabStates.active[i] = true;
          activeIndex.value = i;
          return;
        }
      }
    }
  );
  onMounted(() => (tabStates.active[0] = true));

  const contentRef = useTemplateRef("content-ref");
  const updatePages = () => {
    if (!contentRef.value) return;
    const pages = contentRef.value.querySelectorAll(".tab-page-wrapper");
    pages.forEach((page) => (page.style.display = "none"));
    pages[activeIndex.value].style.display = "block";
  };
  watch(activeIndex, () => updatePages(), { immediate: true });
  onMounted(() => updatePages());
</script>

<template>
  <div ref="self-ref" class="tabs-wrapper">
    <div class="tabs-header">
      <div v-for="count in numTabs" :key="count" class="tabs-header-item">
        <Tab
          v-model="tabStates.active[count - 1]"
          :icon="icons[count - 1]"
          :label="labels[count - 1]"
        />
      </div>
    </div>
    <div ref="content-ref" class="tabs-content">
      <slot />
    </div>
  </div>
</template>

<style>
  .tabs-wrapper {
    --header-height: 48px;

    width: min-content;
    height: 100%;
  }

  .tabs-header {
    height: var(--header-height);
    display: flex;
    gap: 4px;
    border-radius: 8px;
    width: fit-content;
    background-color: var(--surface-hover);
    border: var(--border-extrathin) solid var(--border-primary);
  }

  .tabs-header .tab-wrapper:first-child:not(.active) {
    border-bottom-left-radius: 8px !important;
  }

  .tabs-header .tab-wrapper:last-child:not(.active) {
    border-bottom-right-radius: 8px !important;
  }

  .tabs-content {
    width: calc(100% + var(--scrollbar-size));
    height: calc(100% - var(--header-height));
    padding-top: 16px;
  }
</style>
