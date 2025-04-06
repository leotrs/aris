<script setup>
 import * as Icons from '@tabler/icons-vue';
 import { ref, onMounted } from 'vue';

 const props = defineProps({
     icons: Array,
     defaultActive: { type: Number, default: 0 }
 });
 const emits = defineEmits(["change"]);
 const active = ref(0);

 const setActive = (n) => { active.value = n };
 onMounted(() => { setActive(props.defaultActive) });

 const click = (idx) => {
     setActive(idx);
     emits("change", idx);
 }
</script>


<template>
  <div class="sc-wrapper">
    <span
        v-for="(icon, idx) in icons"
        :key="idx" class="sc-item"
        :class="['sc-btn', {'active': idx == active}]"
        @click="click(idx)" >
      <component :is="Icons['Icon' + icon]" class="sc-icon" />
    </span>
  </div>
</template>


<style scoped>
 .sc-wrapper {
     border-radius: 16px;
     display: flex;
     gap: 4px;

     & .sc-item {
         border-radius: 4px;
     }
     & .sc-item:first-child {
         border-top-left-radius: 16px;
         border-bottom-left-radius: 16px;
     }
     & .sc-item:last-child {
         border-top-right-radius: 16px;
         border-bottom-right-radius: 16px;
     }
 }

 .sc-item {
     padding-block: 4px;
     display: flex;
     align-items: center;

     &.active {
         color: var(--extra-dark);
         background-color: var(--surface-information);
         border: var(--border-thin) solid var(--border-action);
         padding-inline: calc(8px - var(--border-thin));
     }

     &:not(.active) {
         cursor: pointer;
         color: var(--dark);
         background-color: var(--surface-hover);
         padding-inline: 8px;
         & > .sc-icon { color: var(--dark) }

         &:hover {
             border: var(--border-thin) solid var(--dark);
             padding-inline: calc(8px - var(--border-thin));
             & > .sc-icon { color: var(--extra-dark) }
         }
     }
 }
</style>
