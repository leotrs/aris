// eslint.config.js
import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import babelParser from "@babel/eslint-parser";
import globals from "globals";

export default [
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  prettierConfig,

  // config for .js files
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jquery,
        ...globals.node,
      },
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        requireConfigFile: false,
        babelOptions: {
          plugins: ["@babel/plugin-syntax-import-assertions", "@babel/plugin-syntax-jsx"],
        },
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },

  },

  // config for .vue files
  {
    files: ["**/*.vue"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jquery,
        ...globals.node,
      },
      parser: pluginVue.parser, // NOTE: NOT babelParser!
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    plugins: {
      vue: pluginVue,
      prettier: prettierPlugin,
    },
    rules: {
      // let prettier handle indentation
      indent: "off",
      "vue/script-indent": "off",
      "vue/html-indent": "off",

      // everything prettier complains about is an error
      "prettier/prettier": "error",

      // this is just silly
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

      // general customization
      "vue/multi-word-component-names": "off"
    },
  }
];
