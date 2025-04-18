// eslint.config.js
import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import prettierPlugin from "eslint-plugin-prettier";
import babelParser from "@babel/eslint-parser";

export default [
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],

  {
    files: ["**/*.js"],
    languageOptions: {
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
  {
    files: ["**/*.vue"], // Vue files with their own config
    languageOptions: {
      parser: pluginVue.parser, // Use Vue's parser instead of Babel
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    plugins: {
      vue: pluginVue,
    },
    rules: {
      indent: ["error", 2],
      "prettier/prettier": "error",
      "vue/html-indent": ["error", 2],
      "vue/script-indent": ["error", 2],
      "vue/multi-word-component-names": "off",
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    },
  }
];
