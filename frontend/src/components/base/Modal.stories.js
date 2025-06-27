import Modal from "./Modal.vue";
import Pane from "../layout/Pane.vue";
import Button from "./Button.vue";
import InputText from "../forms/InputText.vue";

// Mock useClosable to prevent actual DOM manipulation during Storybook rendering
// This is crucial because useClosable attaches/detaches event listeners to `document`
// and tries to manage focus, which can interfere with Storybook's environment.
const mockUseClosable = () => ({
  activate: () => console.log("Mock useClosable: activate"),
  deactivate: () => console.log("Mock useClosable: deactivate"),
});

export default {
  title: "Base/Modal",
  component: Modal,
  tags: ["autodocs"],
  argTypes: {
    // No direct props, only slots and events
    onClose: { action: "close", description: "Emitted when the modal should be closed." },
  },
  // Add a global decorator to provide the mocked useClosable
  decorators: [
    (story) => ({
      components: { story },
      setup() {
        // Provide the mock function directly
        return { useClosable: mockUseClosable };
      },
      template: "<story />",
    }),
  ],
  parameters: {
    // Storybook's background addon can interfere with modal backdrop
    backgrounds: { disable: true },
  },
};

export const Default = {
  render: (args) => ({
    components: { Modal, Pane },
    setup() {
      return { args };
    },
    template: `
      <Modal @close="args.onClose">
        <template #header>
          <h2>Default Modal Title</h2>
        </template>
        <p>This is the default modal content.</p>
        <p>You can close it by clicking outside, pressing ESC, or clicking a close button if provided.</p>
      </Modal>
    `,
  }),
};

export const WithForm = {
  render: (args) => ({
    components: { Modal, Pane, Button, InputText },
    setup() {
      const username = "JohnDoe";
      const email = "john.doe@example.com";
      return { args, username, email };
    },
    template: `
      <Modal @close="args.onClose">
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <h2>Edit Profile</h2>
            <Button kind="tertiary" icon="X" @click="args.onClose" />
          </div>
        </template>
        <form @submit.prevent="() => { console.log('Form submitted'); args.onClose(); }">
          <InputText v-model="username" label="Username" />
          <InputText v-model="email" label="Email" type="email" />
          <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
            <Button kind="secondary" text="Cancel" @click="args.onClose" />
            <Button kind="primary" text="Save" type="submit" />
          </div>
        </form>
      </Modal>
    `,
  }),
};

export const CustomContent = {
  render: (args) => ({
    components: { Modal, Pane },
    setup() {
      return { args };
    },
    template: `
      <Modal @close="args.onClose">
        <div style="text-align: center; padding: 30px;">
          <h3>Are you sure?</h3>
          <p>This action cannot be undone.</p>
          <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
            <Button kind="secondary" text="No" @click="args.onClose" />
            <Button kind="primary" text="Yes, delete" @click="args.onClose" />
          </div>
        </div>
      </Modal>
    `,
  }),
};
