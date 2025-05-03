import { ref, watch, nextTick } from "vue";
import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts.js";

export function useListKeyboardNavigation(listLengthRef, rootElementRef, useEscape = false, autoActivate = true) {
  // console.log("Composable init:", {
  //   listLengthRefValue: listLengthRef?.value,
  //   rootElementRefValue: rootElementRef?.value
  // });
  const activeIndex = ref(null);

  watch(listLengthRef, (newVal) => {
    // console.log("List length changed in composable:", newVal);
  }, { immediate: true });
  watch(activeIndex, (newVal) => {
    // console.log("Active index changed in composable:", newVal);
  }, { immediate: true });

  const nextItem = (ev) => {
    ev.preventDefault();
    // console.log("next", {
    //   listLength: listLengthRef?.value,
    //   currentIndex: activeIndex.value,
    //   rootElement: rootElementRef?.value,
    //   type: typeof listLengthRef?.value
    // });
    if (!listLengthRef?.value || listLengthRef.value < 1) {
      console.warn("List length is invalid:", listLengthRef?.value);
      return;
    }

    const newIndex = activeIndex.value === null
      ? 0
      : (activeIndex.value + 1) % listLengthRef.value;
    activeIndex.value = newIndex;
    // console.log("Updating activeIndex to:", newIndex);
  };

  const prevItem = (ev) => {
    ev.preventDefault();
    // console.log("prev", {
    //   listLength: listLengthRef?.value,
    //   currentIndex: activeIndex.value,
    //   rootElement: rootElementRef?.value,
    //   type: typeof listLengthRef?.value
    // });
    if (!listLengthRef?.value || listLengthRef.value < 1) {
      console.warn("List length is invalid:", listLengthRef?.value);
      return;
    }

    const newIndex = activeIndex.value === null
      ? 0
      : (activeIndex.value + listLengthRef.value - 1) % listLengthRef.value;
    activeIndex.value = newIndex;
    // console.log("Updating activeIndex to:", newIndex);
  };

  const clearSelection = (ev) => {
    ev.preventDefault();
    activeIndex.value = null;
  };

  watch(activeIndex, (newVal) => {
    // console.log(newVal, listLengthRef.value, rootElementRef.value);
    if (newVal === null) return;
    if (Number.isNaN(newVal)) return;
    nextTick(() => {
      const el = rootElementRef.value?.querySelector(`.item:nth-child(${newVal + 1})`);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  });

  const shortcuts = {
    j: nextItem,
    k: prevItem,
    arrowdown: nextItem,
    arrowup: prevItem,
    ...(useEscape ? { escape: clearSelection } : {}),
  };
  // Register keyboard shortcuts; allow manual control of activation
  const { activate, deactivate } = useKeyboardShortcuts(shortcuts, autoActivate);

  return {
    activeIndex,
    nextItem,
    prevItem,
    clearSelection,
    activate,
    deactivate,
  };
}
