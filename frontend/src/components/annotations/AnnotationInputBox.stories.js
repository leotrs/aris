import AnnotationInputBox from './AnnotationInputBox.vue';
import { action } from '@storybook/addon-actions';
import { ref } from 'vue';

export default {
  title: 'Annotations/AnnotationInputBox',
  component: AnnotationInputBox,
  tags: ['autodocs'],
  argTypes: {
    expanded: {
      control: 'boolean',
      description: 'Whether the input is in expanded state (shows edit button)',
    },
    modelValue: {
      control: 'text',
      description: 'The annotation text content (v-model)',
    },
    onSubmit: { action: 'submit' },
  },
  args: {
    expanded: true,
    modelValue: '',
  },
};

export const Default = {};

export const Expanded = {
  args: {
    expanded: true,
  },
};

export const Compact = {
  args: {
    expanded: false,
  },
};

export const WithText = {
  args: {
    expanded: true,
    modelValue: 'This is a sample annotation text that demonstrates how the input looks with content.',
  },
};

export const StateComparison = {
  render: () => ({
    components: { AnnotationInputBox },
    setup() {
      const expandedText = ref('Expanded annotation with edit button');
      const compactText = ref('Compact annotation input');
      
      return { expandedText, compactText };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <div>
          <h4>Expanded State</h4>
          <p>Shows both edit and send buttons:</p>
          <AnnotationInputBox
            v-model="expandedText"
            :expanded="true"
            @submit="(text) => action('submit')(text)"
          />
        </div>
        
        <div>
          <h4>Compact State</h4>
          <p>Shows only the send button:</p>
          <AnnotationInputBox
            v-model="compactText"
            :expanded="false"
            @submit="(text) => action('submit')(text)"
          />
        </div>
      </div>
    `,
  }),
};

export const InteractiveDemo = {
  render: () => ({
    components: { AnnotationInputBox },
    setup() {
      const annotationText = ref('');
      const isExpanded = ref(true);
      const submittedAnnotations = ref([]);
      
      const handleSubmit = (text) => {
        if (text.trim()) {
          submittedAnnotations.value.unshift({
            id: Date.now(),
            text: text,
            timestamp: new Date().toLocaleTimeString(),
          });
          annotationText.value = '';
          action('submit')(text);
        }
      };
      
      const clearAnnotations = () => {
        submittedAnnotations.value = [];
      };
      
      return {
        annotationText,
        isExpanded,
        submittedAnnotations,
        handleSubmit,
        clearAnnotations,
      };
    },
    template: `
      <div style="max-width: 500px;">
        <h3>Interactive Annotation Demo</h3>
        
        <div style="margin-bottom: 16px;">
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" v-model="isExpanded" />
            <span>Expanded mode</span>
          </label>
        </div>
        
        <div style="margin-bottom: 20px; padding: 16px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
          <h4 style="margin-top: 0;">Add Annotation:</h4>
          <AnnotationInputBox
            v-model="annotationText"
            :expanded="isExpanded"
            @submit="handleSubmit"
          />
          <p style="margin-bottom: 0; margin-top: 8px; font-size: 12px; color: #666;">
            Press Enter or click the send button to submit
          </p>
        </div>
        
        <div v-if="submittedAnnotations.length > 0">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h4 style="margin: 0;">Submitted Annotations ({{ submittedAnnotations.length }}):</h4>
            <button @click="clearAnnotations" style="padding: 4px 8px; font-size: 12px; border: 1px solid #ccc; border-radius: 4px; background: white;">
              Clear All
            </button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 200px; overflow-y: auto;">
            <div
              v-for="annotation in submittedAnnotations"
              :key="annotation.id"
              style="padding: 8px 12px; background: #e7f3ff; border-left: 3px solid #2196f3; border-radius: 4px;"
            >
              <div style="font-size: 14px; margin-bottom: 4px;">{{ annotation.text }}</div>
              <div style="font-size: 11px; color: #666;">{{ annotation.timestamp }}</div>
            </div>
          </div>
        </div>
        
        <div v-else style="padding: 20px; text-align: center; color: #666; font-style: italic; border: 2px dashed #ddd; border-radius: 8px;">
          No annotations yet. Type something above and submit it!
        </div>
      </div>
    `,
  }),
};

export const KeyboardInteraction = {
  render: () => ({
    components: { AnnotationInputBox },
    setup() {
      const annotationText = ref('');
      const lastAction = ref('');
      
      const handleSubmit = (text) => {
        lastAction.value = `Submitted: "${text}" at ${new Date().toLocaleTimeString()}`;
        action('submit')(text);
        annotationText.value = '';
      };
      
      return {
        annotationText,
        lastAction,
        handleSubmit,
      };
    },
    template: `
      <div style="max-width: 400px;">
        <h3>Keyboard Interaction</h3>
        <p>Test keyboard submission with Enter key:</p>
        
        <AnnotationInputBox
          v-model="annotationText"
          @submit="handleSubmit"
        />
        
        <div style="margin-top: 16px; padding: 12px; background: #f8f9fa; border-radius: 8px;">
          <strong>Instructions:</strong><br>
          • Type your annotation text<br>
          • Press <kbd style="background: #e0e0e0; padding: 2px 4px; border-radius: 2px;">Enter</kbd> to submit<br>
          • Or click the send button
        </div>
        
        <div v-if="lastAction" style="margin-top: 16px; padding: 12px; background: #e7f3ff; border-radius: 8px;">
          <strong>Last Action:</strong><br>
          {{ lastAction }}
        </div>
      </div>
    `,
  }),
};

export const DifferentContent = {
  render: () => ({
    components: { AnnotationInputBox },
    setup() {
      const shortText = ref('Short note');
      const longText = ref('This is a much longer annotation that demonstrates how the input box handles text that extends beyond the normal width and might wrap to multiple lines in some contexts.');
      const emptyText = ref('');
      
      return { shortText, longText, emptyText };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px; max-width: 400px;">
        <div>
          <h4>Short Text</h4>
          <AnnotationInputBox
            v-model="shortText"
            @submit="(text) => action('submit')(text)"
          />
        </div>
        
        <div>
          <h4>Long Text</h4>
          <AnnotationInputBox
            v-model="longText"
            @submit="(text) => action('submit')(text)"
          />
        </div>
        
        <div>
          <h4>Empty (Placeholder Visible)</h4>
          <AnnotationInputBox
            v-model="emptyText"
            @submit="(text) => action('submit')(text)"
          />
        </div>
      </div>
    `,
  }),
};