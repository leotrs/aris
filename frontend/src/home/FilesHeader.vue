<script setup>
  import { reactive, inject } from "vue";
  import HeaderLabel from "./FilesHeaderLabel.vue";

  const props = defineProps({
    mode: { type: String, default: "list" },
  });
  const emit = defineEmits(["set-selected"]);
  const { sortDocs, filterDocs, clearFilterDocs } = inject("userDocs");

  const columnInfo = {
    Title: { sortable: true, filterable: false, sortKey: "title" },
    Progress: { sortable: false, filterable: false, sortKey: "" },
    Tags: { sortable: false, filterable: true, sortKey: "" },
    "Edited on": { sortable: true, filterable: false, sortKey: "last_edited_at" },
    /* Owner: { sortable: false, filterable: false, sortKey: "owner_id" }, */
  };
  const columnState = reactive({
    Title: null,
    Progress: null,
    Tags: null,
    "Edited on": null,
    /* Owner: null */
  });

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
        columnState[name] = null;
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
  <div class="pane-header text-label" :class="mode">
    <span v-if="mode == 'cards'">Sort by:</span>
    <template v-for="name in Object.keys(columnInfo)">
      <HeaderLabel
        v-if="mode == 'list' || (mode == 'cards' && !columnInfo[name]['sortable'])"
        :name="name"
        v-model="columnState[name]"
        @sort="(mode) => handleColumnSortEvent(name, mode)"
        @filter="(tags) => handleColumnFilterEvent(name, tags)"
        :sortable="columnInfo[name]['sortable']"
        :filterable="columnInfo[name]['filterable']"
      />
    </template>
    <!-- to complete the grid -->
    <span v-if="mode == 'list'" class="spacer spacer-1"></span>
    <span v-if="mode == 'list'" class="spacer spacer-2"></span>
  </div>
</template>

<style scoped>
  .pane-header {
    background-color: var(--surface-information);
  }

  .pane-header.list {
    display: contents;
    grid-column: 1 / 6;

    & > *:first-child {
      padding-left: 16px;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    & > *:last-child {
      padding-right: 8px;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }

  .pane-header.cards {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-inline: 16px;
    margin-bottom: 16px;

    & > .col-header {
      width: fit-content;
      padding-inline: 8px;
    }
  }

  .spacer {
    background-color: var(--surface-information);
  }
</style>
