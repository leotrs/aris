<script setup>
  import { ref, reactive, computed, inject, useTemplateRef, useId, onMounted } from "vue";

  const icons = reactive([
    { icon: "BookmarkFilled", caption: "Notable", class: "bookmark", active: false },
    { icon: "StarFilled", caption: "Inspiring", class: "star", active: false },
    { icon: "HeartFilled", caption: "Compelling", class: "heart", active: false },
    { icon: "CircleCheckFilled", caption: "Understood", class: "check", active: false },
    { icon: "AlertTriangleFilled", caption: "Important", class: "exclamation", active: false },
    { icon: "HelpSquareRoundedFilled", caption: "Unclear", class: "question", active: false },
    { icon: "QuoteFilled", caption: "Citable", class: "quote", active: false },
  ]);

  const myId = useId();
  const file = inject("file");
  const selfRef = useTemplateRef("self-ref");
  const menuRef = useTemplateRef("menu-ref");
  const deactivateAll = () => {
    for (var i = 0; i < icons.length; i++) {
      icons[i].active = false;
    }
    menuRef.value.toggle();
  };
  const activate = (objToActivate) => {
    for (var i = 0; i < icons.length; i++) {
      if (icons[i].icon == objToActivate.icon) {
        icons[i].active = true;
        break;
      } else {
        icons[i].active = false;
      }
    }

    const currentIcons = file.value.icons || {};
    file.value.icons = {
      ...currentIcons,
      [myId]: { class: icons[i].class, element: selfRef.value.parentElement },
    };
    menuRef.value.toggle();
  };
  const activeObj = computed(() => icons.find((obj) => obj.active));

  const visibility = ref("hidden");
  onMounted(() => {
    const hr = selfRef.value.closest(".hr");
    if (!hr) return;
    hr.addEventListener("mouseenter", () => {
      visibility.value = "visible";
    });
    hr.addEventListener("mouseleave", () => {
      visibility.value = activeObj.value ? "visible" : "hidden";
    });
  });
</script>

<template>
  <div ref="self-ref" class="feedback" :style="{ visibility }">
    <ContextMenu
      ref="menu-ref"
      :icon="activeObj?.icon || 'MoodPlus'"
      :icon-class="activeObj?.class || ''"
      placement="left-start"
    >
      <ContextMenuItem
        v-for="obj in icons"
        :key="obj"
        :icon="obj.icon"
        :caption="obj.caption"
        :icon-class="obj.class"
        @click="() => activate(obj)"
      />
      <Separator />
      <ContextMenuItem icon="X" caption="Remove" @click="deactivateAll" />
    </ContextMenu>
  </div>
</template>

<style scoped></style>
