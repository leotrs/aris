import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref, nextTick } from 'vue';
import BaseInput from '@/components/BaseInput.vue';

// Mock the useFormField composable
vi.mock('@/composables/useFormField.js', () => ({
  useFormField: vi.fn(() => ({
    value: ref(''),
    focused: ref(false),
    error: ref(''),
    inputClass: ref({ row: true, focused: false, error: false }),
    validate: vi.fn(),
    setFocus: vi.fn(),
    setBlur: vi.fn(),
    clearError: vi.fn()
  }))
}));

describe('BaseInput.vue (New Component)', () => {
  describe('Basic Functionality', () => {
    it('should render as a basic input field', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 'test value',
          placeholder: 'Enter text...'
        }
      });

      const input = wrapper.find('[data-testid="base-input"]');
      expect(input.exists()).toBe(true);
      expect(input.attributes('placeholder')).toBe('Enter text...');
    });

    it('should use useFormField composable for form logic', async () => {
      const mockUseFormField = (await vi.importMock('@/composables/useFormField.js')).useFormField;

      mount(BaseInput, {
        props: {
          direction: 'column',
          required: true
        }
      });

      expect(mockUseFormField).toHaveBeenCalledWith(
        expect.objectContaining({
          direction: 'column',
          required: true
        })
      );
    });

    it('should emit update:modelValue on input change', async () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: ''
        }
      });

      await wrapper.find('[data-testid="base-input"]').setValue('new value');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['new value']);
    });
  });

  describe('Slot-based Customization', () => {
    it('should support prepend slot for icons/buttons', () => {
      const wrapper = mount(BaseInput, {
        slots: {
          prepend: '<div data-testid="prepend-content">🔍</div>'
        }
      });

      expect(wrapper.find('[data-testid="prepend-content"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="prepend-content"]').text()).toBe('🔍');
    });

    it('should support append slot for buttons/actions', () => {
      const wrapper = mount(BaseInput, {
        slots: {
          append: '<button data-testid="append-button">Search</button>'
        }
      });

      expect(wrapper.find('[data-testid="append-button"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="append-button"]').text()).toBe('Search');
    });

    it('should support both prepend and append slots simultaneously', () => {
      const wrapper = mount(BaseInput, {
        slots: {
          prepend: '<span data-testid="icon">🔍</span>',
          append: '<button data-testid="clear">×</button>'
        }
      });

      expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="clear"]').exists()).toBe(true);
    });

    it('should support error slot for custom error display', () => {
      const wrapper = mount(BaseInput, {
        props: {
          error: 'Custom error message'
        },
        slots: {
          error: '<div data-testid="custom-error" class="error-custom">{{ error }}</div>'
        }
      });

      expect(wrapper.find('[data-testid="custom-error"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="custom-error"]').classes()).toContain('error-custom');
    });
  });

  describe('Variant Support (Search Input)', () => {
    it('should support search variant with search-specific features', () => {
      const wrapper = mount(BaseInput, {
        props: {
          variant: 'search',
          withButtons: true,
          showIcon: true
        },
        slots: {
          'search-buttons': `
            <button data-testid="prev-btn" @click="$emit('prev')">‹</button>
            <button data-testid="next-btn" @click="$emit('next')">›</button>
          `
        }
      });

      expect(wrapper.find('[data-testid="prev-btn"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="next-btn"]').exists()).toBe(true);
      expect(wrapper.classes()).toContain('variant-search');
    });

    it('should emit search-specific events when variant is search', async () => {
      const wrapper = mount(BaseInput, {
        props: {
          variant: 'search'
        },
        slots: {
          'search-buttons': `
            <button data-testid="submit-btn" @click="$emit('submit', 'search term')">Search</button>
          `
        }
      });

      await wrapper.find('[data-testid="submit-btn"]').trigger('click');

      expect(wrapper.emitted('submit')).toBeTruthy();
      expect(wrapper.emitted('submit')[0]).toEqual(['search term']);
    });

    it('should support search icon when showIcon is true', () => {
      const wrapper = mount(BaseInput, {
        props: {
          variant: 'search',
          showIcon: true
        }
      });

      expect(wrapper.find('[data-testid="search-icon"]').exists()).toBe(true);
    });

    it('should support close button when buttonClose is true', () => {
      const wrapper = mount(BaseInput, {
        props: {
          variant: 'search',
          buttonClose: true
        }
      });

      expect(wrapper.find('[data-testid="close-button"]').exists()).toBe(true);
    });
  });

  describe('Validation Integration', () => {
    it('should display validation errors from useFormField', async () => {
      const mockUseFormField = (await vi.importMock('@/composables/useFormField.js')).useFormField;
      mockUseFormField.mockReturnValue({
        value: ref(''),
        focused: ref(false),
        error: ref('This field is required'),
        inputClass: ref({ row: true, error: true }),
        validate: vi.fn(),
        setFocus: vi.fn(),
        setBlur: vi.fn(),
        clearError: vi.fn()
      });

      const wrapper = mount(BaseInput, {
        props: {
          required: true
        }
      });

      expect(wrapper.find('[data-testid="validation-error"]').text()).toBe('This field is required');
      expect(wrapper.classes()).toContain('error');
    });

    it('should trigger validation on blur when validateOnBlur is true', async () => {
      const mockValidate = vi.fn();
      const mockUseFormField = (await vi.importMock('@/composables/useFormField.js')).useFormField;
      mockUseFormField.mockReturnValue({
        value: ref(''),
        focused: ref(false),
        error: ref(''),
        inputClass: ref({ row: true }),
        validate: mockValidate,
        setFocus: vi.fn(),
        setBlur: vi.fn(),
        clearError: vi.fn()
      });

      const wrapper = mount(BaseInput, {
        props: {
          validateOnBlur: true
        }
      });

      await wrapper.find('[data-testid="base-input"]').trigger('blur');

      expect(mockValidate).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const wrapper = mount(BaseInput, {
        props: {
          id: 'test-input',
          'aria-label': 'Test input field',
          required: true
        }
      });

      const input = wrapper.find('[data-testid="base-input"]');
      expect(input.attributes('id')).toBe('test-input');
      expect(input.attributes('aria-label')).toBe('Test input field');
      expect(input.attributes('aria-required')).toBe('true');
    });

    it('should associate with error message via aria-describedby', () => {
      const wrapper = mount(BaseInput, {
        props: {
          id: 'test-input',
          error: 'Validation error'
        }
      });

      const input = wrapper.find('[data-testid="base-input"]');
      const errorId = `${wrapper.vm.inputId}-error`;

      expect(input.attributes('aria-describedby')).toBe(errorId);
      expect(wrapper.find(`[id="${errorId}"]`).exists()).toBe(true);
    });

    it('should support aria-invalid when there are errors', () => {
      const wrapper = mount(BaseInput, {
        props: {
          error: 'Invalid input'
        }
      });

      const input = wrapper.find('[data-testid="base-input"]');
      expect(input.attributes('aria-invalid')).toBe('true');
    });
  });

  describe('Focus Management', () => {
    it('should expose focus method for external focus control', () => {
      const wrapper = mount(BaseInput);

      expect(typeof wrapper.vm.focus).toBe('function');
      expect(typeof wrapper.vm.blur).toBe('function');
    });

    it('should emit focus and blur events', async () => {
      const wrapper = mount(BaseInput);

      await wrapper.find('[data-testid="base-input"]').trigger('focus');
      expect(wrapper.emitted('focus')).toBeTruthy();

      await wrapper.find('[data-testid="base-input"]').trigger('blur');
      expect(wrapper.emitted('blur')).toBeTruthy();
    });
  });

  describe('Styling and Layout', () => {
    it('should apply direction classes correctly', () => {
      const rowWrapper = mount(BaseInput, {
        props: { direction: 'row' }
      });
      expect(rowWrapper.classes()).toContain('direction-row');

      const columnWrapper = mount(BaseInput, {
        props: { direction: 'column' }
      });
      expect(columnWrapper.classes()).toContain('direction-column');
    });

    it('should apply size classes when specified', () => {
      const wrapper = mount(BaseInput, {
        props: { size: 'sm' }
      });

      expect(wrapper.classes()).toContain('size-sm');
    });

    it('should apply focused classes during focus state', async () => {
      const wrapper = mount(BaseInput);

      await wrapper.find('[data-testid="base-input"]').trigger('focus');
      expect(wrapper.classes()).toContain('focused');

      await wrapper.find('[data-testid="base-input"]').trigger('blur');
      expect(wrapper.classes()).not.toContain('focused');
    });
  });

  describe('Integration with InputText replacement', () => {
    it('should work as a drop-in replacement for InputText component', () => {
      // Test that it supports all InputText props
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 'test',
          label: 'Test Label',
          direction: 'column',
          required: true,
          placeholder: 'Enter text...'
        }
      });

      expect(wrapper.find('[data-testid="label"]').text()).toBe('Test Label');
      expect(wrapper.find('[data-testid="base-input"]').attributes('placeholder')).toBe('Enter text...');
      expect(wrapper.classes()).toContain('direction-column');
    });
  });

  describe('Integration with SearchBar replacement', () => {
    it('should work as a drop-in replacement for SearchBar component', () => {
      const wrapper = mount(BaseInput, {
        props: {
          variant: 'search',
          placeholder: 'Search...',
          withButtons: true,
          showIcon: true,
          buttonClose: true
        },
        slots: {
          'search-buttons': `
            <button @click="$emit('prev')">Previous</button>
            <button @click="$emit('next')">Next</button>
          `
        }
      });

      expect(wrapper.find('[data-testid="search-icon"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="close-button"]').exists()).toBe(true);
      expect(wrapper.classes()).toContain('variant-search');
    });
  });
});