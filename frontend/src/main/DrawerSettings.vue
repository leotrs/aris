<script setup>
  import { ref, inject, watch, computed } from "vue";
  import { useSnakeCase } from "@/composables/useCasing.js";

  const props = defineProps({
    file: { type: Object, default: () => {} },
    active: { type: Boolean, required: true },
  });

  // Sync UI with fileSettings object
  const fileSettings = inject("fileSettings");
  const onChangeBackground = (colorName) => {
    fileSettings.background = bgColors[colorName];
  };

  // All available options
  const bgColors = {
    white: "var(--surface-page)",
    gray: "var(--gray-75)",
    orange: "var(--orange-50)",
    green: "var(--green-50)",
  };
  const fgColors = {
    blue: "var(--blue-500)",
    purple: "var(--purple-500)",
    orange: "var(--orange-500)",
    green: "var(--green-500)",
  };
  const fontSizeOptions = ["14px", "16px", "18px"];
  const lineHeightOptions = ["1.2", "1.5", "1.8"];
  const fontFamilyOptions = ["Source Sans 3", "Source Serif 4"];
  const marginWidthOptions = ["0px", "16px", "64px"];

  watch(fileSettings, (newVal) => console.log(newVal));

  // Computed properties for two-way binding between indices and actual values
  const fontSize = computed({
    get: () => fontSizeOptions.indexOf(fileSettings.fontSize),
    set: (index) => {
      if (index >= 0 && index < fontSizeOptions.length) {
        fileSettings.fontSize = fontSizeOptions[index];
      }
    },
  });

  const lineHeight = computed({
    get: () => lineHeightOptions.indexOf(fileSettings.lineHeight),
    set: (index) => {
      if (index >= 0 && index < lineHeightOptions.length) {
        fileSettings.lineHeight = lineHeightOptions[index];
      }
    },
  });

  const fontFamily = computed({
    get: () => fontFamilyOptions.indexOf(fileSettings.fontFamily),
    set: (index) => {
      if (index >= 0 && index < fontFamilyOptions.length) {
        fileSettings.fontFamily = fontFamilyOptions[index];
      }
    },
  });

  const marginWidth = computed({
    get: () => marginWidthOptions.indexOf(fileSettings.marginWidth),
    set: (index) => {
      if (index >= 0 && index < marginWidthOptions.length) {
        fileSettings.marginWidth = marginWidthOptions[index];
      }
    },
  });

  // Buttons: reset and save
  const oldSettings = {};
  watch(
    () => props.active,
    (isActive) => isActive && Object.assign(oldSettings, fileSettings)
  );
  const onReset = () => Object.assign(fileSettings, oldSettings);
  const api = inject("api");

  const onSave = () => {
    const snakeCaseSettings = useSnakeCase(fileSettings);
    api.post(`/settings/${props.file.id}`, snakeCaseSettings);
  };
</script>

<template>
  <div class="settings">
    <div class="content">
      <div class="sec">
        <div class="sec-header">
          <span class="text-h5">Colors</span>
        </div>
        <div class="s-content">
          <div class="row theme">
            <span class="label">Theme</span>
            <span class="control">
              <ThemeSwitch :labels="true" />
            </span>
          </div>
          <div class="row bg">
            <span class="label">Background</span>
            <ColorPicker :colors="bgColors" @change="onChangeBackground" />
          </div>
          <!-- <div class="row accent">
               <span class="label">Accent</span>
               <ColorPicker :colors="fgColors" @change="onChangeBackground" />
               </div> -->
        </div>
      </div>

      <div class="sec">
        <div class="sec-header">
          <span class="text-h5">Font</span>
        </div>
        <div class="s-content">
          <div class="row size">
            <span class="label">Size</span>
            <span class="control">
              <SegmentedControl
                v-model="fontSize"
                :icons="['TextDecrease', 'LetterA', 'TextIncrease']"
                :labels="['small', 'normal', 'large']"
                :tooltips="['base size: 14px', 'base size: 16px', 'base size: 18px']"
                :default-active="fontSize"
              />
            </span>
          </div>
          <div class="row">
            <span class="label">Density</span>
            <span class="control">
              <SegmentedControl
                v-model="lineHeight"
                :labels="['tight', 'normal', 'roomy']"
                :icons="['BaselineDensitySmall', 'BaselineDensityMedium', 'BaselineDensityLarge']"
                :tooltips="['line height: 1.2', 'line height: 1.5', 'line height: 1.8']"
                :default-active="lineHeight"
              />
            </span>
          </div>
          <div class="row style">
            <span class="label">Style</span>
            <span class="control">
              <SegmentedControl
                v-model="fontFamily"
                :labels="['Sans', 'Serif']"
                :tooltips="['Source Sans 3', 'Charter']"
                :default-active="fontFamily"
              />
            </span>
          </div>
        </div>
      </div>
      <div class="sec">
        <div class="sec-header">
          <span class="text-h5">Layout</span>
        </div>
        <div class="s-content">
          <div class="row">
            <span class="label">Margins</span>
            <span class="control">
              <SegmentedControl
                v-model="marginWidth"
                :labels="['narrow', 'normal', 'wide']"
                :icons="['ViewportNarrow', 'Crop11', 'ViewportWide']"
                :tooltips="['twice  normal', 'normal', 'half normal']"
                :default-active="marginWidth"
              />
            </span>
          </div>
          <!-- <div class="row">
               <span class="label">Columns</span>
               <span class="control">
               <SegmentedControl
               :labels="['one', 'two']"
               :icons="['Columns1', 'Columns2']"
               :default-active="0"
               />
               </span>
               </div> -->
        </div>
      </div>
    </div>

    <div class="footer">
      <Button kind="tertiary" text="Reset" @click="onReset" />
      <Button class="cta" kind="primary" text="Save Settings" @click="onSave" />
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
      padding-bottom: 8px;
    }

    & .sec-header {
      height: 40px;
      border-bottom: 2px solid var(--border-primary);
      padding-inline: 8px;
      background-color: var(--gray-200);
      border-radius: 8px 8px 0 0;
      display: flex;
      align-items: center;
    }

    & .s-content {
      display: flex;
      flex-direction: column;
      padding-inline: 8px;
      gap: 16px;
    }
  }

  .sec {
    border-radius: 8px;
    background-color: var(--surface-hover);
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;

    & > button {
      padding-inline: 16px;
    }

    & > .cta {
      padding-inline: 48px;
    }
  }

  .row {
    display: flex;
    justify-content: flex-start;
    gap: 8px;
    align-items: center;

    & .label {
      text-align: left;
      width: 60px;
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
      padding-inline: 2px 8px;
      padding-block: 0px;
      width: 96px;
      display: flex;
      justify-content: center;
    }

    & :deep(.sc-btn:first-child) {
      border-radius: 8px 0 0 8px;
    }

    & :deep(.sc-btn:last-child) {
      border-radius: 0 8px 8px 0;
    }
  }

  .theme {
    & :deep(.sc-btn) {
      padding-inline: 2px 8px !important;
    }
  }

  :is(.bg, .accent) .label {
    width: 96px !important;
  }

  .style {
    & :deep(.sc-btn) {
      letter-spacing: 0.04em;
      height: 32px;
      padding-inline: 8px;
    }

    & :deep(.sc-item .sc-label) {
      text-transform: none;
    }

    & :deep(.sc-item:first-child .sc-label) {
      font-family: "Source Sans 3" !important;
    }

    & :deep(.sc-item:last-child .sc-label) {
      font-family: "Source Serif 4" !important;
    }
  }

  .size {
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
