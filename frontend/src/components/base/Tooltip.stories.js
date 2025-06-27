import Tooltip from "./Tooltip.vue";

export default {
  title: "Base/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    anchor: {
      control: false,
      description: "DOM element or Vue ref to anchor the tooltip to.",
    },
    content: {
      control: "text",
      description: "Text content to display in the tooltip.",
    },
    placement: {
      control: "select",
      options: [
        "top",
        "top-start",
        "top-end",
        "right",
        "right-start",
        "right-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "left-start",
        "left-end",
      ],
      description: "Floating UI placement string for tooltip positioning.",
    },
  },
  args: {
    content: "This is a tooltip",
    placement: "bottom",
  },
};

const Template = (args) => ({
  components: { Tooltip },
  setup() {
    const buttonRef = ref(null);
    onMounted(() => {
      buttonRef.value = document.getElementById("my-button");
    });
    return { args, buttonRef };
  },
  template: `
    <button id="my-button" style="margin: 100px;">Hover over me</button>
    <Tooltip v-bind="args" :anchor="buttonRef" />
  `,
});

import { ref, onMounted } from "vue";

export const Default = Template.bind({});
Default.args = {
  content: "Default tooltip content",
};

export const TopPlacement = Template.bind({});
TopPlacement.args = {
  content: "Tooltip at the top",
  placement: "top",
};

export const LeftPlacement = Template.bind({});
LeftPlacement.args = {
  content: "Tooltip on the left",
  placement: "left",
};

export const CustomContent = {
  render: (args) => ({
    components: { Tooltip },
    setup() {
      const buttonRef = ref(null);
      onMounted(() => {
        buttonRef.value = document.getElementById("custom-content-button");
      });
      return { args, buttonRef };
    },
    template: `
      <button id="custom-content-button" style="margin: 100px;">Hover for custom content</button>
      <Tooltip v-bind="args" :anchor="buttonRef">
        <div style="padding: 10px; background: #333; color: white; border-radius: 5px;">
          <strong>Custom HTML!</strong><br/>
          <span>This is a more complex tooltip.</span>
        </div>
      </Tooltip>
    `,
  }),
  args: {
    placement: "right",
  },
};
