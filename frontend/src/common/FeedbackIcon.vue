<script setup>
  import { reactive, computed, inject, useTemplateRef, useId } from "vue";

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
  const doc = inject("doc");
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

    const currentIcons = doc.value.icons || {};
    doc.value.icons = {
      ...currentIcons,
      [myId]: { class: icons[i].class, element: selfRef.value.parentElement },
    };
    menuRef.value.toggle();
  };
  const activeObj = computed(() => icons.find((obj) => obj.active));
</script>

<template>
  <div ref="self-ref" class="feedback">
    <ContextMenu
      ref="menu-ref"
      :icon="activeObj?.icon || 'MoodPlus'"
      :class="activeObj?.class || ''"
      placement="left-start"
    >
      <ContextMenuItem
        v-for="obj in icons"
        :key="obj"
        :icon="obj.icon"
        :caption="obj.caption"
        :class="obj.class"
        @click="() => activate(obj)"
      />
      <Separator />
      <ContextMenuItem icon="X" caption="Remove" @click="deactivateAll" />
    </ContextMenu>
  </div>
</template>

<style scoped>
  .cm-wrapper.bookmark > :deep(button > svg),
  .item.bookmark :deep(> svg) {
    color: var(--blue-500);
  }

  .cm-wrapper.star > :deep(button > svg),
  .item.star :deep(> svg) {
    color: var(--yellow-500);
  }

  .cm-wrapper.heart > :deep(button > svg),
  .item.heart :deep(> svg) {
    color: var(--red-500);
  }

  .cm-wrapper.check > :deep(button > svg),
  .item.check :deep(> svg) {
    color: var(--green-500);
  }

  .cm-wrapper.exclamation > :deep(button > svg),
  .item.exclamation :deep(> svg) {
    color: var(--orange-500);
  }

  .cm-wrapper.question > :deep(button > svg),
  .item.question :deep(> svg) {
    color: var(--purple-500);
  }

  .cm-wrapper.quote > :deep(button > svg),
  .item.quote :deep(> svg) {
    color: var(--pink-500);
  }
</style>
