// Test user credentials for e2e tests
// These should match real users in the test database
// Password comes from environment variables - CI will fail if not configured
export const TEST_USERS = {
  VALID_USER: {
    email: "testuser@aris.pub",
    password: process.env.VITE_DEV_LOGIN_PASSWORD,
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

// Validate that required credentials are available
if (!TEST_USERS.VALID_USER.password) {
  throw new Error("TEST_USER_PASSWORD not configured - check environment variables");
}
