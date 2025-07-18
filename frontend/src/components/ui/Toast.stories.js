import { ref } from "vue";
import Toast from "./Toast.vue";

export default {
  title: "UI/Toast",
  component: Toast,
  tags: ["autodocs"],
  argTypes: {
    message: { control: "text" },
    description: { control: "text" },
    type: {
      control: "select",
      options: ["success", "error", "warning", "info"],
    },
    duration: { control: "number" },
    dismissible: { control: "boolean" },
  },
  decorators: [
    () => ({
      template: `
        <div style="position: relative; height: 200px; padding: 20px;">
          <div style="position: absolute; top: 20px; right: 20px; z-index: 9999;">
            <story />
          </div>
        </div>
      `,
    }),
  ],
};

export const Success = {
  args: {
    message: "Operation completed successfully",
    type: "success",
    duration: 0, // Don't auto-dismiss in Storybook
  },
};

export const Error = {
  args: {
    message: "An error occurred",
    description: "Please check your input and try again.",
    type: "error",
    duration: 0, // Don't auto-dismiss in Storybook
  },
};

export const Warning = {
  args: {
    message: "Warning message",
    description: "This action cannot be undone.",
    type: "warning",
    duration: 0, // Don't auto-dismiss in Storybook
  },
};

export const Info = {
  args: {
    message: "Information message",
    description: "Here's some helpful information.",
    type: "info",
    duration: 0, // Don't auto-dismiss in Storybook
  },
};

export const WithDescription = {
  args: {
    message: "Profile updated",
    description: "Your profile changes have been saved successfully.",
    type: "success",
    duration: 0, // Don't auto-dismiss in Storybook
  },
};

export const LongMessage = {
  args: {
    message:
      "This is a very long toast message to demonstrate how the component handles longer content",
    description:
      "This is also a longer description to show how the toast component wraps text and maintains proper spacing with multiple lines of content.",
    type: "info",
    duration: 0, // Don't auto-dismiss in Storybook
  },
};

// Interactive story that demonstrates the toast service
export const InteractiveDemo = {
  render: () => ({
    components: {
      Toast,
    },
    setup() {
      const activeToast = ref(null);

      const showToast = (config) => {
        activeToast.value = { ...config, id: Date.now() };
      };

      const hideToast = () => {
        activeToast.value = null;
      };

      return { activeToast, showToast, hideToast };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; padding: 20px;">
        <h3>Toast Service Demo</h3>
        <p>Click buttons to trigger different types of toasts:</p>
        
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button 
            @click="showToast({ type: 'success', message: 'Success! Everything worked perfectly.' })"
            style="padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;"
          >
            Show Success
          </button>
          
          <button 
            @click="showToast({ type: 'error', message: 'Error occurred', description: 'Something went wrong. Please try again.' })"
            style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer;"
          >
            Show Error
          </button>
          
          <button 
            @click="showToast({ type: 'warning', message: 'Warning message', description: 'Please review your changes before proceeding.' })"
            style="padding: 8px 16px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer;"
          >
            Show Warning
          </button>
          
          <button 
            @click="showToast({ type: 'info', message: 'Information', description: 'Here is some useful information for you.' })"
            style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;"
          >
            Show Info
          </button>
        </div>
        
        <div style="position: relative; height: 80px; margin-top: 20px;">
          <div v-if="activeToast" style="position: absolute; top: 0; right: 0; z-index: 9999;">
            <Toast
              :message="activeToast.message"
              :description="activeToast.description"
              :type="activeToast.type"
              :duration="0"
              :dismissible="true"
              @dismiss="hideToast"
            />
          </div>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          Click the buttons above to see live toast notifications. 
          In the actual app, toasts are managed by a global toast service.
        </p>
      </div>
    `,
  }),
};
