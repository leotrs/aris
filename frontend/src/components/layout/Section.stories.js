import Section from "./Section.vue";
import Button from "../base/Button.vue";

export default {
  title: "Layout/Section",
  component: Section,
  tags: ["autodocs"],
  argTypes: {
    // Slots
    title: {
      control: "text",
      description: "Content for the section's title area.",
    },
    content: {
      control: "text",
      description: "Main content of the section.",
    },
    footer: {
      control: "text",
      description: "Content for the section's footer area.",
    },
  },
};

export const Default = {
  render: () => ({
    components: { Section },
    template: `
      <Section>
        <template #title><h2>Default Section</h2></template>
        <template #content><p>This is the main content of the section.</p></template>
      </Section>
    `,
  }),
};

export const WithFooter = {
  render: () => ({
    components: { Section, Button },
    template: `
      <Section>
        <template #title><h2>Section with Footer</h2></template>
        <template #content><p>Some content here.</p></template>
        <template #footer><Button kind="primary" text="Save" /></template>
      </Section>
    `,
  }),
};

export const DangerSection = {
  render: () => ({
    components: { Section },
    template: `
      <Section class="danger">
        <template #title><h2>Danger Zone</h2></template>
        <template #content><p>This action is irreversible. Proceed with caution.</p></template>
      </Section>
    `,
  }),
};

export const ContentOnly = {
  render: () => ({
    components: { Section },
    template: `
      <Section>
        <template #content>
          <p>This section only has content, no title or footer.</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </template>
      </Section>
    `,
  }),
};
