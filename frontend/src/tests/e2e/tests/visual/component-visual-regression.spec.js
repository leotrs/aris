import { test, expect } from "@playwright/test";
import { setupAuthenticatedSession } from "../../utils/auth-helpers.js";
import { getTestUsers } from "../../utils/test-config.js";

test.describe("Component Visual Regression @visual", () => {
  let testUsers;

  test.beforeAll(() => {
    testUsers = getTestUsers();
  });

  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page, testUsers.testUsers.defaultUser);
  });

  test("Button component visual states", async ({ page }) => {
    // Create a test page with all button variants
    await page.goto("/home");

    // Create a container for testing buttons
    await page.addInitScript(() => {
      const container = document.createElement("div");
      container.id = "visual-test-container";
      container.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: white;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 16px;
      `;
      document.body.appendChild(container);
    });

    // Add button test cases via script injection
    await page.evaluate(() => {
      const container = document.getElementById("visual-test-container");

      const buttonConfigs = [
        { text: "Primary Button", class: "btn-primary", id: "btn-primary" },
        { text: "Secondary Button", class: "btn-secondary", id: "btn-secondary" },
        { text: "Danger Button", class: "btn-danger", id: "btn-danger" },
        { text: "Disabled Button", class: "btn-primary", id: "btn-disabled", disabled: true },
        { text: "Loading Button", class: "btn-primary loading", id: "btn-loading" },
      ];

      buttonConfigs.forEach((config) => {
        const button = document.createElement("button");
        button.textContent = config.text;
        button.className = config.class;
        button.id = config.id;
        if (config.disabled) button.disabled = true;
        container.appendChild(button);
      });
    });

    // Take screenshot of button states
    await expect(page.locator("#visual-test-container")).toHaveScreenshot("button-variants.png");

    // Test hover states
    await page.hover("#btn-primary");
    await expect(page.locator("#btn-primary")).toHaveScreenshot("button-primary-hover.png");

    await page.hover("#btn-secondary");
    await expect(page.locator("#btn-secondary")).toHaveScreenshot("button-secondary-hover.png");

    // Test focus states
    await page.focus("#btn-primary");
    await expect(page.locator("#btn-primary")).toHaveScreenshot("button-primary-focus.png");
  });

  test("Tag component visual states", async ({ page }) => {
    await page.goto("/home");

    // Create tag test container
    await page.evaluate(() => {
      const container = document.createElement("div");
      container.id = "tag-test-container";
      container.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: white;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        z-index: 9999;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        max-width: 400px;
      `;
      document.body.appendChild(container);

      const tagConfigs = [
        { text: "Red Tag", color: "red", active: true },
        { text: "Blue Tag", color: "blue", active: false },
        { text: "Green Tag", color: "green", active: true },
        { text: "Orange Tag", color: "orange", active: false },
        { text: "Purple Tag", color: "purple", active: true },
        { text: "Editable Tag", color: "blue", active: false, editable: true },
      ];

      tagConfigs.forEach((config, index) => {
        const tag = document.createElement("button");
        tag.textContent = config.text;
        tag.className = `tag ${config.active ? "on" : "off"} ${config.color}`;
        tag.id = `tag-${index}`;
        if (config.editable) tag.classList.add("editable");
        container.appendChild(tag);
      });
    });

    // Screenshot all tag variants
    await expect(page.locator("#tag-test-container")).toHaveScreenshot("tag-variants.png");

    // Test tag hover states
    await page.hover("#tag-0");
    await expect(page.locator("#tag-0")).toHaveScreenshot("tag-active-hover.png");

    await page.hover("#tag-1");
    await expect(page.locator("#tag-1")).toHaveScreenshot("tag-inactive-hover.png");
  });

  test("Input component visual states", async ({ page }) => {
    await page.goto("/home");

    await page.evaluate(() => {
      const container = document.createElement("div");
      container.id = "input-test-container";
      container.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: white;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 300px;
      `;
      document.body.appendChild(container);

      const inputConfigs = [
        { placeholder: "Normal input", id: "input-normal" },
        { placeholder: "Focused input", id: "input-focused", focus: true },
        { placeholder: "Disabled input", id: "input-disabled", disabled: true },
        { placeholder: "Error input", id: "input-error", class: "error" },
        { value: "Filled input", id: "input-filled" },
      ];

      inputConfigs.forEach((config) => {
        const input = document.createElement("input");
        input.placeholder = config.placeholder || "";
        input.value = config.value || "";
        input.id = config.id;
        input.type = "text";
        if (config.class) input.className = config.class;
        if (config.disabled) input.disabled = true;

        container.appendChild(input);

        if (config.focus) {
          setTimeout(() => input.focus(), 100);
        }
      });
    });

    await page.waitForTimeout(200); // Wait for focus

    // Screenshot input states
    await expect(page.locator("#input-test-container")).toHaveScreenshot("input-variants.png");

    // Test individual input focus
    await page.focus("#input-normal");
    await expect(page.locator("#input-normal")).toHaveScreenshot("input-normal-focus.png");
  });

  test("Modal component visual appearance", async ({ page }) => {
    await page.goto("/home");

    // Create modal test by injecting modal HTML
    await page.evaluate(() => {
      const modal = document.createElement("div");
      modal.className = "modal";
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
      `;

      const content = document.createElement("div");
      content.className = "content";
      content.style.cssText = `
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        padding: 24px;
      `;

      content.innerHTML = `
        <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Modal Title</h2>
        <p style="margin: 0 0 24px 0; color: #666;">This is modal content for visual testing.</p>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: white;">Cancel</button>
          <button style="padding: 8px 16px; border: none; border-radius: 4px; background: #3b82f6; color: white;">Confirm</button>
        </div>
      `;

      modal.appendChild(content);
      document.body.appendChild(modal);
    });

    // Screenshot modal
    await expect(page.locator(".modal")).toHaveScreenshot("modal-appearance.png");

    // Test modal content focus
    await expect(page.locator(".modal .content")).toHaveScreenshot("modal-content.png");
  });

  test("ContextMenu component visual states", async ({ page }) => {
    await page.goto("/home");

    // Create context menu test
    await page.evaluate(() => {
      const menu = document.createElement("div");
      menu.id = "context-menu-test";
      menu.style.cssText = `
        position: fixed;
        top: 100px;
        left: 100px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        padding: 4px 0;
        min-width: 160px;
        z-index: 9999;
      `;

      const menuItems = [
        { text: "Open", icon: "📂" },
        { text: "Edit", icon: "✏️" },
        { text: "Share", icon: "🔗" },
        { text: "Delete", icon: "🗑️", class: "danger" },
      ];

      menuItems.forEach((item) => {
        const menuItem = document.createElement("div");
        menuItem.style.cssText = `
          padding: 8px 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          ${item.class === "danger" ? "color: #dc2626;" : ""}
        `;
        menuItem.innerHTML = `<span>${item.icon}</span><span>${item.text}</span>`;
        menuItem.onmouseover = () => {
          menuItem.style.backgroundColor = "#f3f4f6";
        };
        menuItem.onmouseout = () => {
          menuItem.style.backgroundColor = "transparent";
        };
        menu.appendChild(menuItem);
      });

      document.body.appendChild(menu);
    });

    // Screenshot context menu
    await expect(page.locator("#context-menu-test")).toHaveScreenshot("context-menu.png");

    // Test hover states
    await page.hover("#context-menu-test div:nth-child(1)");
    await expect(page.locator("#context-menu-test")).toHaveScreenshot("context-menu-hover.png");
  });

  test("File list visual layout", async ({ page }) => {
    await page.goto("/home");

    // Wait for file list to load
    await page.waitForSelector('[data-testid="files-container"]', { timeout: 10000 });

    // Screenshot the main file list area
    await expect(page.locator('[data-testid="files-container"]')).toHaveScreenshot(
      "file-list-layout.png"
    );

    // If there are files, screenshot individual file items
    const fileItems = await page.locator('[data-testid^="file-item-"]').count();
    if (fileItems > 0) {
      await expect(page.locator('[data-testid^="file-item-"]:first-child')).toHaveScreenshot(
        "file-item.png"
      );
    }
  });

  test("Workspace layout visual consistency", async ({ page }) => {
    // Create a test file to open workspace
    await page.goto("/home");

    // Click create file if no files exist
    const createButton = page.locator('[data-testid="create-file-button"]');
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.fill('[data-testid="file-title-input"]', "Visual Test File");
      await page.click('[data-testid="create-file-submit"]');

      // Should be in workspace now
      await page.waitForURL(/\/workspace/);
    }

    // Screenshot workspace layout
    await expect(page).toHaveScreenshot("workspace-layout.png", { fullPage: true });

    // Screenshot specific workspace components
    const editor = page.locator('[data-testid="rsm-editor"]');
    if (await editor.isVisible()) {
      await expect(editor).toHaveScreenshot("workspace-editor.png");
    }

    const preview = page.locator('[data-testid="manuscript-content"]');
    if (await preview.isVisible()) {
      await expect(preview).toHaveScreenshot("workspace-preview.png");
    }
  });

  test("Theme consistency visual check", async ({ page }) => {
    await page.goto("/home");

    // Screenshot in default theme
    await expect(page).toHaveScreenshot("theme-default.png", { fullPage: true });

    // Check if theme switcher exists
    const themeSwitch = page.locator('[data-testid="theme-switch"]');
    if (await themeSwitch.isVisible()) {
      // Switch to dark theme
      await themeSwitch.click();
      await page.waitForTimeout(500); // Wait for theme transition

      // Screenshot in dark theme
      await expect(page).toHaveScreenshot("theme-dark.png", { fullPage: true });
    }
  });

  test("FileMenu trigger visibility behavior", async ({ page }) => {
    await page.goto("/home");

    // Create a test page to verify file menu trigger visibility behavior
    await page.evaluate(() => {
      const container = document.createElement("div");
      container.id = "filemenu-test-container";
      container.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: white;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        z-index: 9999;
        width: 400px;
      `;
      document.body.appendChild(container);

      container.innerHTML = `
        <h3>FileMenu Trigger Visibility Test</h3>
        <div class="test-container" style="border: 1px solid #ccc; padding: 20px; margin: 10px 0;">
          <div class="item" style="display: grid; grid-template-columns: 1fr auto auto auto; gap: 16px; padding: 8px; transition: background-color 0.2s;">
            <span>Test File 1</span>
            <span>Tags</span>
            <span>Date</span>
            <div class="fm-wrapper">
              <button class="context-menu-trigger" style="opacity: 0; transition: opacity 0.3s; background: none; border: none; font-size: 18px; cursor: pointer; padding: 4px;">⋮</button>
            </div>
          </div>
        </div>
        <style>
          .item:hover {
            background: #f5f5f5;
          }
          .item:hover .context-menu-trigger {
            opacity: 1 !important;
          }
        </style>
      `;
    });

    // Screenshot initial state (trigger should be hidden)
    await expect(page.locator("#filemenu-test-container")).toHaveScreenshot(
      "filemenu-initial-state.png"
    );

    // Test hover behavior - verify trigger becomes visible
    await page.hover("#filemenu-test-container .item");
    await page.waitForTimeout(500); // Wait for transition

    // Get opacity values to verify behavior
    const triggerOpacity = await page
      .locator("#filemenu-test-container .context-menu-trigger")
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(parseFloat(triggerOpacity)).toBeGreaterThan(0.5);

    // Screenshot hover state (trigger should be visible)
    await expect(page.locator("#filemenu-test-container")).toHaveScreenshot(
      "filemenu-hover-state.png"
    );

    // Move away and verify trigger becomes hidden again
    await page.hover("#filemenu-test-container h3");
    await page.waitForTimeout(500);

    const triggerOpacityAfter = await page
      .locator("#filemenu-test-container .context-menu-trigger")
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(parseFloat(triggerOpacityAfter)).toBeLessThan(0.5);

    // Screenshot after hover (trigger should be hidden again)
    await expect(page.locator("#filemenu-test-container")).toHaveScreenshot(
      "filemenu-after-hover.png"
    );
  });

  test("Animation visual consistency", async ({ page }) => {
    await page.goto("/home");

    // Test tooltip animations if they exist
    const tooltipTrigger = page.locator("[title]").first();
    if (await tooltipTrigger.isVisible()) {
      await tooltipTrigger.hover();
      await page.waitForTimeout(300); // Wait for tooltip animation

      // Screenshot tooltip
      await expect(page).toHaveScreenshot("tooltip-animation.png");
    }

    // Test dropdown animations
    const dropdown = page.locator('[data-testid="user-menu"]');
    if (await dropdown.isVisible()) {
      await dropdown.click();
      await page.waitForTimeout(200); // Wait for dropdown animation

      // Screenshot dropdown
      await expect(page).toHaveScreenshot("dropdown-animation.png");
    }
  });
});
