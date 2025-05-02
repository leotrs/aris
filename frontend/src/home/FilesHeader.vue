<script setup>
  import { reactive, inject } from "vue";
  import HeaderLabel from "./FilesHeaderLabel.vue";

  const props = defineProps({
    mode: { type: String, default: "list" },
  });
  const { sortDocs, filterDocs, clearFilterDocs } = inject("userDocs");

  const columnInfo = {
    Title: { sortable: true, filterable: false, sortKey: "title" },
    Map: { sortable: false, filterable: false, sortKey: "" },
    Tags: { sortable: false, filterable: true, sortKey: "" },
    Spacer: {},
    "Last edit": { sortable: true, filterable: false, sortKey: "last_edited_at" },
    /* Owner: { sortable: false, filterable: false, sortKey: "owner_id" }, */
  };
  const columnState = reactive({
    Title: null,
    Progress: null,
    Tags: null,
    "Last edit": null,
    /* Owner: null */
  });
  const shouldShowColumn = inject("shouldShowColumn");

  const handleColumnSortEvent = (columnName, mode) => {
    const sortKey = columnInfo[columnName]["sortKey"];
    if (mode == "asc") {
      sortDocs((a, b) => a[sortKey].localeCompare(b[sortKey]));
    } else if (mode == "desc") {
      sortDocs((a, b) => b[sortKey].localeCompare(a[sortKey]));
    }
    for (let name in columnState) {
      if (name == columnName) continue;
      if (columnInfo[name]["sortable"]) {
        columnState[name] = "";
      }
    }
  };
  const handleColumnFilterEvent = (columnName, tags) => {
    console.log(columnName, tags);
    if (tags.length == 0) {
      clearFilterDocs();
    } else {
      filterDocs((doc) => {
        const filterTagIds = tags.map((t) => t.id);
        const docTagIds = doc.tags.map((t) => t.id);
        return filterTagIds.some((id) => !docTagIds.includes(id));
      });
    }
  };
</script>

<template>
  <Header :class="mode">
    <template v-for="name in Object.keys(columnInfo)">
      <div v-if="name == 'Spacer'" class="spacer"></div>
      <HeaderLabel
        v-if="name !== 'Spacer' && shouldShowColumn(name, mode)"
        v-model="columnState[name]"
        :name="name"
        :sortable="columnInfo[name]['sortable']"
        :filterable="columnInfo[name]['filterable']"
        @sort="(mode) => handleColumnSortEvent(name, mode)"
        @filter="(tags) => handleColumnFilterEvent(name, tags)"
      />
    </template>
    <!-- to complete the grid -->
    <span v-if="mode == 'list'" class="spacer spacer-1"></span>
    <span v-if="mode == 'list'" class="spacer spacer-2"></span>
  </Header>
</template>

<style scoped>
  .pane-header {
    padding-inline: 0;
  }

  .pane-header.list {
    & > *:first-child {
      padding-left: calc(16px - var(--border-med));
      border-top-left-radius: var(--border-radius);
      border-bottom-left-radius: var(--border-radius);
      border-left: var(--border-med) solid transparent;
    }

    & > *:last-child {
      padding-right: 8px;
      border-top-right-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
    }
  }

  .pane-header.cards {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    padding-inline: 8px;

    & > .col-header {
      width: fit-content;
      padding-inline: 8px;
    }
  }
</style>
