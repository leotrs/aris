import { ref } from "vue";

export function useEditableText(initialValue = "", options = {}) {
  const { onSave = () => {}, onCancel = () => {}, immediate = false } = options;

  const text = ref(initialValue);
  const inputValue = ref(initialValue);
  const isEditing = ref(immediate);

  const startEditing = () => {
    inputValue.value = text.value;
    isEditing.value = true;
  };

  const cancelEditing = () => {
    isEditing.value = false;
    inputValue.value = text.value;
    onCancel();
  };

  const saveChanges = () => {
    text.value = inputValue.value;
    isEditing.value = false;
    onSave(text.value);
  };

  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      cancelEditing();
    } else if (event.key === "Enter") {
      saveChanges();
    }
  };

  return {
    text,
    inputValue,
    isEditing,
    startEditing,
    cancelEditing,
    saveChanges,
    handleKeydown,
  };
}
