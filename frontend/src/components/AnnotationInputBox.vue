<script setup>
  import {} from "vue";

  const props = defineProps({
    expanded: { type: Boolean, default: true },
  });
  const emit = defineEmits(["submit"]);
  const value = defineModel({ type: String, default: "" });

  const onSubmit = () => {
    emit("submit", value.value);
  };
</script>

<template>
  <div class="ann-input-box" :class="expanded ? 'expanded' : ''">
    <InputText v-model="value" @keyup.enter="onSubmit" />
    <div class="buttons">
      <Button v-if="expanded" class="edit" kind="tertiary" size="sm" icon="Edit" />
      <Button class="send" kind="tertiary" size="sm" icon="Send2" @click="onSubmit" />
    </div>
  </div>
</template>

<style scoped>
  .ann-input-box {
    position: relative;
    display: flex;
  }

  .buttons {
    position: absolute;
    right: 1px;
    top: 1px;

    & > button {
      height: 30px;
      width: 30px;
    }

    & :deep(.tabler-icon) {
      color: var(--dark) !important;
    }
  }

  .input-text {
    height: 32px;
  }

  .ann-input-box.expanded .input-text {
    height: 64px;
  }
</style>
