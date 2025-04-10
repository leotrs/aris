<script setup>
import { ref, inject } from 'vue';
import { IconSearch } from '@tabler/icons-vue';

const searchText = ref("");
const { userDocs, filterDocs, clearFilterDocs } = inject('userDocs');

const submit = () => {
  console.log('submit');
  clearFilterDocs();
  filterDocs((doc) => !doc.title.toLowerCase().includes(searchText.value.toLowerCase()));
}
</script>


<template>
  <div class="s-wrapper text-caption">
    <IconSearch />
    <input
      type="text"
      placeholder="Search..."
      v-model="searchText"
      @keyup.enter="submit"
      @keyup.ESC="(searchText = '') && submit()"
      @click.stop
      @dblclick.stop />
  </div>
</template>


<style scoped>
.s-wrapper {
  color: var(--extra-dark);
  background-color: var(--surface-primary);
  border: 2px solid var(--border-primary);
  border-radius: 16px;
  height: 48px;
  min-width: 280;
  display: flex;
  align-items: center;
  padding-block: 12px;
  padding-inline: 16px;
  gap: 16px;

  & > .tabler-icon {
    margin: unset;
  }

  &:hover {
    cursor: text;
  }

}
</style>
