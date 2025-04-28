<script setup>
  import { ref, inject, watch } from "vue";
  import { IconFileSettings } from "@tabler/icons-vue";

  const props = defineProps({ doc: { type: Object, default: () => {} } });

  const colors = {
    white: "var(--surface-page)",
    gray: "var(--gray-75)",
    sepia: "#F4E8D5",
    green: "var(--green-50)",
  };

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
  <div class="settings">
    <div class="content">
      <div class="sec">
        <div class="sec-header">
          <span class="text-label">Colors</span>
        </div>
        <div class="s-content">
          <div class="row">
            <span class="label">Theme</span>
            <span class="control">
              <ThemeSwitch />
            </span>
          </div>
          <div class="row">
            <span class="label">Background</span>
            <ColorPicker :colors="colors" @change="onChangeBackground" />
          </div>
        </div>
      </div>
      <div class="sec">
        <div class="sec-header">
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
      <div class="sec">
        <div class="sec-header">
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

    <div class="footer">
      <Button kind="secondary" text="Reset" />
      <Button kind="secondary" text="Cancel" />
      <Button kind="primary" text="Save" />
    </div>
  </div>
</template>

<style scoped>
  .settings {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 24px;

    & .sec {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    & .sec-header {
      height: 32px;
      border-bottom: 2px solid var(--border-information);
      padding-inline: 8px;
    }

    & .s-content {
      display: flex;
      flex-direction: column;
      padding-inline: 8px;
      gap: 8px;
    }
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-inline: 8px;
  }

  .row {
    display: flex;
    justify-content: flex-start;
    gap: 24px;
    align-items: center;

    & .label {
      text-align: left;
      width: 80px;
    }

    & .control {
      flex-grow: 1;
    }
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .control {
    & :deep(.sc-btn) {
      padding: 0;
    }

    & :deep(.sc-btn .tabler-icon) {
      margin: 4px;
    }

    & :deep(.sc-btn:first-child .tabler-icon) {
      margin-left: 6px;
    }

    & :deep(.sc-btn:last-child .tabler-icon) {
      margin-right: 6px;
    }
  }

  .style {
    & :deep(.sc-item .sc-label) {
      padding-block: 4px;
      padding-inline: 6px;
    }

    & :deep(.sc-item:first-child .sc-label) {
      font-family: "Source Sans 3" !important;
    }

    & :deep(.sc-item:last-child .sc-label) {
      font-family: "Source Serif 4" !important;
    }
  }

  .size {
    & :deep(.s-wrapper) {
      align-items: baseline !important;
    }

    & :deep(.s-label:first-child) {
      font-size: 14px !important;
      width: 20px;
      height: 20px;
      margin: 6px;
      margin-bottom: 2px;
      padding-inline: 2.5px;
    }

    & :deep(.s-label:last-child) {
      font-size: 18px !important;
      width: 20px;
      height: 20px;
      padding-inline: 0.5px;
      margin: 6px;
    }
  }
</style>
