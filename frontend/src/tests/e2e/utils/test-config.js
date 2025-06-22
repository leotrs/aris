/**
 * Test configuration utilities for E2E tests
 * Reads test user credentials from environment variables and processes JSON templates
 */

import testUsersTemplate from "../fixtures/test-users.json" with { type: "json" };

/**
 * Replace template variables in a string with environment values
 * @param {string} str - String that may contain ${VAR_NAME} placeholders
 * @returns {string} String with variables replaced
 */
function replaceEnvVars(str) {
  if (typeof str !== 'string') return str;
  
  return str.replace(/\$\{([^}]+)\}/g, (match, envVar) => {
    // Try Vite env first, then Node.js process.env, then fallback
    const env = (typeof import !== 'undefined' && import.meta?.env) || process.env || {};
    return env[envVar] || match;
  });
}

/**
 * Process an object recursively to replace environment variable placeholders
 * @param {any} obj - Object to process
 * @returns {any} Processed object with env vars replaced
 */
function processEnvVars(obj) {
  if (typeof obj === 'string') {
    return replaceEnvVars(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(item => processEnvVars(item));
  } else if (obj && typeof obj === 'object') {
    const processed = {};
    for (const [key, value] of Object.entries(obj)) {
      processed[key] = processEnvVars(value);
    }
    return processed;
  }
  return obj;
}

/**
 * Get test user credentials from environment variables
 * @returns {Object} Test user credentials
 */
export function getTestUsers() {
  return processEnvVars(testUsersTemplate);
}