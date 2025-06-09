<script setup>
  import { inject, computed, ref, onMounted } from "vue";

  const user = inject("user");
  const api = inject("api");

  const avatarUrl = ref(null);
  const hasAvatar = computed(() => !!avatarUrl.value);
  const initials = computed(() => user.value?.initials || user.value?.name?.charAt(0) || "");

  const fetchAvatar = async () => {
    if (!user.value) return;
    try {
      const response = await api.get(`/users/${user.value.id}/avatar`, { responseType: "blob" });
      if (avatarUrl.value) URL.revokeObjectURL(avatarUrl.value);
      avatarUrl.value = URL.createObjectURL(response.data);
    } catch (error) {
      avatarUrl.value = null;
    }
  };

  onMounted(() => fetchAvatar());
</script>

<template>
  <div
    class="av-wrapper"
    :class="{ 'has-avatar': hasAvatar }"
    :style="{
      backgroundColor: hasAvatar ? 'transparent' : `${user?.color}`,
      backgroundImage: hasAvatar ? `url(${avatarUrl})` : 'none',
    }"
  >
    <span v-if="!hasAvatar" class="av-name">{{ initials }}</span>
  </div>
</template>

<style scoped>
  .av-wrapper {
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-position: center;
    flex-shrink: 0;
  }

  .av-name {
    color: white;
    font-weight: 600;
    font-size: 14px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    user-select: none;
  }

  .has-avatar {
    border: 2px solid v-bind(user.color);
    box-shadow: var(--shadow-soft);
  }
</style>
