import "../src/assets/main.css";

/** @type { import('@storybook/vue3').Preview } */
const preview = {
  parameters: {
    actions: {
      argTypesRegex: "^on[A-Z].*",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Accessibility addon configuration
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
          {
            id: "focus-visible",
            enabled: true,
          },
        ],
      },
    },
    // Viewport addon configuration
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: {
            width: "375px",
            height: "667px",
          },
        },
        tablet: {
          name: "Tablet",
          styles: {
            width: "768px",
            height: "1024px",
          },
        },
        desktop: {
          name: "Desktop",
          styles: {
            width: "1024px",
            height: "768px",
          },
        },
        wide: {
          name: "Wide Desktop",
          styles: {
            width: "1440px",
            height: "900px",
          },
        },
      },
      defaultViewport: "desktop",
    },
  },
};

export default preview;
