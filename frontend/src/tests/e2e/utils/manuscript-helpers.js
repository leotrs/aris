/**
 * Manuscript and file management helpers for E2E tests
 */

/**
 * Create a new RSM manuscript file
 * @param {Page} page - Playwright page object
 * @param {Object} fileData - File creation data
 * @param {string} fileData.title - File title
 * @param {string} fileData.content - RSM content (optional)
 */
export async function createNewFile(page, { title, content = null }) {
  // Navigate to home if not already there
  await page.goto("/home");

  // Click create new file button
  await page.click('[data-testid="create-file-button"]');

  // Fill file title
  await page.fill('[data-testid="file-title-input"]', title);

  // If content provided, add it
  if (content) {
    await page.fill('[data-testid="file-content-input"]', content);
  }

  // Submit file creation
  await page.click('[data-testid="create-file-submit"]');

  // Wait for file to be created and redirect to workspace
  await page.waitForURL(/\/workspace/);

  return title;
}

/**
 * Upload a file from filesystem
 * @param {Page} page - Playwright page object
 * @param {string} filePath - Path to file to upload
 */
export async function uploadFile(page, filePath) {
  await page.goto("/home");

  // Click upload button
  await page.click('[data-testid="upload-file-button"]');

  // Upload file
  await page.setInputFiles('[data-testid="file-upload-input"]', filePath);

  // Wait for upload to complete
  await page.waitForSelector('[data-testid="upload-success"]', { timeout: 10000 });
}

/**
 * Open a file in the workspace
 * @param {Page} page - Playwright page object
 * @param {string} fileName - Name of file to open
 */
export async function openFile(page, fileName) {
  await page.goto("/home");

  // Find and click the file
  await page.click(`[data-testid="file-item-${fileName}"]`);

  // Wait for workspace to load
  await page.waitForURL(/\/workspace/);
  await page.waitForSelector('[data-testid="manuscript-content"]');
}

/**
 * Delete a file
 * @param {Page} page - Playwright page object
 * @param {string} fileName - Name of file to delete
 */
export async function deleteFile(page, fileName) {
  await page.goto("/home");

  // Right-click on file to open context menu
  await page.click(`[data-testid="file-item-${fileName}"]`, { button: "right" });

  // Click delete option
  await page.click('[data-testid="delete-file-option"]');

  // Confirm deletion in modal
  await page.click('[data-testid="confirm-delete-button"]');

  // Wait for file to be removed from list
  await page.waitForSelector(`[data-testid="file-item-${fileName}"]`, { state: "detached" });
}

/**
 * Add tags to a file
 * @param {Page} page - Playwright page object
 * @param {string} fileName - Name of file to tag
 * @param {string[]} tags - Array of tag names to add
 */
export async function addTagsToFile(page, fileName, tags) {
  await page.goto("/home");

  // Click on file to select it
  await page.click(`[data-testid="file-item-${fileName}"]`);

  // Open tag dropdown
  await page.click('[data-testid="file-tags-dropdown"]');

  // Add each tag
  for (const tag of tags) {
    await page.fill('[data-testid="tag-search-input"]', tag);
    await page.press('[data-testid="tag-search-input"]', "Enter");
  }

  // Close dropdown
  await page.press("Escape");
}

/**
 * Check if file exists in file list
 * @param {Page} page - Playwright page object
 * @param {string} fileName - Name of file to check
 * @returns {boolean} - True if file exists
 */
export async function fileExists(page, fileName) {
  await page.goto("/home");

  try {
    await page.waitForSelector(`[data-testid="file-item-${fileName}"]`, { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get RSM content from workspace editor
 * @param {Page} page - Playwright page object
 * @returns {string} - Current RSM content
 */
export async function getEditorContent(page) {
  await page.waitForSelector('[data-testid="rsm-editor"]');
  return await page.textContent('[data-testid="rsm-editor"]');
}

/**
 * Set RSM content in workspace editor
 * @param {Page} page - Playwright page object
 * @param {string} content - RSM content to set
 */
export async function setEditorContent(page, content) {
  await page.waitForSelector('[data-testid="rsm-editor"]');
  await page.fill('[data-testid="rsm-editor"]', content);
}
