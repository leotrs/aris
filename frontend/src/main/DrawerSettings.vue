<script setup>
  import { ref, inject, watch } from "vue";

  const props = defineProps({
    file: { type: Object, default: () => {} },
    active: { type: Boolean, required: true },
  });

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

  // Sync UI with fileSettings object
  const fileSettings = inject("fileSettings");
  const onChangeBackground = (colorName) => {
    fileSettings.background = bgColors[colorName];
  };

  const fontSize = ref(fileSettings.fontSize);
  const fontSizeOptions = ["14px", "16px", "18px"];
  watch(fontSize, (idx) => (fileSettings.fontSize = fontSizeOptions[idx]));

  const lineHeight = ref(fileSettings.lineHeight);
  const lineHeightOptions = ["1.2", "1.5", "1.8"];
  watch(lineHeight, (idx) => (fileSettings.lineHeight = lineHeightOptions[idx]));

  const fontFamily = ref(fileSettings.fontFamily);
  const fontFamilyOptions = ["Source Sans 3", "Source Serif 4"];
  watch(fontFamily, (idx) => (fileSettings.fontFamily = fontFamilyOptions[idx]));

  const marginWidth = ref(fileSettings.marginWidth);
  const marginWidthOptions = ["0px", "16px", "64px"];
  watch(marginWidth, (idx) => (fileSettings.marginWidth = marginWidthOptions[idx]));

  // Buttons: cancel and save
  const oldSettings = {};
  watch(
    () => props.active,
    (newVal) => {
      if (newVal) Object.assign(oldSettings, fileSettings);
    }
  );
  const onReset = () => {
    Object.assign(fileSettings, oldSettings);
    fontSize.value = fontSizeOptions.indexOf(oldSettings.fontSize);
    lineHeight.value = lineHeightOptions.indexOf(oldSettings.lineHeight);
    fontFamily.value = fontFamilyOptions.indexOf(oldSettings.fontFamily);
    marginWidth.value = marginWidthOptions.indexOf(oldSettings.marginWidth);
    console.log(fontSize.value);
  };

  const api = inject("api");
  const onSave = () => {
    console.log("save");
    api.post(`/settings/${props.file.id}`, fileSettings);
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
                :default-active="fontSizeOptions?.indexOf(fileSettings.fontSize) ?? 0"
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
                :default-active="lineHeightOptions?.indexOf(fileSettings.lineHeight) ?? 0"
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
                :default-active="fontFamilyOptions?.indexOf(fileSettings.fontFamily) ?? 0"
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
                :default-active="marginWidthOptions?.indexOf(fileSettings.marginWidth) ?? 0"
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
