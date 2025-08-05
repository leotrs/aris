import { ref, computed, onMounted } from "vue";

export const useDarkMode = () => {
  // Reactive state for dark mode
  const isDarkMode = ref(false);
  const isHydrated = ref(false);

  // Computed property for theme class
  const themeClass = computed(() => (isDarkMode.value ? "dark-theme" : ""));

  // Check if user prefers dark mode based on system preference
  const getSystemPreference = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  // Get stored preference or fall back to system preference
  const getStoredPreference = () => {
    if (typeof window === "undefined") return null;

    try {
      const stored = localStorage.getItem("dark-mode");
      if (stored === null) return null;
      return stored === "true";
    } catch (error) {
      console.warn("Failed to read dark mode preference from localStorage:", error);
      return null;
    }
  };

  // Save preference to localStorage
  const savePreference = (value) => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("dark-mode", value.toString());
    } catch (error) {
      console.warn("Failed to save dark mode preference to localStorage:", error);
    }
  };

  // Apply theme to document body
  const applyTheme = (dark) => {
    if (typeof document === "undefined") return;

    if (dark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    applyTheme(isDarkMode.value);
    savePreference(isDarkMode.value);
  };

  // Set dark mode explicitly
  const setDarkMode = (value) => {
    isDarkMode.value = value;
    applyTheme(isDarkMode.value);
    savePreference(isDarkMode.value);
  };

  // Initialize dark mode on client side
  const initializeDarkMode = () => {
    if (typeof window === "undefined") return;

    // Get stored preference, or fall back to system preference
    const storedPreference = getStoredPreference();
    const initialValue = storedPreference !== null ? storedPreference : getSystemPreference();

    isDarkMode.value = initialValue;
    applyTheme(isDarkMode.value);
    isHydrated.value = true;

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemPreferenceChange = (e) => {
      // Only update if user hasn't set a manual preference
      if (getStoredPreference() === null) {
        isDarkMode.value = e.matches;
        applyTheme(isDarkMode.value);
      }
    };

    mediaQuery.addEventListener("change", handleSystemPreferenceChange);

    // Return cleanup function
    return () => {
      mediaQuery.removeEventListener("change", handleSystemPreferenceChange);
    };
  };

  // Mount lifecycle
  onMounted(() => {
    const cleanup = initializeDarkMode();

    // Return cleanup function for component unmount
    return cleanup;
  });

  return {
    isDarkMode: computed(() => isDarkMode.value),
    isHydrated: computed(() => isHydrated.value),
    themeClass,
    toggleDarkMode,
    setDarkMode,
    initializeDarkMode,
  };
};
