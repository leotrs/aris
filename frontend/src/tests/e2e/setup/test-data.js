// Test user credentials for e2e tests
// These should match real users in the test database
export const TEST_USERS = {
  VALID_USER: {
    email: "test@example.com",
    password: "password123",
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
