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

// Validate that required credentials are available
if (!TEST_USERS.VALID_USER.password) {
  throw new Error("TEST_USER_PASSWORD not configured - check environment variables");
}
