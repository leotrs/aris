/**
 * Authentication helpers for E2E tests
 */

/**
 * Login a user with credentials
 * @param {Page} page - Playwright page object
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 */
export async function loginUser(page, { email, password }) {
  await page.goto("/login");

  // Fill login form
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);

  // Submit form
  await page.click('[data-testid="login-button"]');

  // Wait for successful login (redirect to root)
  await page.waitForURL("/");

  // Verify user is logged in (check for user menu or logout button)
  await page.waitForSelector('[data-testid="user-menu"]', { timeout: 5000 });
}

/**
 * Register a new user
 * @param {Page} page - Playwright page object
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.name - User full name
 */
export async function registerUser(page, { email, password, name }) {
  await page.goto("/register");

  // Fill registration form
  await page.fill('[data-testid="name-input"]', name);
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);

  // Submit form
  await page.click('[data-testid="register-button"]');

  // Wait for successful registration
  await page.waitForURL(/\/(home|workspace|login)/);
}

/**
 * Logout the current user
 * @param {Page} page - Playwright page object
 */
export async function logoutUser(page) {
  // Click user menu to open dropdown
  await page.click('[data-testid="user-menu"]');

  // Click logout option
  await page.click('[data-testid="logout-button"]');

  // Wait for redirect to login page
  await page.waitForURL("/login");
}

/**
 * Check if user is authenticated
 * @param {Page} page - Playwright page object
 * @returns {boolean} - True if user is authenticated
 */
export async function isUserAuthenticated(page) {
  try {
    await page.waitForSelector('[data-testid="user-menu"]', { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Setup authenticated user session for tests
 * @param {Page} page - Playwright page object
 * @param {Object} credentials - User credentials (optional, uses default test user)
 */
export async function setupAuthenticatedSession(page, credentials = null) {
  const defaultCredentials = {
    email: "testuser@aris.pub",
    password: "eIrdA38eW1guWTVpJNlS3VwP6eszUIGOiWqj1re3inM",
  };

  const creds = credentials || defaultCredentials;

  // Check if already authenticated
  const isAuthenticated = await isUserAuthenticated(page);

  if (!isAuthenticated) {
    await loginUser(page, creds);
  }
}
