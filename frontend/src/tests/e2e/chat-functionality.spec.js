import { test, expect } from "@playwright/test";

// @auth
import { AuthHelpers } from "./utils/auth-helpers.js";
import { FileHelpers } from "./utils/file-helpers.js";

test.describe("AI Copilot Chat Functionality @auth", () => {
  let authHelpers;
  let fileHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    fileHelpers = new FileHelpers(page);

    // Ensure logged in
    await authHelpers.ensureLoggedIn();
  });

  test("chat panel appears in workspace", async ({ page }) => {
    // Create a new file to work with
    const fileId = await fileHelpers.createNewFile();
    await expect(page).toHaveURL(`/file/${fileId}`);

    // Wait for workspace to load
    await page.waitForSelector("[data-testid='workspace-container']", { timeout: 10000 });

    // Look for chat panel or toggle
    const chatPanel = page.locator(".chat-panel");
    const chatToggle = page.locator(".chat-toggle");

    // Either the panel should be visible or there should be a toggle
    const chatExists = (await chatPanel.isVisible()) || (await chatToggle.isVisible());
    expect(chatExists).toBe(true);
  });

  test("can send message and receive response", async ({ page }) => {
    // Create a new file
    const fileId = await fileHelpers.createNewFile();
    await expect(page).toHaveURL(`/file/${fileId}`);

    // Wait for workspace to load
    await page.waitForSelector("[data-testid='workspace-container']", { timeout: 10000 });

    // Find and open chat if needed
    const chatPanel = page.locator(".chat-panel");

    if (!(await chatPanel.isVisible())) {
      const chatToggle = page.locator(".chat-toggle");
      if (await chatToggle.isVisible()) {
        await chatToggle.click();
        await page.waitForSelector(".chat-panel", { timeout: 5000 });
      }
    }

    // Verify chat components are present
    await expect(page.locator(".chat-header")).toBeVisible();
    await expect(page.locator(".chat-messages")).toBeVisible();
    await expect(page.locator(".message-input")).toBeVisible();
    await expect(page.locator(".send-button")).toBeVisible();

    // Send a test message
    const messageInput = page.locator(".message-input");
    const sendButton = page.locator(".send-button");

    await messageInput.fill("Help me improve this manuscript");
    await sendButton.click();

    // Verify user message appears
    await expect(page.locator(".chat-message.user")).toBeVisible();
    await expect(page.locator(".chat-message.user")).toContainText(
      "Help me improve this manuscript"
    );

    // Wait for AI response (either loading state or actual response)
    await page.waitForSelector(".chat-message.assistant", { timeout: 10000 });

    // Verify assistant message appears (might be loading or actual response)
    const assistantMessage = page.locator(".chat-message.assistant");
    await expect(assistantMessage).toBeVisible();

    // Input should be cleared after sending
    await expect(messageInput).toHaveValue("");

    // Input should be re-enabled after response
    await expect(messageInput).not.toBeDisabled();
    await expect(sendButton).not.toBeDisabled();
  });

  test("displays welcome message when no chat history", async ({ page }) => {
    // Create a new file
    const fileId = await fileHelpers.createNewFile();
    await expect(page).toHaveURL(`/file/${fileId}`);

    // Wait for workspace to load
    await page.waitForSelector("[data-testid='workspace-container']", { timeout: 10000 });

    // Find chat panel
    const chatPanel = page.locator(".chat-panel");

    if (!(await chatPanel.isVisible())) {
      const chatToggle = page.locator(".chat-toggle");
      if (await chatToggle.isVisible()) {
        await chatToggle.click();
        await page.waitForSelector(".chat-panel", { timeout: 5000 });
      }
    }

    // Verify welcome message is shown
    const welcomeMessage = page.locator(".welcome-message");
    await expect(welcomeMessage).toBeVisible();
    await expect(welcomeMessage).toContainText("Hello! I'm your AI writing assistant");
  });

  test("can clear chat conversation", async ({ page }) => {
    // Create a new file
    const fileId = await fileHelpers.createNewFile();
    await expect(page).toHaveURL(`/file/${fileId}`);

    // Wait for workspace to load
    await page.waitForSelector("[data-testid='workspace-container']", { timeout: 10000 });

    // Find and ensure chat panel is visible
    const chatPanel = page.locator(".chat-panel");

    if (!(await chatPanel.isVisible())) {
      const chatToggle = page.locator(".chat-toggle");
      if (await chatToggle.isVisible()) {
        await chatToggle.click();
        await page.waitForSelector(".chat-panel", { timeout: 5000 });
      }
    }

    // Send a message first
    const messageInput = page.locator(".message-input");
    const sendButton = page.locator(".send-button");

    await messageInput.fill("Test message");
    await sendButton.click();

    // Wait for messages to appear
    await page.waitForSelector(".chat-message", { timeout: 10000 });

    // Verify messages exist
    await expect(page.locator(".chat-message")).toHaveCount.greaterThan(0);

    // Find and click clear button
    const clearButton = page.locator(".clear-chat");
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    // Verify messages are cleared
    await expect(page.locator(".chat-message")).toHaveCount(0);

    // Verify welcome message reappears
    const welcomeMessage = page.locator(".welcome-message");
    await expect(welcomeMessage).toBeVisible();
  });

  test("handles empty messages gracefully", async ({ page }) => {
    // Create a new file
    const fileId = await fileHelpers.createNewFile();
    await expect(page).toHaveURL(`/file/${fileId}`);

    // Wait for workspace to load
    await page.waitForSelector("[data-testid='workspace-container']", { timeout: 10000 });

    // Find chat panel
    const chatPanel = page.locator(".chat-panel");

    if (!(await chatPanel.isVisible())) {
      const chatToggle = page.locator(".chat-toggle");
      if (await chatToggle.isVisible()) {
        await chatToggle.click();
        await page.waitForSelector(".chat-panel", { timeout: 5000 });
      }
    }

    // Try to send empty message
    const messageInput = page.locator(".message-input");
    const sendButton = page.locator(".send-button");

    // Send button should be disabled for empty input
    await expect(sendButton).toBeDisabled();

    // Try with whitespace
    await messageInput.fill("   ");
    await expect(sendButton).toBeDisabled();

    // Try with actual content
    await messageInput.fill("Real message");
    await expect(sendButton).not.toBeDisabled();
  });

  test("maintains chat state during workspace session", async ({ page }) => {
    // Create a new file
    const fileId = await fileHelpers.createNewFile();
    await expect(page).toHaveURL(`/file/${fileId}`);

    // Wait for workspace to load
    await page.waitForSelector("[data-testid='workspace-container']", { timeout: 10000 });

    // Find and ensure chat panel is visible
    const chatPanel = page.locator(".chat-panel");

    if (!(await chatPanel.isVisible())) {
      const chatToggle = page.locator(".chat-toggle");
      if (await chatToggle.isVisible()) {
        await chatToggle.click();
        await page.waitForSelector(".chat-panel", { timeout: 5000 });
      }
    }

    // Send a message
    const messageInput = page.locator(".message-input");
    const sendButton = page.locator(".send-button");

    await messageInput.fill("First message");
    await sendButton.click();

    // Wait for messages to appear
    await page.waitForSelector(".chat-message", { timeout: 10000 });

    // Verify message exists
    await expect(page.locator(".chat-message.user")).toContainText("First message");

    // Simulate some interaction in the workspace (e.g., clicking editor)
    const editor = page.locator(".editor, .manuscript, .workspace-content").first();
    if (await editor.isVisible()) {
      await editor.click();
    }

    // Verify chat message is still there
    await expect(page.locator(".chat-message.user")).toContainText("First message");
  });
});
