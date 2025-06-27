// Test user credentials for e2e tests
// These should match real users in the test database
// Password comes from environment variables - CI will fail if not configured
export const TEST_USERS = {
  VALID_USER: {
    email: "testuser@aris.pub",
    // In CI environment, use TEST_USER_PASSWORD, otherwise use VITE_DEV_LOGIN_PASSWORD
    password: (process.env.CI || process.env.ENV === "CI") 
      ? process.env.TEST_USER_PASSWORD 
      : process.env.VITE_DEV_LOGIN_PASSWORD,
    name: "Test User",
  },

  INVALID_USER: {
    email: "invalid@example.com",
    password: "wrongpassword",
  },
};

export const TEST_CREDENTIALS = {
  valid: TEST_USERS.VALID_USER,
  invalid: TEST_USERS.INVALID_USER,
};

// File fixtures for testing
export const TEST_FILES = {
  SAMPLE_RSM: {
    title: "Sample Document",
    source: `:rsm:
# Sample Document

This is a sample RSM document for testing.

## Introduction

Welcome to *Aris*, the web-native scientific publishing platform.

::`,
  },

  MINIMAL_RSM: {
    title: "Minimal Test File",
    source: `:rsm:
# Test File

Simple content for testing.

::`,
  },
};

// Generate unique test data helpers
export const generateTestFile = (suffix = "") => ({
  title: `Test File ${Date.now()}${suffix}`,
  source: `:rsm:
# Test File ${Date.now()}${suffix}

This is a test file created at ${new Date().toISOString()}.

::`,
});

// Validate that required credentials are available - fail if missing
if (!TEST_USERS.VALID_USER.password) {
  const envVar = (process.env.CI || process.env.ENV === "CI") ? "TEST_USER_PASSWORD" : "VITE_DEV_LOGIN_PASSWORD";
  throw new Error(`Test user password not configured. Required environment variable ${envVar} is missing.`);
}
