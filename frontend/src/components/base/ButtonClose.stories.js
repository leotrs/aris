import ButtonClose from "./ButtonClose.vue";

export default {
  title: "Base/ButtonClose",
  component: ButtonClose,
  tags: ["autodocs"],
  argTypes: {
    // No props to document for ButtonClose, as it only emits a 'close' event.
  },
  // Add actions to log the 'close' event
  args: {
    onClose: () => console.log("Close event emitted"),
  },
};

export const Default = {};

export const Clickable = {
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector("button");
    if (button) {
      button.click();
    }
  },
};
