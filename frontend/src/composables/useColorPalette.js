import { ref, computed } from 'vue';

/**
 * Composable for standardized color palette management
 * Extracts color logic from ColorPicker, Tag, TagControl and provides
 * consistent color management across components
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.intensity - Color intensity level (default: 300)
 * @param {Object} options.customColors - Custom color definitions
 * @param {boolean} options.mergeWithDefaults - Whether to merge custom colors with defaults
 */
export function useColorPalette(options = {}) {
  const {
    intensity = 300,
    customColors = null,
    mergeWithDefaults = false
  } = options;

  // Default color palette from design system
  const defaultColors = {
    red: `var(--red-${intensity})`,
    purple: `var(--purple-${intensity})`,
    green: `var(--green-${intensity})`,
    orange: `var(--orange-${intensity})`,
    blue: `var(--blue-${intensity})`,
    yellow: `var(--yellow-${intensity})`,
    gray: `var(--gray-${intensity})`,
    pink: `var(--pink-${intensity})`
  };

  // Compute final colors
  const colors = computed(() => {
    if (customColors) {
      return mergeWithDefaults ? { ...defaultColors, ...customColors } : customColors;
    }
    return defaultColors;
  });

  const colorNames = computed(() => Object.keys(colors.value));

  // Selected color state
  const selectedColor = ref('gray');

  // Color utilities
  const getColor = (colorName) => {
    return colors.value[colorName] || colors.value.gray;
  };

  const getColorName = (colorValue) => {
    const entry = Object.entries(colors.value).find(([_, value]) => value === colorValue);
    return entry ? entry[0] : 'gray';
  };

  const getLighterColor = (colorName) => {
    const lighterIntensity = Math.max(100, intensity - 100);
    return `var(--${colorName}-${lighterIntensity})`;
  };

  const getDarkerColor = (colorName) => {
    const darkerIntensity = Math.min(900, intensity + 100);
    return `var(--${colorName}-${darkerIntensity})`;
  };

  // Validation
  const isValidColor = (colorName) => {
    return Boolean(colorName && typeof colorName === 'string' && colors.value[colorName]);
  };

  const isValidColorValue = (colorValue) => {
    return Object.values(colors.value).includes(colorValue);
  };

  // CSS class utilities
  const getColorClass = (colorName) => {
    return isValidColor(colorName) ? `color-${colorName}` : 'color-gray';
  };

  const getBackgroundClass = (colorName) => {
    return isValidColor(colorName) ? `bg-${colorName}` : 'bg-gray';
  };

  // Contrast for accessibility
  const getContrastColor = (colorName) => {
    // Light colors get dark text, dark colors get light text
    const lightColors = ['yellow', 'green', 'orange'];
    return lightColors.includes(colorName) ? 'var(--gray-900)' : 'var(--gray-100)';
  };

  // Reactive color selection
  const setSelectedColor = (colorName) => {
    selectedColor.value = isValidColor(colorName) ? colorName : 'gray';
  };

  const isSelected = (colorName) => {
    return selectedColor.value === colorName;
  };

  const selectedColorValue = computed(() => getColor(selectedColor.value));
  const selectedColorClass = computed(() => getColorClass(selectedColor.value));

  // Color navigation
  const nextColor = () => {
    const names = colorNames.value;
    const currentIndex = names.indexOf(selectedColor.value);
    const nextIndex = (currentIndex + 1) % names.length;
    selectedColor.value = names[nextIndex];
  };

  const previousColor = () => {
    const names = colorNames.value;
    const currentIndex = names.indexOf(selectedColor.value);
    const prevIndex = (currentIndex - 1 + names.length) % names.length;
    selectedColor.value = names[prevIndex];
  };

  const getRandomColor = () => {
    const names = colorNames.value;
    return names[Math.floor(Math.random() * names.length)];
  };

  const setRandomColor = () => {
    selectedColor.value = getRandomColor();
  };

  // Tag-specific utilities
  const getTagColor = (colorName) => {
    const darkerIntensity = Math.min(900, intensity + 400);
    return `var(--${colorName}-${darkerIntensity})`;
  };

  const getTagBackgroundColor = (colorName) => {
    const lighterIntensity = Math.max(100, intensity - 200);
    return `var(--${colorName}-${lighterIntensity})`;
  };

  const getTagBorderColor = (colorName) => {
    return `var(--${colorName}-${intensity})`;
  };

  const getTagHoverColor = (colorName) => {
    const hoverIntensity = Math.max(100, intensity - 100);
    return `var(--${colorName}-${hoverIntensity})`;
  };

  const getTagActiveColor = (colorName) => {
    const activeIntensity = Math.min(900, intensity + 100);
    return `var(--${colorName}-${activeIntensity})`;
  };

  return {
    // Core palette
    colors,
    colorNames,
    getColor,
    getColorName,
    getLighterColor,
    getDarkerColor,

    // Validation
    isValidColor,
    isValidColorValue,

    // CSS utilities
    getColorClass,
    getBackgroundClass,
    getContrastColor,

    // Reactive selection
    selectedColor,
    selectedColorValue,
    selectedColorClass,
    setSelectedColor,
    isSelected,

    // Navigation
    nextColor,
    previousColor,
    getRandomColor,
    setRandomColor,

    // Tag-specific utilities
    getTagColor,
    getTagBackgroundColor,
    getTagBorderColor,
    getTagHoverColor,
    getTagActiveColor
  };
}