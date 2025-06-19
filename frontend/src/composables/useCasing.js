// Utility functions for case conversion
const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

const toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export function useCamelCase(obj) {
  const converted = {};
  for (const [key, value] of Object.entries(obj)) {
    converted[toCamelCase(key)] = value;
  }
  return converted;
}

export function useSnakeCase(obj) {
  const converted = {};
  for (const [key, value] of Object.entries(obj)) {
    converted[toSnakeCase(key)] = value;
  }
  return converted;
}
