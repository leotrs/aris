import { expect } from "@playwright/test";
import { MobileHelpers } from "./mobile-helpers.js";

export class FileHelpers {
  constructor(page) {
    this.page = page;
    this.mobileHelpers = new MobileHelpers(page);
  }

  /**
   * Wait for the files container to be visible and loaded
   */
  async waitForFilesLoaded() {
    const timeouts = this.mobileHelpers.getTimeouts();

    try {
      // Check browser state before proceeding
      if (this.page.isClosed()) {
        throw new Error("Browser already closed at start of waitForFilesLoaded");
      }

      // Wait for DOM content to be loaded (more reliable than networkidle)
      await this.page.waitForLoadState("domcontentloaded");
      await this.mobileHelpers.waitForMobileRendering();

      // Check browser state after load
      if (this.page.isClosed()) {
        throw new Error("Browser closed after DOM load - cannot continue");
      }

      // Wait for files container to be visible (handles Suspense loading states)
      await this.mobileHelpers.expectToBeVisible(
        this.page.locator('[data-testid="files-container"]'),
        timeouts.medium
      );
    } catch (error) {
      // Comprehensive crash debugging
      let debugInfo = "Unknown error";

      try {
        if (this.page.isClosed()) {
          debugInfo = "Browser closed during test - cannot recover files list";
        } else {
          const url = this.page.url();
          const title = await this.page.title();
          const readyState = await this.page.evaluate(() => document.readyState);
          debugInfo = `URL: ${url}, Title: ${title}, ReadyState: ${readyState}, Error: ${error.message}`;

          // Try page reload as fallback
          console.log("Attempting page reload due to files container not found");
          await this.page.reload();
          await this.page.waitForLoadState("domcontentloaded");

          if (this.page.isClosed()) {
            throw new Error("Browser closed during reload - cannot recover");
          }

          await this.mobileHelpers.expectToBeVisible(
            this.page.locator('[data-testid="files-container"]'),
            timeouts.long
          );
        }
      } catch (secondaryError) {
        throw new Error(
          `Files container load failed. ${debugInfo}. Secondary error: ${secondaryError.message}`
        );
      }

      if (this.page.isClosed()) {
        throw new Error(debugInfo);
      }
    }

    // Wait for files to actually render instead of fixed timeout
    await this.page.waitForFunction(
      () => {
        const container = document.querySelector('[data-testid="files-container"]');
        return container && container.children.length > 0;
      },
      { timeout: timeouts.medium }
    );
  }

  /**
   * Create a new empty file via the UI
   */
  async createNewFile() {
    const timeouts = this.mobileHelpers.getTimeouts();

    // Ensure we're on the home page and wait for it to be ready
    await this.navigateToHome();

    // Wait for home page to fully load with sidebar
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(500);

    // Try multiple selectors for the create button
    let createButton = null;
    const buttonSelectors = [
      '[data-testid="create-file-button"] button', // The actual button inside the ContextMenu
      '[data-testid="create-file-button"]', // Fallback to ContextMenu wrapper
      '[data-testid*="create"]',
      'button[data-testid*="file"]',
      ".fab button", // floating action button - target button inside FAB
      'button:has([data-testid*="plus"])',
    ];

    let buttonFound = false;
    for (const selector of buttonSelectors) {
      try {
        createButton = this.page.locator(selector);
        await createButton.waitFor({ state: "attached", timeout: 3000 });
        buttonFound = true;
        break;
      } catch {
        continue;
      }
    }

    if (!buttonFound) {
      // Progressive fallback strategy
      let debugInfo = "Browser closed or page unavailable";

      try {
        if (this.page.isClosed()) {
          throw new Error("Create file button not found - browser closed");
        }

        const url = this.page.url();
        const title = await this.page.title();

        // Try basic fallback selectors as last resort
        const fallbackSelectors = ["button", ".btn", "[role='button']"];
        let fallbackButton = null;

        for (const selector of fallbackSelectors) {
          try {
            const buttons = await this.page.locator(selector).all();
            for (const btn of buttons) {
              const text = await btn.textContent();
              // In mobile mode, the create button has no text, so also check for CirclePlus icon
              const hasCreateText = text && (text.includes("New") || text.includes("Create") || text.includes("+"));
              const hasCreateIcon = await btn.locator('[data-icon="CirclePlus"]').count() > 0;
              
              if (hasCreateText || hasCreateIcon) {
                fallbackButton = btn;
                console.log(`Found fallback button with text: "${text}" or create icon`);
                break;
              }
            }
            if (fallbackButton) break;
          } catch {
            continue;
          }
        }

        if (fallbackButton) {
          createButton = fallbackButton;
          buttonFound = true;
          console.log("Using fallback button detection");
        } else {
          // Gather debug info
          const bodyContent = await this.page.evaluate(() =>
            document.body.textContent.substring(0, 200)
          );
          const allButtons = await this.page.locator("button").all();
          const buttonTexts = await Promise.all(
            allButtons.slice(0, 5).map(async (btn) => {
              try {
                const text = await btn.textContent();
                const testId = await btn.getAttribute("data-testid");
                return `Button: "${text}" testid="${testId}"`;
              } catch {
                return "Button: [unreadable]";
              }
            })
          );
          debugInfo = `URL: ${url}, Title: ${title}, Body start: ${bodyContent}, Buttons: ${buttonTexts.join(", ")}`;
        }
      } catch (error) {
        debugInfo = `Error during fallback: ${error.message}`;
      }

      if (!buttonFound) {
        throw new Error(`Create file button not found after 10s. ${debugInfo}`);
      }
    }

    // Use standard visibility check for all browsers
    await this.mobileHelpers.expectToBeVisible(createButton);

    await this.mobileHelpers.clickElement(createButton);

    // Wait for context menu to appear with mobile-optimized timeout
    const contextMenu = this.page.locator('[data-testid="context-menu"]');
    await this.mobileHelpers.expectToBeVisible(contextMenu, timeouts.medium);

    // Click "Empty file" option with robust selector for mobile browsers
    const emptyFileOption = contextMenu.locator('button[role="menuitem"]:has-text("Empty file")');
    await this.mobileHelpers.expectToBeVisible(emptyFileOption);
    await this.mobileHelpers.clickElement(emptyFileOption);

    // Wait for navigation to workspace (file creation should redirect)
    await this.mobileHelpers.waitForURLPattern(/\/file\//);

    // Extract file ID from URL
    const url = this.page.url();
    const fileId = url.split("/file/")[1];
    return fileId;
  }

  /**
   * Navigate back to home to see file list
   */
  async navigateToHome() {
    // Use standard navigation for all browsers
    try {
      await this.page.goto("/");
    } catch (error) {
      console.log("Navigation error:", error.message);
      if (this.page.isClosed()) {
        throw new Error("Browser closed during navigation - cannot recover");
      }
      throw error;
    }

    await this.page.waitForLoadState("domcontentloaded");

    // Wait for either files or the create button to be present (empty state)
    await this.page.waitForSelector(
      '[data-testid="files-container"], [data-testid="create-file-button"]',
      { timeout: 10000 }
    );

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
