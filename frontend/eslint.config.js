// eslint.config.js - Frontend-specific ESLint configuration
import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import babelParser from "@babel/eslint-parser";
import globals from "globals";

// Import shared configuration
import { baseRules, baseConfig, globalIgnores } from "../eslint.config.shared.js";

// Create JS config using local @eslint/js import
const jsConfig = [
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.mjs"],
    ...baseConfig,
  },
];

export default [
  // Use shared JS config as base
  ...jsConfig,

  // Vue-specific configuration
  ...pluginVue.configs["flat/recommended"],
  prettierConfig,

  // Frontend JavaScript files
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.browser,
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
    rules: {
      ...baseRules,
      // Frontend-specific overrides
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },

  // Vue files
  {
    files: ["**/*.vue"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: pluginVue.parser,
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
      ...baseRules,
      // Vue-specific rules
      "vue/script-indent": "off",
      "vue/html-indent": "off",
      "vue/multi-word-component-names": "off",
      "vue/no-reserved-component-names": "warn",
      "vue/no-unused-vars": ["error", { ignorePattern: "^props$|^emit$" }],
      "no-unused-vars": "off",
    },
  },

  // Test files - specific overrides for test files
  {
    files: ["**/*.test.js", "**/*.spec.js", "src/tests/**/*"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // Test globals
        beforeAll: "readonly",
        afterAll: "readonly",
        afterEach: "readonly",
        beforeEach: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        vi: "readonly",
        test: "readonly",
      },
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        requireConfigFile: false,
        babelOptions: {
          plugins: ["@babel/plugin-syntax-import-assertions"],
        },
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...baseRules,
      // Disable component naming and structure rules for test stubs
      "vue/multi-word-component-names": "off",
      "vue/no-reserved-component-names": "off",
      "vue/one-component-per-file": "off",
      // Disable prop validation rules for test stubs
      "vue/require-prop-types": "off",
      "vue/require-default-prop": "off",
      "prefer-const": [
        "error",
        {
          destructuring: "any",
          ignoreReadBeforeAssign: true,
        },
      ],
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },

  // Global ignores
  {
    ignores: [
      ...globalIgnores,
      // Frontend-specific ignores
      "dist/**",
      "public/**",
      "debug/**",
    ],
  },
];
