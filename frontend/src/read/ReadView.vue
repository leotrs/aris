<script setup>
 import { ref, watch, onMounted } from 'vue';
 import { useRoute } from 'vue-router';
 import { onKeyUp } from '@vueuse/core';
 import Sidebar from './Sidebar.vue';
 import Topbar from './Topbar.vue';
 import ReadOverlaySettings from './PanelSettings.vue'

 const route = useRoute();
 const htmlContent = ref('');
 const baseURL = `http://localhost:8000/documents/${route.params.doc_id}`;
 onMounted(async () => {
     try {
         const response = await fetch(`${baseURL}/html`);
         if (!response.ok) { throw new Error('Failed to fetch HTML') }
         htmlContent.value = await response.text();
     } catch (error) {
         console.error('Error fetching HTML:', error)
     }
 });

 const docTitle = ref("");
 const manuscriptRef = ref(null);
 const minimapRef = ref(null);
 const leftColumnFixed = ref(null);
 onMounted(async () => {
     if (!manuscriptRef.value) return;

     /* Run the RSM scripts */
     await import("http://localhost:8000/static/jquery-3.6.0.js");
     await import("http://localhost:8000/static/tooltipster.bundle.js");
     const { onload } = await import("http://localhost:8000/static/onload.js");
     const lsp_ws = onload();

     /* Get the title and other info */
     const response = await fetch(`${baseURL}`);
     if (!response.ok) { throw new Error('Failed to fetch HTML') }
     const json = await response.json();
     docTitle.value = json.title;

     /* Relocate the minimap */
     if (leftColumnFixed.value) {
         const minimap = manuscriptRef.value.querySelector(".float-minimap-wrapper .minimap");
         if (minimap) {
             console.log('relocating');
             minimapRef.value = minimap;
             minimap.remove();
             leftColumnFixed.value.append(minimap);
             minimap.style.visibility = "hidden";
         }
     }
 });

 const showMinimap = ref(false);
 watch(showMinimap, (newValue, oldValue) => {
     if (!minimapRef.value) return;
     console.log(newValue);
     if (newValue) minimapRef.value.style.visibility = "visible";
     if (!newValue) minimapRef.value.style.visibility = "hidden";
 })

 const showSettings = ref(false);

 const backgroundColor = ref("var(--surface-page)");

 onKeyUp (['m', 'M'], (e) => {
     e.preventDefault();
     showMinimap.value = !showMinimap.value;
 });
 onKeyUp (['s', 'S'], (e) => {
     e.preventDefault();
     showSettings.value = !showSettings.value;
 });
</script>


<template>
  <div class="read-view">

    <Sidebar
        v-model:show-minimap="showMinimap"
        v-model:show-settings="showSettings"
    />

    <div class="outer-wrapper">

      <div class="css-links">
        <link rel="stylesheet" type="text/css" href="http://localhost:8000/static/rsm.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pseudocode@latest/build/pseudocode.min.css">
      </div>

      <Topbar :title="docTitle" />

      <div class="inner-wrapper">
        <div class="left-column" ref="leftColumn"></div>
        <div class="left-column fixed" ref="leftColumnFixed">
          <ReadOverlaySettings
              v-show="showSettings"
              @close="showSettings = false"
              @set-background="(c) => {console.log(c); backgroundColor = c}"
          />
        </div>
        <div class="middle-column">
          <div ref="manuscriptRef" v-html="htmlContent"></div>
          <div class="middle-footer">
            <div id="footer-logo"><img src="../assets/logo-32px.svg" /></div>
          </div>
        </div>
        <div class="right-column">right</div>
        <div class="right-column fixed">right fixed</div>
      </div>

    </div>
  </div>
</template>


<style scoped>
 .read-view {
     display: flex;
     width: 100%;
     background-color: var(--extra-light);
 }

 .outer-wrapper {
     width: calc(100% - 64px);
     height: 100%;
     position: relative;
     left: 64px;
     padding-right: 8px;
     padding-bottom: 8px;
 }

 .inner-wrapper {
     display: flex;
     width: 100%;
     height: calc(100% - 64px);
     position: relative;
     top: 64px;
     border-radius: 16px;
     background-color: v-bind("backgroundColor");
     border-bottom-right-radius: 16px;
     border-top-right-radius: 16px;
     /* no scrollbar in any browser */
     overflow-y: auto;

     /* These are standard CSS that are not yet supported - switch to them in the future */
     /* scrollbar-color: var(--light);
        scrollbar-width: 16px; */

     &::-webkit-scrollbar {
         width: 16px;
         background: transparent;
     };
     &::-webkit-scrollbar-track {
         border-bottom-right-radius: 16px;
         border-top-right-radius: 16px
     };
     &::-webkit-scrollbar-thumb {
         background: var(--gray-200);
         border-radius: 8px;
         height: 32px;
         width: 16px;
     };
     &::-webkit-scrollbar-thumb:hover { background: var(--surface-hint) };
 }

 .left-column, .right-column {
     flex-basis: 292px;
     min-width: 120px;
     background-color: var(--surface-page);
     padding-inline: 16px;
     padding-block: 16px;
     background-color: v-bind("backgroundColor");
     height: 100%;
 }

 .left-column {
     border-top-left-radius: 16px;
     position: relative;
 }

 .right-column {
     border-top-right-radius: 16px;
 }

 .left-column.fixed, .right-column.fixed {
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


<style>
 /* Overwrite RSM's CSS but be CAREFUL!!! */
 .manuscriptwrapper {
     /* The background color comes from the user's choice within the settings overlay */
     background-color: transparent !important;

     /* Overwrite size and whitespace */
     margin: 0 !important;
     max-width: unset !important;
     padding-top: 40px !important;
     padding-bottom: 48px !important;
     padding-inline: 0px !important;
     border-radius: 0px !important;
     & section.level-1 { margin-block: 0px !important };

     /* Patches - for some reason the RSM CSS is broken? */
     & .hr .hr-border-zone .hr-border-dots .icon.dots { padding-bottom: 0 !important };
     & .hr .hr-collapse-zone .hr-collapse .icon.collapse { padding-bottom: 0 !important };
 }
</style>
