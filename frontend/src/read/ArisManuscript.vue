<script setup>
  import { ref, watch, inject } from "vue";
  import axios from "axios";
  import Topbar from "./Topbar.vue";
  import Drawer from "./Drawer.vue";

  const htmlContent = ref("");
  const doc = inject("doc");

  watch(doc, async () => {
    if (!doc.value) return;
    console.log(doc.value);

    try {
      const response = await axios.get(
        `http://localhost:8000/documents/${doc.value.id}/content`
      );
      htmlContent.value = response.data;
    } catch (error) {
      console.error("Error fetching HTML:", error);
    }
  });

  const backgroundColor = ref("var(--surface-page)");
</script>

<template>
  <div class="outer-wrapper">
    <div class="css-links">
      <link
        rel="stylesheet"
        type="text/css"
        href="http://localhost:8000/static/rsm.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.css"
      />
    </div>

    <Topbar :title="doc?.title ?? ''" />

    <div class="inner-wrapper">
      <div class="left-column">
        <Drawer side="left" :scroll="true" />
        <Drawer side="left" :scroll="false" />
      </div>

      <div class="middle-column">
        <ManuscriptWrapper :html="htmlContent" />
        <div class="middle-footer">
          <div id="footer-logo"><img src="../assets/logo-32px.svg" /></div>
        </div>
      </div>

      <div class="right-column">
        <Drawer side="right" :scroll="true" />
        <Drawer side="right" :scroll="false" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .outer-wrapper {
    --outer-padding: 8px;
    --sidebar-width: 64px;
    --topbar-height: 64px;

    width: calc(100% - 64px);
    height: 100%;
    position: relative;
    left: 64px;
    padding: 0 var(--outer-padding) var(--outer-padding) 0;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
  .inner-wrapper {
    display: flex;
    width: 100%;
    height: calc(100% - var(--topbar-height) - var(--outer-padding));
    position: relative;
    top: calc(var(--topbar-height) + var(--outer-padding));
    background-color: v-bind("backgroundColor");
    border-bottom-right-radius: 16px;
    border-bottom-left-radius: 16px;
    overflow-y: auto;

    /* These are standard CSS that are not yet supported - switch to them in the future */
    /* scrollbar-color: var(--light);
        scrollbar-width: 16px; */

    &::-webkit-scrollbar {
      width: 16px;
      background: transparent;
    }

    &::-webkit-scrollbar-track {
      border-bottom-right-radius: 16px;
      border-top-right-radius: 16px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--gray-200);
      border-radius: 8px;
      height: 32px;
      width: 16px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--surface-hint);
    }
  }

  .middle-column {
    margin-top: 8px;
  }

  .left-column,
  .right-column {
    flex-basis: 292px;
    min-width: 120px;
    background-color: var(--surface-page);
    padding-inline: 16px;
    padding-block: 16px;
    background-color: v-bind("backgroundColor");
    height: 100%;
  }

  .left-column {
    position: relative;
  }

  .right-column {
  }

  .left-column.fixed,
  .right-column.fixed {
    position: fixed;
    height: calc(100% - 64px);
    background-color: transparent;
    top: 64px;
    overflow-y: auto;
  }

  .left-column.fixed {
    left: 64px;

    & > :deep(.minimap) {
      position: absolute;
      width: 48px;
      top: calc(64px + 40px);
      height: calc(100% - 152px);
      left: 0;
      right: 0;
      margin: 0 auto;
    }

    & > :deep(.minimap > svg) {
      height: 100%;
    }
  }

  .right-column.fixed {
    right: 0;
  }

  .middle-column {
    min-width: 576px;
    max-width: 720px;
    z-index: 1;
    overflow-x: visible;
    height: fit-content;
    background-color: v-bind("backgroundColor");
  }

  #footer-logo {
    display: flex;
    justify-content: center;
    padding-top: 48px;
    padding-bottom: 96px;
  }
</style>
