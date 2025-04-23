<script setup>
  import { ref, inject, watch, onMounted } from "vue";
  import { IconFileSettings } from "@tabler/icons-vue";
  import useClosable from "@/composables/useClosable.js";

  const props = defineProps({ doc: { type: Object, default: () => {} } });

  const colors = {
    white: "var(--surface-page)",
    gray: "var(--gray-75)",
    sepia: "#F4E8D5",
    green: "var(--green-50)",
  };

  const selfRef = ref(null);
  onMounted(() => {
    if (!selfRef.value) return;
    useClosable(close, selfRef, true, false);
  });

  const fileSettings = inject("fileSettings");
  const onChangeBackground = (colorName) => {
    fileSettings.background = colors[colorName];
  };

  const onSizeChange = (idx) => {
    if (idx === 0) {
      fileSettings.fontSize = "14px";
    } else if (idx === 1) {
      fileSettings.fontSize = "16px";
    } else if (idx === 2) {
      fileSettings.fontSize = "18px";
    }
  };

  const onDensityChange = (idx) => {
    if (idx === 0) {
      fileSettings.lineHeight = "1.2";
    } else if (idx === 1) {
      fileSettings.lineHeight = "1.5";
    } else if (idx === 2) {
      fileSettings.lineHeight = "1.8";
    }
  };

  const styleControlState = ref(0);
  watch(styleControlState, (newVal) => {
    if (newVal == 0) {
      fileSettings.fontFamily = "Source Sans 3";
    } else if (newVal == 1) {
      fileSettings.fontFamily = "Source Serif 4";
    }
  });
</script>

<template>
  <div ref="selfRef" class="overlay settings">
    <div class="ol-header">
      <div class="left">
        <IconFileSettings />
        <span class="text-h5">Settings</span>
      </div>
      <div class="right">
        <ButtonClose />
      </div>
    </div>

    <div class="ol-content">
      <div class="section">
        <div class="s-header">
          <span class="text-label">Colors</span>
        </div>
        <div class="s-content">
          <div class="row">
            <span class="label">Theme</span>
            <span class="control">
              <SegmentedControl :icons="['Sun', 'SunMoon', 'Moon']" :default-active="1" />
            </span>
          </div>
          <div class="column">
            <span class="label">Background</span>
            <span class="control circles">
              <span
                v-for="(color, name) in colors"
                class="circle"
                :class="name"
                :style="{ 'background-color': color }"
                @click="onChangeBackground(name)"
              >
              </span>
            </span>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="s-header">
          <span class="text-label">Font</span>
        </div>
        <div class="s-content">
          <div class="row size">
            <span class="label">Size</span>
            <span class="control">
              <Slider
                :number-stops="3"
                label-left="Aa"
                label-right="Aa"
                :default-active="1"
                @change="onSizeChange"
              />
            </span>
          </div>
          <div class="row">
            <span class="label">Density</span>
            <span class="control">
              <Slider
                :number-stops="3"
                icon-left="BaselineDensitySmall"
                icon-right="BaselineDensityLarge"
                :default-active="1"
                @change="onDensityChange"
              />
            </span>
          </div>
          <div class="row style">
            <span class="label">Style</span>
            <span class="control">
              <SegmentedControl
                v-model="styleControlState"
                :labels="['sans', 'serif']"
                :default-active="0"
              />
            </span>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="s-header">
          <span class="text-label">Layout</span>
        </div>
        <div class="s-content">
          <div class="row">
            <span class="label">Margins</span>
            <span class="control">
              <Slider
                :number-stops="3"
                icon-left="ViewportNarrow"
                icon-right="ViewportWide"
                :default-active="1"
              />
            </span>
          </div>
          <div class="row">
            <span class="label">Column</span>
            <span class="control">
              <SegmentedControl :icons="['ColumnsOff', 'Columns']" :default-active="0" />
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="ol-footer">
      <Button kind="secondary" text="Cancel" />
      <Button kind="primary" text="Save" />
    </div>
  </div>
</template>

<style scoped>
  .overlay {
    min-width: 216px;
    display: flex;
    flex-direction: column;
    background-color: var(--surface-primary);
    border: var(--border-thin) solid var(--border-primary);
    border-radius: 16px;
    padding: 16px;
    gap: 16px;
    position: fixed;
    z-index: 100;
  }

  .ol-header {
    display: flex;
    justify-content: space-between;
    background-color: var(--surface-information);
    border-radius: 8px;
    padding-inline: 8px;
    padding-block: 4px;

    & .left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .ol-content {
    display: flex;
    flex-direction: column;
    gap: 24px;

    & .section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    & .s-header {
      background-color: var(--surface-information);
      border-radius: 8px;
      padding-inline: 8px;
    }

    & .s-content {
      display: flex;
      flex-direction: column;
      padding-inline: 8px;
      gap: 8px;
    }
  }

  .ol-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-inline: 8px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & .label {
      min-width: 64px;
    }

    & .control {
      flex-grow: 1;
    }
  }

  .row.size :deep(.s-wrapper) {
    align-items: baseline !important;
  }

  .row.size :deep(.s-label:first-child) {
    font-size: 14px !important;
    width: 20px;
    height: 20px;
    margin: 6px;
    margin-bottom: 2px;
    padding-inline: 2.5px;
  }

  .row.size :deep(.s-label:last-child) {
    font-size: 18px !important;
    width: 20px;
    height: 20px;
    padding-inline: 0.5px;
    margin: 6px;
  }

  .row.style :deep(.sc-item:first-child) {
    padding: 4px 4px 4px 8px !important;
  }
  .row.style :deep(.sc-item:first-child .sc-label) {
    font-family: "Source Sans 3" !important;
  }

  .row.style :deep(.sc-item:last-child) {
    padding: 4px 8px 4px 4px !important;
  }
  .row.style :deep(.sc-item:last-child .sc-label) {
    font-family: "Source Serif 4" !important;
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  :deep(.sc-btn) {
    padding: 0 !important;
  }
</style>
