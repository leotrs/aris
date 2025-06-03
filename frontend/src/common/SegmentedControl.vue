<script setup>
  import { computed, onMounted } from "vue";
  import * as Icons from "@tabler/icons-vue";

  const props = defineProps({
    icons: { type: Array, default: null },
    labels: { type: Array, default: null },
    defaultActive: { type: Number, default: -1 },
  });

  const numItems = computed(() => {
    if (props.icons === null && props.labels === null) {
      console.error("Must provide one of icons or labels");
      return 0;
    } else if (props.icons === null && props.labels !== null) {
      return props.labels.length;
    } else if (props.icons !== null && props.labels === null) {
      return props.icons.length;
    } else if (props.icons !== null && props.labels !== null) {
      if (props.icons.length != props.labels.length) {
        console.error("Lengths of icons and labels must match");
        return 0;
      } else {
        return props.icons.length;
      }
    }
  });

  const active = defineModel({ type: Number, default: -1 });
  onMounted(() => (active.value = props.defaultActive));
  const click = (idx) => (active.value = idx);
</script>

<template>
  <div class="sc-wrapper">
    <template v-for="idx in numItems">
      <button
        type="button"
        class="sc-item sc-btn"
        :class="{ active: idx - 1 == active }"
        @click="click(idx - 1)"
      >
        <component :is="Icons['Icon' + icons[idx - 1]]" v-if="icons" class="sc-icon" />
        <span v-if="labels" class="sc-label text-default">{{ labels[idx - 1] }}</span>
      </button>
    </template>
  </div>
</template>

<style scoped>
  .sc-wrapper {
    border-radius: 16px;
    display: flex;
    gap: 4px;
  }

  .sc-item {
    --padding-inline: 10px;

    padding-block: 6px;
    display: flex;
    align-items: center;
    padding-inline: calc(var(--padding-inline) - 2 * var(--border-thin));
    border-radius: 4px;
    transition: var(--transition-bd-color), var(--transition-bg-color);

    &:first-child,
    &:last-child {
      padding-left: calc(var(--padding-inline));
      padding-right: calc(var(--padding-inline));
    }

    &:first-child {
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
    }

    &:last-child {
      border-top-right-radius: 16px;
      border-bottom-right-radius: 16px;
    }

    &.active {
      color: var(--almost-black);
      background-color: var(--purple-300);
      border-color: transparent;
      box-shadow: var(--shadow-soft), var(--shadow-strong);

      & > .sc-icon {
        color: var(--almost-black);
      }
    }

    &:not(.active) {
      cursor: pointer;
      color: var(--dark);
      background-color: var(--white);

      & > .sc-icon {
        color: var(--dark);
      }

      &:hover {
        box-shadow: var(--shadow-strong);
        background-color: var(--purple-100);
        color: var(--extra-dark);
        & > .sc-icon {
          color: var(--extra-dark);
        }
      }
    }

    &:focus-visible {
      background-color: var(--surface-hover);
      outline-offset: var(--border-extrathin);

      & > .sc-icon {
        color: var(--dark);
      }

      &:hover {
        & > .sc-icon {
          color: var(--extra-dark);
        }
      }
    }
  }
</style>
