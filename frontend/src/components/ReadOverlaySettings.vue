<script setup>
 import { defineEmits } from 'vue';
 import Button from '../components/Button.vue';
 import ButtonClose from '../components/ButtonClose.vue';
 import SegmentedControl from '../components/SegmentedControl.vue';
 import Slider from '../components/Slider.vue';
 import { IconFileSettings } from '@tabler/icons-vue';

 const emit = defineEmits(['set-background']);
 const colors = {
     page: "var(--surface-page)",
     gray: "var(--gray-50)",
     sepia: "var(--orange-50)",
     green: "var(--green-50)",
     blue: "var(--blue-50)"
 }
</script>


<template>
  <div class="overlay settings">

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
                  @click="$emit('set-background', color)" >
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
          <div class="row">
            <span class="label">Size</span>
            <span class="control">
              <Slider :number-stops="3" icon-left="LetterA" icon-right="LetterA" :default-active="0" />
            </span>
          </div>
          <div class="row">
            <span class="label">Density</span>
            <span class="control">
              <Slider :number-stops="3" icon-left="BaselineDensityLarge" icon-right="BaselineDensitySmall" :default-active="0" />
            </span>
          </div>
          <div class="row">
            <span class="label">Style</span>
            <span class="control">
              <SegmentedControl :icons="['LetterA', 'LetterA']" :default-active="0" />
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
              <Slider :number-stops="3" icon-left="ViewportNarrow" icon-right="ViewportWide" :default-active="0" />
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
     min-width: 200px;
     display: flex;
     flex-direction: column;
     background-color: var(--surface-primary);
     border: var(--border-thin) solid var(--border-primary);
     border-radius: 16px;
     padding: 16px;
     gap: 24px;
     position: relative;
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
 }

 .column {
     display: flex;
     flex-direction: column;
     gap: 4px;
 }

 .control.circles {
     display: flex;
     justify-content: space-between;
 }

 .circle {
     display: inline-block;
     width: 32px;
     height: 32px;
     border-radius: 16px;
     border: var(--border-thin) solid var(--dark);
 }


 :deep(.sc-btn) {
     padding: 0 !important;
 }
</style>
