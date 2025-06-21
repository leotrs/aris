import puppeteer from "puppeteer";

async function checkFileMenuLive() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  try {
    console.log("🔍 Navigating to http://localhost:5173/...");

    // First, let's set some localStorage to simulate being logged in
    await page.goto("http://localhost:5173/", { waitUntil: "networkidle0" });

    // Try to set a fake token to bypass auth (this might not work but worth trying)
    await page.evaluate(() => {
      localStorage.setItem("accessToken", "fake-token-for-testing");
    });

    // Navigate again after setting token
    await page.goto("http://localhost:5173/", { waitUntil: "networkidle0" });

    // Wait for initial load
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    // Check if we're redirected to login
    if (currentUrl.includes("/login")) {
      console.log("🔐 Detected login page. Attempting to bypass...");

      // Try to navigate directly to a files page or use demo mode
      const possibleRoutes = ["/workspace", "/home", "/files", "/dashboard"];

      for (const route of possibleRoutes) {
        try {
          await page.goto(`http://localhost:5173${route}`, { waitUntil: "networkidle0" });
          await new Promise((resolve) => setTimeout(resolve, 1000));

          if (!page.url().includes("/login")) {
            console.log(`✅ Successfully navigated to ${route}`);
            break;
          }
        } catch (e) {
          console.log(`❌ Failed to navigate to ${route}`);
        }
      }
    }

    // Check for any FilesItem components or file lists
    console.log("🔍 Looking for file items...");

    const pageAnalysis = await page.evaluate(() => {
      const analysis = {
        hasFileItems: false,
        hasFileMenus: false,
        hasContextMenuTriggers: false,
        elements: {
          items: [],
          fileMenus: [],
          triggers: [],
        },
      };

      // Look for file items
      const itemSelectors = [
        ".item",
        '[class*="item"]',
        '[data-testid*="file"]',
        ".file-item",
        ".files-item",
      ];

      itemSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          if (el.offsetParent !== null) {
            // visible elements only
            analysis.elements.items.push({
              selector,
              className: el.className,
              innerHTML: el.innerHTML.substring(0, 200),
              hasFileMenu: !!el.querySelector('.fm-wrapper, [class*="fm-wrapper"]'),
              hasTrigger: !!el.querySelector('.context-menu-trigger, [class*="trigger"]'),
            });
          }
        });
      });

      // Look for FileMenu wrappers
      const fileMenus = document.querySelectorAll('.fm-wrapper, [class*="fm-wrapper"]');
      fileMenus.forEach((menu) => {
        if (menu.offsetParent !== null) {
          analysis.elements.fileMenus.push({
            className: menu.className,
            visible: menu.offsetParent !== null,
            opacity: getComputedStyle(menu).opacity,
            display: getComputedStyle(menu).display,
            innerHTML: menu.innerHTML.substring(0, 300),
            parentClassName: menu.parentElement?.className,
          });
        }
      });

      // Look for context menu triggers
      const triggers = document.querySelectorAll(
        '.context-menu-trigger, [class*="context-menu-trigger"], [class*="trigger"]'
      );
      triggers.forEach((trigger) => {
        if (trigger.offsetParent !== null) {
          const styles = getComputedStyle(trigger);
          analysis.elements.triggers.push({
            className: trigger.className,
            tagName: trigger.tagName,
            opacity: styles.opacity,
            display: styles.display,
            visibility: styles.visibility,
            innerHTML: trigger.innerHTML.substring(0, 100),
            parentClassName: trigger.parentElement?.className,
          });
        }
      });

      analysis.hasFileItems = analysis.elements.items.length > 0;
      analysis.hasFileMenus = analysis.elements.fileMenus.length > 0;
      analysis.hasContextMenuTriggers = analysis.elements.triggers.length > 0;

      return analysis;
    });

    console.log("\\n📊 ANALYSIS RESULTS:");
    console.log(
      `File Items Found: ${pageAnalysis.hasFileItems} (${pageAnalysis.elements.items.length})`
    );
    console.log(
      `FileMenus Found: ${pageAnalysis.hasFileMenus} (${pageAnalysis.elements.fileMenus.length})`
    );
    console.log(
      `Context Menu Triggers Found: ${pageAnalysis.hasContextMenuTriggers} (${pageAnalysis.elements.triggers.length})`
    );

    if (pageAnalysis.elements.items.length > 0) {
      console.log("\\n📝 FILE ITEMS DETAILS:");
      pageAnalysis.elements.items.forEach((item, i) => {
        console.log(`Item ${i + 1}:`);
        console.log(`  Selector: ${item.selector}`);
        console.log(`  Class: ${item.className}`);
        console.log(`  Has FileMenu: ${item.hasFileMenu}`);
        console.log(`  Has Trigger: ${item.hasTrigger}`);
        console.log(`  HTML Preview: ${item.innerHTML.substring(0, 100)}...`);
      });
    }

    if (pageAnalysis.elements.fileMenus.length > 0) {
      console.log("\\n🍔 FILEMENU COMPONENTS:");
      pageAnalysis.elements.fileMenus.forEach((menu, i) => {
        console.log(`FileMenu ${i + 1}:`);
        console.log(`  Class: ${menu.className}`);
        console.log(`  Visible: ${menu.visible}`);
        console.log(`  Opacity: ${menu.opacity}`);
        console.log(`  Display: ${menu.display}`);
        console.log(`  Parent: ${menu.parentClassName}`);
      });
    }

    if (pageAnalysis.elements.triggers.length > 0) {
      console.log("\\n🎯 CONTEXT MENU TRIGGERS:");
      pageAnalysis.elements.triggers.forEach((trigger, i) => {
        console.log(`Trigger ${i + 1}:`);
        console.log(`  Tag: ${trigger.tagName}`);
        console.log(`  Class: ${trigger.className}`);
        console.log(`  Opacity: ${trigger.opacity}`);
        console.log(`  Display: ${trigger.display}`);
        console.log(`  Visibility: ${trigger.visibility}`);
        console.log(`  Content: ${trigger.innerHTML}`);
        console.log(`  Parent: ${trigger.parentClassName}`);
      });
    }

    // Test hover behavior if we found triggers
    if (pageAnalysis.elements.triggers.length > 0) {
      console.log("\\n🖱️  TESTING HOVER BEHAVIOR:");

      const hoverResults = await page.evaluate(() => {
        const results = [];
        const triggers = document.querySelectorAll(
          '.context-menu-trigger, [class*="context-menu-trigger"]'
        );

        triggers.forEach((trigger, index) => {
          if (trigger.offsetParent !== null) {
            const beforeOpacity = getComputedStyle(trigger).opacity;

            // Find parent item to hover
            let parent = trigger.parentElement;
            while (parent && !parent.classList.contains("item") && parent !== document.body) {
              parent = parent.parentElement;
            }

            if (parent && parent.classList.contains("item")) {
              // Simulate hover
              const hoverEvent = new MouseEvent("mouseenter", { bubbles: true });
              parent.dispatchEvent(hoverEvent);

              // Check opacity after hover
              const afterOpacity = getComputedStyle(trigger).opacity;

              results.push({
                index,
                beforeOpacity,
                afterOpacity,
                parentFound: true,
                parentClass: parent.className,
              });

              // Remove hover
              const leaveEvent = new MouseEvent("mouseleave", { bubbles: true });
              parent.dispatchEvent(leaveEvent);
            } else {
              results.push({
                index,
                beforeOpacity,
                afterOpacity: beforeOpacity,
                parentFound: false,
                parentClass: null,
              });
            }
          }
        });

        return results;
      });

      hoverResults.forEach((result, i) => {
        console.log(`Trigger ${i + 1} hover test:`);
        console.log(`  Before: opacity ${result.beforeOpacity}`);
        console.log(`  After: opacity ${result.afterOpacity}`);
        console.log(`  Parent found: ${result.parentFound}`);
        console.log(`  Parent class: ${result.parentClass}`);

        if (result.beforeOpacity === "0" && result.afterOpacity === "1") {
          console.log(`  ✅ WORKING: Opacity changes on hover`);
        } else if (result.beforeOpacity === result.afterOpacity && result.beforeOpacity === "0") {
          console.log(`  ❌ PROBLEM: Dots remain hidden even on hover`);
        } else if (result.beforeOpacity === "1") {
          console.log(`  ⚠️  NOTE: Dots are always visible (opacity: 1)`);
        }
      });
    }

    // Take screenshot for visual confirmation
    await page.screenshot({
      path: "live-filemenu-check.png",
      fullPage: true,
    });
    console.log("\\n📸 Screenshot saved as live-filemenu-check.png");

    // Final assessment
    console.log("\\n🎯 FINAL ASSESSMENT:");

    if (!pageAnalysis.hasFileItems) {
      console.log(
        "❌ NO FILE ITEMS: Cannot test FileMenu because no file items are visible on the page"
      );
    } else if (!pageAnalysis.hasFileMenus) {
      console.log("❌ NO FILEMENUS: File items exist but no FileMenu components found");
    } else if (!pageAnalysis.hasContextMenuTriggers) {
      console.log("❌ NO TRIGGERS: FileMenu components exist but no context menu triggers found");
    } else {
      const visibleTriggers = pageAnalysis.elements.triggers.filter((t) => t.opacity !== "0");
      if (visibleTriggers.length === 0) {
        console.log("❌ DOTS NOT VISIBLE: Context menu triggers exist but all have opacity: 0");
        console.log("   This confirms the user's report - the dots are not visible");
      } else {
        console.log("✅ DOTS VISIBLE: Some context menu triggers are visible");
      }
    }
  } catch (error) {
    console.error("❌ Error during check:", error);
  } finally {
    await browser.close();
  }
}

checkFileMenuLive().catch(console.error);
