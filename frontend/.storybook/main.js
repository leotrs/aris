import { fileURLToPath } from "url";
import path from "path";

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/addon-viewport",
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config, { configType: _configType }) {
    // customize the Vite config here
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(fileURLToPath(import.meta.url), "../src"),
    };

    // return the customized config
    return config;
  },
};
export default config;
