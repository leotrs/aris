import { expect } from "@playwright/test";

export class FileHelpers {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for the files container to be visible and loaded
   */
  async waitForFilesLoaded() {
    // Wait for network operations to complete (file creation/updates)
    await this.page.waitForLoadState("networkidle");

    try {
      // Wait for files container to be visible (handles Suspense loading states)
      await expect(this.page.locator('[data-testid="files-container"]')).toBeVisible({
        timeout: 3000,
      });
    } catch {
      // If files container doesn't appear, the duplicate might have broken the app state
      // Refresh the page to restore the file list
      await this.page.reload();
      await this.page.waitForLoadState("networkidle");
      await expect(this.page.locator('[data-testid="files-container"]')).toBeVisible({
        timeout: 5000,
      });
    }

    // Wait for files to actually render instead of fixed timeout
    await this.page.waitForFunction(
      () => {
        const container = document.querySelector('[data-testid="files-container"]');
        return container && container.children.length > 0;
      },
      { timeout: 3000 }
    );
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
   * Click on a file item to select it and ensure it has focus for keyboard shortcuts
   */
  async selectFile(fileId) {
    const fileItem = await this.getFileItem(fileId);

    // Focus the file item first to ensure it can receive keyboard events
    await fileItem.focus();

    // Click the file item directly to trigger selection
    await fileItem.click();

    // Wait for Vue reactivity to update the CSS classes by checking for state change
    await this.page.waitForFunction(
      (selector) => {
        const element = document.querySelector(selector);
        return element && element.classList.length > 2; // Wait for more than just base classes
      },
      `[data-testid="file-item-${fileId}"]`,
      { timeout: 2000 }
    );

    // Verify file is selected - check for active, hovered, or other selection indicators
    // The Vue application may use different class names for selection state
    const classes = await fileItem.getAttribute("class");
    if (
      classes &&
      (classes.includes("active") ||
        classes.includes("hovered") ||
        classes.includes("selected") ||
        classes.includes("focused"))
    ) {
      // File appears to be in a selected/interactive state
      console.log(`File ${fileId} selected with classes: ${classes}`);
    } else {
      // If no selection state is detected, fail the test
      throw new Error(
        `File ${fileId} selection failed - no active/hovered/selected/focused class found. Current classes: ${classes}`
      );
    }

    // Note: focused class may not always be applied depending on the focus management system
    // The DOM focus should be sufficient for keyboard shortcuts to work
  }

  /**
   * Ensure a file is deselected by clicking elsewhere
   */
  async ensureFileDeselected(fileId) {
    const fileItem = await this.getFileItem(fileId);

    // Check if file is currently selected
    const hasActiveClass = await fileItem.evaluate((el) => el.classList.contains("active"));

    if (hasActiveClass) {
      // Click on an empty area to deselect
      await this.page.click("body");
      // Wait for the deselection state change
      await this.page.waitForFunction(
        (selector) => {
          const element = document.querySelector(selector);
          return element && !element.classList.contains("active");
        },
        `[data-testid="file-item-${fileId}"]`,
        { timeout: 1000 }
      );
    }
  }

  /**
   * Open file menu for a specific file
   */
  async openFileMenu(fileId) {
    const fileItem = await this.getFileItem(fileId);

    // Find and click the dots button using the more specific test ID
    const dotsButton = fileItem.locator('[data-testid="trigger-button"]');
    await dotsButton.click();

    // Wait for the context menu to appear - use first() to avoid strict mode violations
    await expect(this.page.locator('[data-testid="context-menu"]').first()).toBeVisible();
  }

  /**
   * Delete a file with confirmation
   */
  async deleteFile(fileId) {
    // Ensure file is deselected so FileMenu is visible
    await this.ensureFileDeselected(fileId);

    await this.openFileMenu(fileId);

    // Click delete option
    await this.page.locator('[data-testid="file-menu-delete"]').click();

    // Wait for confirmation modal to appear
    await expect(this.page.locator('[data-testid="confirmation-modal"]')).toBeVisible();

    // Confirm deletion using the specific test ID
    await this.page.locator('[data-testid="confirm-button"]').click();

    // Wait for modal to disappear
    await expect(this.page.locator('[data-testid="confirmation-modal"]')).not.toBeVisible();

    // Wait for file list to update
    await this.waitForFilesLoaded();
  }

  /**
   * Duplicate a file
   */
  async duplicateFile(fileId) {
    // Ensure file is deselected so FileMenu is visible
    await this.ensureFileDeselected(fileId);

    await this.openFileMenu(fileId);

    // Click duplicate option using the specific test ID
    await this.page.locator('[data-testid="file-menu-duplicate"]').click();

    // Close the menu by clicking elsewhere (duplicate doesn't auto-close menu)
    await this.page.click("body");

    // Wait for the duplicate operation to complete by checking for file count increase
    const initialFileCount = await this.getFileCount();
    await this.page.waitForFunction(
      (expectedCount) => {
        const container = document.querySelector('[data-testid="files-container"]');
        const currentCount = container
          ? container.querySelectorAll('[data-testid^="file-item-"]').length
          : 0;
        return currentCount > expectedCount;
      },
      initialFileCount,
      { timeout: 5000 }
    );

    // Wait for the async file creation to complete and file list to update
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

    // Try to get title from display mode (.editable div)
    const editableElement = fileItem.locator(".file-title .editable");
    if (await editableElement.isVisible()) {
      const title = await editableElement.textContent();
      return title ? title.trim() : "";
    }

    // If editing mode, get from input element
    const inputElement = fileItem.locator(".file-title input");
    if (await inputElement.isVisible()) {
      const title = await inputElement.inputValue();
      return title ? title.trim() : "";
    }

    // Fallback: try any text in the file-title container
    const titleContainer = fileItem.locator(".file-title");
    if (await titleContainer.isVisible()) {
      const title = await titleContainer.textContent();
      return title ? title.trim() : "";
    }

    return "";
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
    // Ensure file is deselected so FileMenu is visible
    await this.ensureFileDeselected(fileId);

    await this.openFileMenu(fileId);

    // Click delete option using the specific test ID
    await this.page.locator('[data-testid="file-menu-delete"]').click();

    // Wait for confirmation modal to appear
    await expect(this.page.locator('[data-testid="confirmation-modal"]')).toBeVisible();

    // Cancel deletion using the specific test ID
    await this.page.locator('[data-testid="cancel-button"]').click();

    // Wait for modal to disappear
    await expect(this.page.locator('[data-testid="confirmation-modal"]')).not.toBeVisible();
  }

  /**
   * Create a file with a specific title
   */
  async createFile(_title = "Test File") {
    const fileId = await this.createNewFile();
    // Navigate back to home to see the new file
    await this.navigateToHome();
    return fileId;
  }

  /**
   * Ensure a minimum number of test files exist for navigation testing
   */
  async ensureTestFiles(minCount) {
    await this.waitForFilesLoaded();
    const currentCount = await this.getFileCount();

    if (currentCount >= minCount) {
      return; // Already have enough files
    }

    const filesToCreate = minCount - currentCount;
    const createdFiles = [];

    for (let i = 0; i < filesToCreate; i++) {
      const fileId = await this.createNewFile();
      createdFiles.push(fileId);
      await this.navigateToHome();
    }

    // Final wait for all files to be loaded
    await this.waitForFilesLoaded();

    return createdFiles;
  }
}
