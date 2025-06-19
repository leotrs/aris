import { describe, it, expect, vi } from 'vitest';
import { ref, computed } from 'vue';
import { useColorPalette } from '@/composables/useColorPalette.js';

describe('useColorPalette composable', () => {
  describe('Color Management', () => {
    it('should provide standard color palette from design system', () => {
      const { colors, colorNames } = useColorPalette();

      expect(colors.value).toEqual({
        red: 'var(--red-300)',
        purple: 'var(--purple-300)',
        green: 'var(--green-300)',
        orange: 'var(--orange-300)',
        blue: 'var(--blue-300)',
        yellow: 'var(--yellow-300)',
        gray: 'var(--gray-300)',
        pink: 'var(--pink-300)'
      });

      expect(colorNames.value).toEqual([
        'red', 'purple', 'green', 'orange', 'blue', 'yellow', 'gray', 'pink'
      ]);
    });

    it('should provide getColor function to retrieve color values', () => {
      const { getColor } = useColorPalette();

      expect(getColor('red')).toBe('var(--red-300)');
      expect(getColor('purple')).toBe('var(--purple-300)');
      expect(getColor('nonexistent')).toBe('var(--gray-300)'); // Should fallback to gray
    });

    it('should provide getColorName function to retrieve color names', () => {
      const { getColorName } = useColorPalette();

      expect(getColorName('var(--red-300)')).toBe('red');
      expect(getColorName('var(--purple-300)')).toBe('purple');
      expect(getColorName('invalid-color')).toBe('gray'); // Should fallback to gray
    });

    it('should support custom color intensity levels', () => {
      const { colors } = useColorPalette({ intensity: 500 });

      expect(colors.value.red).toBe('var(--red-500)');
      expect(colors.value.purple).toBe('var(--purple-500)');
    });

    it('should support different color variants (lighter/darker)', () => {
      const { getLighterColor, getDarkerColor } = useColorPalette();

      expect(getLighterColor('red')).toBe('var(--red-200)');
      expect(getDarkerColor('red')).toBe('var(--red-400)');
    });
  });

  describe('Color Validation', () => {
    it('should validate if a color name is valid', () => {
      const { isValidColor } = useColorPalette();

      expect(isValidColor('red')).toBe(true);
      expect(isValidColor('purple')).toBe(true);
      expect(isValidColor('invalid')).toBe(false);
      expect(isValidColor('')).toBe(false);
      expect(isValidColor(null)).toBe(false);
    });

    it('should validate if a color value is from the palette', () => {
      const { isValidColorValue } = useColorPalette();

      expect(isValidColorValue('var(--red-300)')).toBe(true);
      expect(isValidColorValue('var(--purple-300)')).toBe(true);
      expect(isValidColorValue('#ff0000')).toBe(false);
      expect(isValidColorValue('red')).toBe(false);
    });
  });

  describe('Color Utilities', () => {
    it('should generate color classes for CSS', () => {
      const { getColorClass } = useColorPalette();

      expect(getColorClass('red')).toBe('color-red');
      expect(getColorClass('purple')).toBe('color-purple');
      expect(getColorClass('invalid')).toBe('color-gray');
    });

    it('should generate background color classes', () => {
      const { getBackgroundClass } = useColorPalette();

      expect(getBackgroundClass('red')).toBe('bg-red');
      expect(getBackgroundClass('purple')).toBe('bg-purple');
      expect(getBackgroundClass('invalid')).toBe('bg-gray');
    });

    it('should provide contrast color for accessibility', () => {
      const { getContrastColor } = useColorPalette();

      // Light colors should return dark text
      expect(getContrastColor('yellow')).toBe('var(--gray-900)');
      expect(getContrastColor('green')).toBe('var(--gray-900)');

      // Dark colors should return light text
      expect(getContrastColor('purple')).toBe('var(--gray-100)');
      expect(getContrastColor('blue')).toBe('var(--gray-100)');
    });
  });

  describe('Reactive Color Management', () => {
    it('should provide reactive color selection', () => {
      const { selectedColor, setSelectedColor, isSelected } = useColorPalette();

      expect(selectedColor.value).toBe('gray'); // Default

      setSelectedColor('red');
      expect(selectedColor.value).toBe('red');
      expect(isSelected('red')).toBe(true);
      expect(isSelected('purple')).toBe(false);
    });

    it('should provide computed properties for selected color', () => {
      const { selectedColor, selectedColorValue, selectedColorClass } = useColorPalette();

      selectedColor.value = 'red';

      expect(selectedColorValue.value).toBe('var(--red-300)');
      expect(selectedColorClass.value).toBe('color-red');
    });

    it('should handle invalid color selection gracefully', () => {
      const { selectedColor, setSelectedColor } = useColorPalette();

      setSelectedColor('invalid-color');
      expect(selectedColor.value).toBe('gray'); // Should fallback to default
    });
  });

  describe('Color Cycles and Navigation', () => {
    it('should provide next/previous color functionality', () => {
      const { selectedColor, nextColor, previousColor } = useColorPalette();

      selectedColor.value = 'red'; // First color

      nextColor();
      expect(selectedColor.value).toBe('purple'); // Second color

      previousColor();
      expect(selectedColor.value).toBe('red'); // Back to first

      // Test wrapping
      selectedColor.value = 'pink'; // Last color
      nextColor();
      expect(selectedColor.value).toBe('red'); // Should wrap to first

      selectedColor.value = 'red'; // First color
      previousColor();
      expect(selectedColor.value).toBe('pink'); // Should wrap to last
    });

    it('should provide random color selection', () => {
      const { getRandomColor, setRandomColor, selectedColor } = useColorPalette();

      const randomColor = getRandomColor();
      expect(['red', 'purple', 'green', 'orange', 'blue', 'yellow', 'gray', 'pink']).toContain(randomColor);

      setRandomColor();
      expect(['red', 'purple', 'green', 'orange', 'blue', 'yellow', 'gray', 'pink']).toContain(selectedColor.value);
    });
  });

  describe('Integration with ColorPicker Component', () => {
    it('should provide all necessary data for ColorPicker component', () => {
      const {
        colors,
        colorNames,
        selectedColor,
        setSelectedColor,
        isSelected,
        getColorClass,
        getBackgroundClass
      } = useColorPalette();

      // These should be all the properties ColorPicker needs
      expect(colors.value).toBeDefined();
      expect(colorNames.value).toBeDefined();
      expect(selectedColor.value).toBeDefined();
      expect(typeof setSelectedColor).toBe('function');
      expect(typeof isSelected).toBe('function');
      expect(typeof getColorClass).toBe('function');
      expect(typeof getBackgroundClass).toBe('function');
    });

    it('should work with v-model pattern for ColorPicker', () => {
      const { selectedColor, setSelectedColor } = useColorPalette();

      // Simulate v-model usage
      const modelValue = ref('red');

      // When external model changes, internal state should update
      selectedColor.value = modelValue.value;
      expect(selectedColor.value).toBe('red');

      // When internal state changes, it should emit update
      setSelectedColor('purple');
      modelValue.value = selectedColor.value;
      expect(modelValue.value).toBe('purple');
    });
  });

  describe('Integration with Tag Component', () => {
    it('should provide color utilities for tag styling', () => {
      const { getTagColor, getTagBackgroundColor, getTagBorderColor } = useColorPalette();

      expect(getTagColor('red')).toBe('var(--red-700)'); // Darker for text
      expect(getTagBackgroundColor('red')).toBe('var(--red-100)'); // Lighter for background
      expect(getTagBorderColor('red')).toBe('var(--red-300)'); // Medium for border
    });

    it('should provide hover states for tags', () => {
      const { getTagHoverColor, getTagActiveColor } = useColorPalette();

      expect(getTagHoverColor('red')).toBe('var(--red-200)');
      expect(getTagActiveColor('red')).toBe('var(--red-400)');
    });
  });

  describe('Custom Color Palettes', () => {
    it('should support custom color palette configuration', () => {
      const customColors = {
        primary: 'var(--primary-300)',
        secondary: 'var(--secondary-300)',
        accent: 'var(--accent-300)'
      };

      const { colors, colorNames } = useColorPalette({ customColors });

      expect(colors.value).toEqual(customColors);
      expect(colorNames.value).toEqual(['primary', 'secondary', 'accent']);
    });

    it('should merge custom colors with default palette', () => {
      const customColors = {
        custom1: 'var(--custom1-300)',
        custom2: 'var(--custom2-300)'
      };

      const { colors, colorNames } = useColorPalette({
        customColors,
        mergeWithDefaults: true
      });

      expect(colors.value).toMatchObject({
        red: 'var(--red-300)',
        purple: 'var(--purple-300)',
        custom1: 'var(--custom1-300)',
        custom2: 'var(--custom2-300)'
      });
    });
  });
});