import AnnotationMenu from './AnnotationMenu.vue';
import { action } from '@storybook/addon-actions';
import { ref } from 'vue';

// Mock annotation store for the component
const createMockAnnotationStore = () => {
  const store = ref({
    addNote: (noteContent) => {
      action('addNote')(noteContent);
      console.log('Note added:', noteContent);
    },
    addComment: (commentContent) => {
      action('addComment')(commentContent);
      console.log('Comment added:', commentContent);
    },
  });
  return store;
};

export default {
  title: 'Annotations/AnnotationMenu',
  component: AnnotationMenu,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        const annotationStore = createMockAnnotationStore();
        return { annotationStore };
      },
      provide() {
        return {
          annotationStore: this.annotationStore,
        };
      },
      template: '<story />',
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: 'A floating annotation menu that appears on text selection with color-coded annotation options.',
      },
    },
  },
};

export const Default = {
  render: () => ({
    components: { AnnotationMenu },
    template: `
      <div style="position: relative; max-width: 600px;">
        <h3>Annotation Menu Demo</h3>
        <p style="margin-bottom: 20px;">
          <strong>Note:</strong> This is a simplified demo. In the actual application, 
          the annotation menu appears automatically when you select text in a document.
        </p>
        
        <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9; line-height: 1.6;">
          <h4>Sample Document Text</h4>
          <p>
            This is a sample paragraph that demonstrates how the annotation system works. 
            In the full application, when you select any portion of this text, an annotation 
            menu would appear near your selection, allowing you to create colored annotations.
          </p>
          <p>
            The annotation menu includes different colored options for categorizing your 
            annotations - purple for important notes, orange for questions, green for 
            confirmations, and additional colors when expanded.
          </p>
        </div>
        
        <div style="margin-top: 20px; padding: 16px; background: #e7f3ff; border-radius: 8px;">
          <strong>How it works:</strong><br>
          • Select text in a document<br>
          • Annotation menu appears near selection<br>
          • Choose a color to categorize your annotation<br>
          • Menu expands to show more color options<br>
          • Click to create the annotation
        </div>
        
        <AnnotationMenu />
      </div>
    `,
  }),
};

export const ColorPalette = {
  render: () => ({
    components: { AnnotationMenu },
    template: `
      <div style="max-width: 600px;">
        <h3>Color Palette Demo</h3>
        <p>The annotation menu provides different colors for categorizing annotations:</p>
        
        <div style="display: flex; flex-direction: column; gap: 12px; margin: 20px 0;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 20px; height: 20px; background: var(--purple-300, #b794f6); border-radius: 4px; border: 1px solid #ddd;"></div>
            <span><strong>Purple:</strong> Important notes and key insights</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 20px; height: 20px; background: var(--orange-300, #fbb875); border-radius: 4px; border: 1px solid #ddd;"></div>
            <span><strong>Orange:</strong> Questions and areas needing clarification</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 20px; height: 20px; background: var(--green-300, #9ae6b4); border-radius: 4px; border: 1px solid #ddd;"></div>
            <span><strong>Green:</strong> Confirmations and verified information</span>
          </div>
        </div>
        
        <div style="padding: 16px; background: #fff3cd; border: 1px solid #ffeeba; border-radius: 8px; margin-top: 20px;">
          <strong>Expanded Palette:</strong> When you hover over the menu, additional colors become available including red, pink, and yellow for more specific categorization.
        </div>
        
        <AnnotationMenu />
      </div>
    `,
  }),
};

export const FloatingBehavior = {
  render: () => ({
    components: { AnnotationMenu },
    template: `
      <div style="max-width: 600px;">
        <h3>Floating Menu Behavior</h3>
        <p>The annotation menu uses intelligent positioning:</p>
        
        <div style="display: flex; flex-direction: column; gap: 16px; margin: 20px 0;">
          <div style="padding: 12px; border-left: 3px solid #2196f3; background: #f8f9fa;">
            <strong>Positioning:</strong> Menu appears above selected text by default, with automatic flipping to below if there's insufficient space at the top.
          </div>
          
          <div style="padding: 12px; border-left: 3px solid #4caf50; background: #f8f9fa;">
            <strong>Viewport Awareness:</strong> Menu adjusts position to stay within the visible viewport, shifting left or right as needed.
          </div>
          
          <div style="padding: 12px; border-left: 3px solid #ff9800; background: #f8f9fa;">
            <strong>Auto-hide:</strong> Menu disappears when clicking outside, pressing Escape, or when the text selection is lost.
          </div>
          
          <div style="padding: 12px; border-left: 3px solid #9c27b0; background: #f8f9fa;">
            <strong>Range Tracking:</strong> Menu follows the selected text range and updates position dynamically.
          </div>
        </div>
        
        <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
          <p>
            <strong>Technical Details:</strong> The component uses Floating UI library for sophisticated 
            positioning logic, creating a virtual element based on the text selection's bounding rectangle.
          </p>
        </div>
        
        <AnnotationMenu />
      </div>
    `,
  }),
};

export const AnnotationWorkflow = {
  render: () => ({
    components: { AnnotationMenu },
    setup() {
      const annotations = ref([]);
      const selectedText = ref('');
      
      const simulateAnnotation = (color) => {
        const mockText = 'selected text';
        const newAnnotation = {
          id: Date.now(),
          text: mockText,
          color: color,
          timestamp: new Date().toLocaleTimeString(),
        };
        annotations.value.unshift(newAnnotation);
        action('annotationCreated')(newAnnotation);
      };
      
      return { annotations, selectedText, simulateAnnotation };
    },
    template: `
      <div style="max-width: 600px;">
        <h3>Annotation Workflow Demo</h3>
        
        <div style="margin-bottom: 20px;">
          <p>Simulate the annotation creation process:</p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button @click="simulateAnnotation('purple')" style="padding: 6px 12px; background: var(--purple-300, #b794f6); color: white; border: none; border-radius: 4px; cursor: pointer;">
              Purple Note
            </button>
            <button @click="simulateAnnotation('orange')" style="padding: 6px 12px; background: var(--orange-300, #fbb875); color: white; border: none; border-radius: 4px; cursor: pointer;">
              Orange Question
            </button>
            <button @click="simulateAnnotation('green')" style="padding: 6px 12px; background: var(--green-300, #9ae6b4); color: white; border: none; border-radius: 4px; cursor: pointer;">
              Green Confirmation
            </button>
          </div>
        </div>
        
        <div v-if="annotations.length > 0" style="margin-bottom: 20px;">
          <h4>Created Annotations ({{ annotations.length }}):</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 200px; overflow-y: auto;">
            <div
              v-for="annotation in annotations"
              :key="annotation.id"
              :style="{
                padding: '8px 12px',
                borderRadius: '4px',
                background: annotation.color === 'purple' ? 'var(--purple-100, #faf5ff)' :
                           annotation.color === 'orange' ? 'var(--orange-100, #fff7ed)' :
                           annotation.color === 'green' ? 'var(--green-100, #f0fff4)' : '#f9f9f9',
                borderLeft: '3px solid ' + (
                  annotation.color === 'purple' ? 'var(--purple-300, #b794f6)' :
                  annotation.color === 'orange' ? 'var(--orange-300, #fbb875)' :
                  annotation.color === 'green' ? 'var(--green-300, #9ae6b4)' : '#ddd'
                )
              }"
            >
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; text-transform: capitalize;">{{ annotation.color }} Annotation</span>
                <span style="font-size: 11px; color: #666;">{{ annotation.timestamp }}</span>
              </div>
              <div style="margin-top: 4px; font-size: 14px;">"{{ annotation.text }}"</div>
            </div>
          </div>
        </div>
        
        <div v-else style="padding: 20px; text-align: center; border: 2px dashed #ddd; border-radius: 8px; color: #666;">
          No annotations created yet. Click the colored buttons above to simulate annotation creation.
        </div>
        
        <AnnotationMenu />
      </div>
    `,
  }),
};