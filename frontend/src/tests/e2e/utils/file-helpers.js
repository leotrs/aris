import { expect } from "@playwright/test";

export class FileHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for the files container to be visible and loaded
   */
  async waitForFilesLoaded() {
    await expect(this.page.locator('[data-testid="files-container"]')).toBeVisible();
    // Wait a bit for files to load from API
    await this.page.waitForTimeout(1000);
  }

  /**
   * Create a new empty file via the UI
   */
  async createNewFile() {
    // The create file button is a ContextMenu with "New File" text
    await this.page.click('text="New File"');

    // Look for the "Empty file" option in the context menu
    await this.page.click('text="Empty file"');

    // Wait for navigation to workspace (file creation should redirect)
    await this.page.waitForURL(/\/file\//, { timeout: 10000 });

    // Extract file ID from URL
    const url = this.page.url();
    const fileId = url.split("/file/")[1];
    return fileId;
  }

  /**
   * Navigate back to home to see file list
   */
  async navigateToHome() {
    await this.page.goto("/");
    await this.waitForFilesLoaded();
  }

  /**
   * Get all file items currently visible in the list
   */
  async getFileItems() {
    await this.waitForFilesLoaded();
    return await this.page.locator('[data-testid^="file-item-"]').all();
  }

  /**
   * Get a specific file item by ID
   */
  async getFileItem(fileId) {
    return this.page.locator(`[data-testid="file-item-${fileId}"]`);
  }

  /**
   * Click on a file item to select it
   */
  async selectFile(fileId) {
    const fileItem = await this.getFileItem(fileId);
    await fileItem.click();

    // Verify file is selected (has active class)
    await expect(fileItem).toHaveClass(/active/);
  }

  /**
   * Open file menu for a specific file
   */
  async openFileMenu(fileId) {
    const fileItem = await this.getFileItem(fileId);

    // Find and click the dots button (context menu trigger) within the file item
    const dotsButton = fileItem.locator('[data-testid="file-menu"] .context-menu-trigger');
    await dotsButton.click();

    // Wait for menu to appear - target the specific file's menu to avoid strict mode violations
    const fileMenu = fileItem.locator('[data-testid="file-menu"]');
    await expect(fileMenu).toBeVisible();
  }

  /**
   * Delete a file with confirmation
   */
  async deleteFile(fileId) {
    await this.openFileMenu(fileId);

    // Click delete option - look for the danger-styled menu item
    await this.page.locator('.danger').filter({ hasText: 'Delete' }).click();

    // Wait for confirmation modal
    await expect(this.page.locator('text="Delete File?"')).toBeVisible();

    // Confirm deletion - use more specific selector
    await this.page.locator('button').filter({ hasText: 'Delete' }).first().click();

    // Wait for modal to disappear
    await expect(this.page.locator('text="Delete File?"')).not.toBeVisible();
    
    // Wait for file list to update
    await this.waitForFilesLoaded();
  }

  /**
   * Duplicate a file
   */
  async duplicateFile(fileId) {
    await this.openFileMenu(fileId);

    // Click duplicate option
    await this.page.locator('text="Duplicate"').click();

    // Wait for operation to complete (menu should close)
    const fileItem = await this.getFileItem(fileId);
    const fileMenu = fileItem.locator('[data-testid="file-menu"]');
    await expect(fileMenu).not.toBeVisible();
    
    // Wait for file list to update
    await this.waitForFilesLoaded();
  }

  /**
   * Check if a file exists in the list
   */
  async fileExists(fileId) {
    await this.waitForFilesLoaded();
    const fileItem = this.page.locator(`[data-testid="file-item-${fileId}"]`);
    return await fileItem.isVisible();
  }

  /**
   * Get file title from file item
   */
  async getFileTitle(fileId) {
    const fileItem = await this.getFileItem(fileId);
    const titleElement = fileItem.locator(".file-title .editable, .file-title input");
    return await titleElement.textContent();
  }

  /**
   * Count total number of files in the list
   */
  async getFileCount() {
    await this.waitForFilesLoaded();
    const fileItems = await this.getFileItems();
    return fileItems.length;
  }

  /**
   * Wait for file list to update after an operation
   */
  async waitForFileListUpdate(expectedCount = null) {
    await this.page.waitForTimeout(500); // Allow for API calls to complete
    await this.waitForFilesLoaded();

    if (expectedCount !== null) {
      await expect(async () => {
        const count = await this.getFileCount();
        expect(count).toBe(expectedCount);
      }).toPass({ timeout: 5000 });
    }
  }

  /**
   * Cancel a file deletion
   */
  async cancelFileDeletion(fileId) {
    await this.openFileMenu(fileId);

    // Click delete option - look for the danger-styled menu item
    await this.page.locator('.danger').filter({ hasText: 'Delete' }).click();

    // Wait for confirmation modal
    await expect(this.page.locator('text="Delete File?"')).toBeVisible();

    // Cancel deletion
    await this.page.locator('button').filter({ hasText: 'Cancel' }).click();

    // Wait for modal to disappear
    await expect(this.page.locator('text="Delete File?"')).not.toBeVisible();
  }
}
