<script setup>
import { ref, watch, nextTick } from "vue";

const props = defineProps({
  tag: { type: Object, required: true },
  active: { type: Boolean, default: false },
});
const renaming = defineModel({ default: false });
const emit = defineEmits(["rename"]);

const textInput = ref(null);
watch(renaming, async (newValue, oldValue) => {
  if (newValue && !oldValue) {
    await nextTick(); // wait for DOM to update
    textInput.value.value = props.tag.name;
    textInput.value.focus();
  }
});
const submit = () => {
  emit("rename", textInput.value.value);
  renaming.value = false;
};
</script>

<template>
  <span class="pill" :class="[active ? 'on' : 'off', tag.color]">
    <span v-if="renaming">
      <input
        ref="textInput"
        type="text"
        @keyup.enter="submit"
        @click.stop
        @dblclick.stop
      />
    </span>
    <span v-else>{{ tag.name }}</span>
  </span>
</template>

<style scoped>
.pill {
  border-radius: 16px;
  padding-inline: 8px;
  padding-block: 4px;
  text-wrap: nowrap;
}

.pill.on {
  &.red {
    background-color: var(--red-500);
    color: var(--red-50);
  }
  &.purple {
    background-color: var(--purple-500);
    color: var(--purple-50);
  }
  &.green {
    background-color: var(--green-500);
    color: var(--green-50);
  }
  &.orange {
    background-color: var(--orange-500);
    color: var(--orange-50);
  }
}

.pill.off {
  &.red {
    border: var(--border-thin) solid var(--red-500);
    color: var(--red-500);
  }
  &.purple {
    border: var(--border-thin) solid var(--purple-500);
    color: var(--purple-500);
  }
  &.green {
    border: var(--border-thin) solid var(--green-500);
    color: var(--green-500);
  }
  &.orange {
    border: var(--border-thin) solid var(--orange-500);
    color: var(--orange-500);
  }
  &.new-tag-color {
    border: var(--border-thin) solid var(--gray-400);
    color: var(--gray-400);
  }
}
</style>
