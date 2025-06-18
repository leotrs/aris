// eslint.config.shared.js - Shared ESLint configuration
import js from "@eslint/js";

// Base rules that apply to all JavaScript/TypeScript files
export const baseRules = {
  // Prettier integration
  "prettier/prettier": "error",
  
  // Console and debugging
  "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
  "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  
  // Code quality
  "no-unused-vars": ["error", { 
    "argsIgnorePattern": "^_",
    "varsIgnorePattern": "^_" 
  }],
  "no-undef": "error",
  "eqeqeq": ["error", "always"],
  "prefer-const": "error",
  
  // Let prettier handle formatting
  "indent": "off",
  "quotes": "off",
  "semi": "off",
  "comma-dangle": "off",
  "max-len": "off"
};

// Shared base configuration
export const baseConfig = {
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      console: "readonly",
      process: "readonly"
    }
  },
  rules: baseRules
};

// JavaScript-specific configuration
export const jsConfig = [
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.mjs"],
    ...baseConfig
  }
];

// Global ignores that all projects should use
export const globalIgnores = [
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/.venv/**",
  "**/__pycache__/**",
  "**/coverage/**",
  "**/.coverage/**",
  "**/logs/**",
  "**/*.log"
];