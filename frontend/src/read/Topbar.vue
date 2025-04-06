<script setup>
 const props = defineProps({
     title: { type: String }
 })
</script>


<template>
  <div class="tb-wrapper">

    <div class="left-column">
      <div class="title">{{ title }}</div>
    </div>

    <div class="middle-column">
    </div>

    <div class="right-column">
      <Button kind="tertiary" icon="Sparkles"/>
      <Button kind="tertiary" icon="Share3"/>
      <Button kind="tertiary" icon="Lifebuoy"/>
      <Button kind="tertiary"><Avatar name="TER" /></Button>
    </div>
  </div>
</template>


<style scoped>
 .tb-wrapper {
     display: flex;
     min-height: 64px;
     max-height: 64px;
     width: calc(100% - 64px);
     position: fixed;
     background-color: var(--extra-light);
     z-index: 1;

     &:has( > .middle-column.empty) {
         background-color: transparent;
         & > .left-column, & > .right-column { background-color: var(--surface-page) };
     }
 }

 .left-column, .right-column {
     flex-basis: 292px;
     display: flex;
     align-items: center;
 }

 .left-column {
     padding-inline: 16px;
     &:has( + .middle-column.empty) {
     }
 }

 .right-column {
     justify-content: flex-end;
     padding-inline: 8px;
     gap: 8px;
 }

 .middle-column {
     flex-grow: 1;
 }

 .middle-column.empty {
     background-color: var(--surface-page);
 }

</style>
