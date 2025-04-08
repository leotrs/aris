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
 }

 .sc-item {
     padding-block: 4px;
     display: flex;
     align-items: center;
     padding-inline: calc(8px - 2*var(--border-thin));
     border-radius: 4px;
     border-width: var(--border-thin);
     border-style: solid;

     &:first-child {
         border-top-left-radius: 16px;
         border-bottom-left-radius: 16px;
         padding-left: calc(8px - 2*var(--border-thin) + 1px);
         padding-right: calc(8px - 2*var(--border-thin) - 1px);
     }
     
     &:last-child {
         border-top-right-radius: 16px;
         border-bottom-right-radius: 16px;
         padding-left: calc(8px - 2*var(--border-thin) - 1px);
         padding-right: calc(8px - 2*var(--border-thin) + 1px);
     }

     &.active {
         color: var(--extra-dark);
         background-color: var(--surface-information);
         border-color: var(--border-action);
     }

     &:not(.active) {
         cursor: pointer;
         color: var(--dark);
         background-color: var(--surface-hover);
         border-color: var(--surface-hover);
         & > .sc-icon { color: var(--dark) }

         &:hover {
             border-color: var(--dark);
             & > .sc-icon { color: var(--extra-dark) }
         }
     }
 }
</style>
