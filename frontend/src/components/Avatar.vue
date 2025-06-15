<script setup>
  import { inject, computed, ref, onMounted } from "vue";

  const props = defineProps({
    size: { type: String, default: "md" },
    user: { type: Object, required: true },
  });
  const api = inject("api");

  const avatarUrl = ref(null);
  const hasAvatar = computed(() => !!avatarUrl.value);
  const initials = computed(() => props.user?.initials || props.user?.name?.charAt(0) || "");

  const fetchAvatar = async () => {
    if (!props.user) return;
    try {
      const response = await api.get(`/users/${props.user.id}/avatar`, {
        responseType: "blob",
      });
      if (avatarUrl.value) URL.revokeObjectURL(avatarUrl.value);
      avatarUrl.value = URL.createObjectURL(response.data);
    } catch (error) {
      avatarUrl.value = null;
    }
  };

  onMounted(() => fetchAvatar());

  const style = computed(() => {
    if (props.size === "sm") {
      return {
        backgroundColor: props.user.color,
      };
    }
    return {
      backgroundColor: hasAvatar.value ? "transparent" : props.user.color,
      backgroundImage: hasAvatar.value ? `url(${avatarUrl.value})` : "none",
    };
  });
</script>

<template>
  <div
    class="av-wrapper"
    :class="[hasAvatar ? 'has-avatar' : '', `size-${props.size}`]"
    :style="style"
  >
    <span v-if="!hasAvatar && props.size !== 'sm'" class="av-name">
      {{ initials }}
    </span>
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

  .av-wrapper.size-sm {
    width: 16px;
    height: 16px;
  }

  .av-name {
    color: white;
    font-weight: 600;
    font-size: 14px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    user-select: none;
  }

  .has-avatar {
    border: 2px solid v-bind(props.user.color);
    box-shadow: var(--shadow-soft);
  }
</style>
