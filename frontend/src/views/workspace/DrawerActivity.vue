<script setup>
  import {} from "vue";
</script>

<template>
  <Pane>
    <template #header>Activity</template>
    <Section variant="enhanced">
      <template #title>Latest Changes</template>
      <template #content>
        <p>As a fun timeline</p>
      </template>
    </Section>
    <Section variant="enhanced">
      <template #title>Version History</template>
      <template #content>
        <p>List with quick actions: view, revert, compare, delete</p>
      </template>
    </Section>
  </Pane>
</template>

<style scoped></style>
