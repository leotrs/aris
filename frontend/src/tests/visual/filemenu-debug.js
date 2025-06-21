import puppeteer from "puppeteer";

async function debugFileMenu() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  try {
    console.log("Navigating to localhost...");
    await page.goto("http://localhost:5173", { waitUntil: "networkidle0" });

    // Wait for page to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check what page we're on
    const currentUrl = page.url();
    const pageTitle = await page.title();
    console.log(`Current URL: ${currentUrl}`);
    console.log(`Page title: ${pageTitle}`);

    // Check if we need to login or navigate to files
    const pageContent = await page.evaluate(() => {
      return {
        hasLoginForm: !!document.querySelector(
          'form[action*="login"], input[type="password"], .login'
        ),
        hasFilesContent: !!document.querySelector('.item, .files, [class*="file"]'),
        bodyText: document.body.textContent?.substring(0, 500),
        mainElements: Array.from(document.querySelectorAll("main, .main, #app > div")).map(
          (el) => ({
            className: el.className,
            id: el.id,
            tagName: el.tagName,
          })
        ),
      };
    });

    console.log("Page analysis:", pageContent);

    // If we're on login page, try to navigate to files
    if (pageContent.hasLoginForm) {
      console.log("Detected login page, trying to navigate to files...");
      // Try to find a link to files or dashboard
      const filesLink = await page.$('a[href*="files"], a[href*="dashboard"], a[href*="home"]');
      if (filesLink) {
        await filesLink.click();
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log("Looking for FilesItem components...");

    // Check if we're on a page with FilesItem components
    const filesItems = await page.$$eval('[class*="item"]', (elements) =>
      elements.map((el) => ({
        className: el.className,
        visible: el.offsetParent !== null,
        innerHTML: el.innerHTML.substring(0, 200) + "...",
      }))
    );

    console.log(`Found ${filesItems.length} potential file items`);

    // Look specifically for FileMenu wrappers
    const fileMenus = await page.evaluate(() => {
      const menus = document.querySelectorAll('.fm-wrapper, [class*="fm-wrapper"]');
      return Array.from(menus).map((menu) => ({
        className: menu.className,
        visible: menu.offsetParent !== null,
        display: getComputedStyle(menu).display,
        opacity: getComputedStyle(menu).opacity,
        innerHTML: menu.innerHTML.substring(0, 300),
        parentClassName: menu.parentElement?.className,
        hasChildren: menu.children.length,
      }));
    });

    console.log("\\n=== FILE MENU ANALYSIS ===");
    console.log(`Found ${fileMenus.length} FileMenu components:`);
    fileMenus.forEach((menu, i) => {
      console.log(`\\nFileMenu ${i + 1}:`);
      console.log(`  Class: ${menu.className}`);
      console.log(`  Visible: ${menu.visible}`);
      console.log(`  Display: ${menu.display}`);
      console.log(`  Opacity: ${menu.opacity}`);
      console.log(`  Children: ${menu.hasChildren}`);
      console.log(`  Parent: ${menu.parentClassName}`);
      console.log(`  HTML: ${menu.innerHTML.substring(0, 100)}...`);
    });

    // Look for any console errors
    const consoleMessages = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleMessages.push(msg.text());
      }
    });

    // Check for Vue component errors
    const vueErrors = await page.evaluate(() => {
      const errors = [];

      // Check for any elements with error states
      const errorElements = document.querySelectorAll('[data-v-error], .error, [class*="error"]');
      Array.from(errorElements).forEach((el) => {
        errors.push({
          type: "element-error",
          className: el.className,
          text: el.textContent?.substring(0, 100),
        });
      });

      return errors;
    });

    if (vueErrors.length > 0) {
      console.log("\\n=== VUE ERRORS ===");
      vueErrors.forEach((error) => {
        console.log(`Error: ${error.type} - ${error.className}: ${error.text}`);
      });
    }

    // Try to find ContextMenu triggers specifically
    const contextMenuTriggers = await page.evaluate(() => {
      const triggers = document.querySelectorAll(
        '.context-menu-trigger, [class*="context-menu-trigger"]'
      );
      return Array.from(triggers).map((trigger) => ({
        className: trigger.className,
        visible: trigger.offsetParent !== null,
        opacity: getComputedStyle(trigger).opacity,
        display: getComputedStyle(trigger).display,
        parentClassName: trigger.parentElement?.className,
        tagName: trigger.tagName,
      }));
    });

    console.log("\\n=== CONTEXT MENU TRIGGERS ===");
    console.log(`Found ${contextMenuTriggers.length} ContextMenu triggers:`);
    contextMenuTriggers.forEach((trigger, i) => {
      console.log(`\\nTrigger ${i + 1}:`);
      console.log(`  Tag: ${trigger.tagName}`);
      console.log(`  Class: ${trigger.className}`);
      console.log(`  Visible: ${trigger.visible}`);
      console.log(`  Opacity: ${trigger.opacity}`);
      console.log(`  Display: ${trigger.display}`);
      console.log(`  Parent: ${trigger.parentClassName}`);
    });

    // Test hover behavior
    if (contextMenuTriggers.length > 0) {
      console.log("\\n=== TESTING HOVER BEHAVIOR ===");

      const firstVisibleTrigger = await page.$(
        '.context-menu-trigger:not([style*="display: none"])'
      );
      if (firstVisibleTrigger) {
        console.log("Testing hover on first visible trigger...");

        // Get opacity before hover
        const opacityBefore = await page.evaluate(
          (el) => getComputedStyle(el).opacity,
          firstVisibleTrigger
        );
        console.log(`Opacity before hover: ${opacityBefore}`);

        // Hover over the trigger's parent (the FilesItem)
        const parentItem = await page.evaluateHandle((el) => {
          let parent = el.parentElement;
          while (parent && !parent.classList.contains("item")) {
            parent = parent.parentElement;
          }
          return parent;
        }, firstVisibleTrigger);

        if (parentItem) {
          await parentItem.hover();
          await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for transition

          // Get opacity after hover
          const opacityAfter = await page.evaluate(
            (el) => getComputedStyle(el).opacity,
            firstVisibleTrigger
          );
          console.log(`Opacity after hover: ${opacityAfter}`);

          if (opacityBefore !== opacityAfter) {
            console.log("✅ GOOD: Opacity changed on hover");
          } else {
            console.log("❌ ISSUE: Opacity did not change on hover");
          }
        }
      }
    }

    // Take screenshot
    await page.screenshot({
      path: "filemenu-debug.png",
      fullPage: true,
    });
    console.log("\\nScreenshot saved as filemenu-debug.png");

    if (consoleMessages.length > 0) {
      console.log("\\n=== CONSOLE ERRORS ===");
      consoleMessages.forEach((msg) => console.log(`Error: ${msg}`));
    }
  } catch (error) {
    console.error("Debug error:", error);
  } finally {
    await browser.close();
  }
}

debugFileMenu().catch(console.error);
