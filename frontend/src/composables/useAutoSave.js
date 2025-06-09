// useAutoSave.js
import { ref, onMounted, onBeforeUnmount } from "vue";

export function useAutoSave({
  file,
  saveFunction,
  compileFunction = null,
  debounceTime = 2000,
  autoSaveInterval = 30000
}) {
  const saveStatus = ref("idle");
  const lastSaved = ref(Date.now());
  const debounceTimeout = ref(null);
  let autoSaveTimer = null;

  // Save the file with status handling
  async function saveFile() {
    if (!file.value?.source) return;

    try {
      saveStatus.value = "saving";
      await saveFunction(file.value);
      lastSaved.value = Date.now();
      saveStatus.value = "saved";

      setTimeout(() => {
        if (saveStatus.value === "saved") saveStatus.value = "idle";
      }, 3000);
    } catch (error) {
      console.error("Error saving file:", error);
      saveStatus.value = "error";

      setTimeout(() => {
        if (saveStatus.value === "error") saveStatus.value = "pending";
      }, 5000);
    }
  }

  // Handle input with debounce
  async function onInput(e) {
    file.value.source = e.target.value;
    saveStatus.value = "pending";

    if (debounceTimeout.value) clearTimeout(debounceTimeout.value);

    debounceTimeout.value = setTimeout(async () => {
      await saveFile();
      if (compileFunction) compileFunction();
    }, debounceTime);
  }

  // Manual save (for keyboard shortcuts)
  async function manualSave() {
    if (debounceTimeout.value) {
      clearTimeout(debounceTimeout.value);
      debounceTimeout.value = null;
    }
    await saveFile();
  }

  // Function to start auto-save interval
  function startAutoSave() {
    if (autoSaveTimer) return; // Don't start multiple intervals

    autoSaveTimer = setInterval(async () => {
      if (
        saveStatus.value === "pending" ||
        (Date.now() - lastSaved.value >= autoSaveInterval && file.value?.source)
      ) {
        await saveFile();
      }
    }, autoSaveInterval);
  }

  // Function to stop auto-save interval
  function stopAutoSave() {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
      autoSaveTimer = null;
    }
  }

  // Set up auto-save interval only when mounted
  onMounted(() => {
    startAutoSave();
  });

  onBeforeUnmount(() => {
    stopAutoSave();
    if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
  });

  return {
    saveStatus,
    lastSaved,
    onInput,
    manualSave,
    // Expose these for testing purposes
    startAutoSave,
    stopAutoSave
  };
}
