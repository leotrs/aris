import { describe, it, expect, beforeAll, afterAll } from "vitest";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("ContextMenu Visual Animation Debug", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1200, height: 800 });

    // Navigate to dev server
    await page.goto("http://localhost:5173", { waitUntil: "networkidle0" });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  it("should investigate ContextMenu animation behavior", async () => {
    // Navigate to a page that has ContextMenus (likely the home page)
    await page.goto("http://localhost:5173", { waitUntil: "networkidle0" });

    // Wait for the page to be fully loaded
    await page.waitForTimeout(1000);

    // Look for any ContextMenu triggers (dots buttons, etc.)
    const contextMenuTriggers = await page.$$(
      '.context-menu-trigger, .cm-btn, [data-testid*="menu"], .fm-wrapper .context-menu-trigger'
    );

    console.log(`Found ${contextMenuTriggers.length} potential ContextMenu triggers`);

    if (contextMenuTriggers.length > 0) {
      const trigger = contextMenuTriggers[0];

      // Get the initial position and properties of the trigger
      const triggerBox = await trigger.boundingBox();
      console.log("Trigger position:", triggerBox);

      // Set up animation monitoring
      await page.evaluate(() => {
        window.animationEvents = [];

        // Monitor for new elements being added to DOM
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (
                node.nodeType === 1 &&
                (node.classList?.contains("context-menu") ||
                  node.classList?.contains("cm-menu") ||
                  node.getAttribute?.("data-testid") === "context-menu")
              ) {
                const rect = node.getBoundingClientRect();
                window.animationEvents.push({
                  type: "menu-added",
                  timestamp: performance.now(),
                  position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
                  transform: getComputedStyle(node).transform,
                  opacity: getComputedStyle(node).opacity,
                });

                // Monitor animation frames
                const monitorAnimation = () => {
                  const rect = node.getBoundingClientRect();
                  const styles = getComputedStyle(node);
                  window.animationEvents.push({
                    type: "animation-frame",
                    timestamp: performance.now(),
                    position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
                    transform: styles.transform,
                    opacity: styles.opacity,
                    transition: styles.transition,
                  });

                  if (styles.opacity !== "1" || styles.transform !== "none") {
                    requestAnimationFrame(monitorAnimation);
                  }
                };
                requestAnimationFrame(monitorAnimation);
              }
            });
          });
        });

        observer.observe(document.body, { childList: true, subtree: true });
      });

      // Click the trigger to open the menu
      await trigger.click();

      // Wait for animation to complete
      await page.waitForTimeout(500);

      // Get the animation events
      const events = await page.evaluate(() => window.animationEvents);

      console.log("Animation events:", events.length);
      events.forEach((event, index) => {
        console.log(`Event ${index}:`, {
          type: event.type,
          timestamp: Math.round(event.timestamp),
          position: event.position,
          transform: event.transform,
          opacity: event.opacity,
        });
      });

      // Look for evidence of position changes during animation
      const positionChanges = events.filter((event) => event.type === "animation-frame");
      if (positionChanges.length > 1) {
        const firstFrame = positionChanges[0];
        const lastFrame = positionChanges[positionChanges.length - 1];

        const positionDelta = {
          x: Math.abs(lastFrame.position.x - firstFrame.position.x),
          y: Math.abs(lastFrame.position.y - firstFrame.position.y),
        };

        console.log("Position delta during animation:", positionDelta);

        if (positionDelta.x > 1 || positionDelta.y > 1) {
          console.log("❌ PROBLEM: Menu position changed during animation!");
          console.log("First position:", firstFrame.position);
          console.log("Last position:", lastFrame.position);
        } else {
          console.log("✅ GOOD: Menu position remained stable during animation");
        }
      }

      // Analyze transform values
      const transforms = events.map((e) => e.transform).filter((t) => t && t !== "none");
      if (transforms.length > 0) {
        console.log("Transform values during animation:", transforms);

        // Check for translate values that might cause flying
        const hasTranslateY = transforms.some(
          (t) => t.includes("translateY") || t.includes("translate(")
        );
        if (hasTranslateY) {
          console.log("❌ PROBLEM: Found translateY in transforms - this causes flying!");
        } else {
          console.log("✅ GOOD: No translateY found in transforms");
        }
      }

      // Take a screenshot for visual confirmation
      await page.screenshot({
        path: "contextmenu-debug.png",
        fullPage: false,
      });

      expect(events.length).toBeGreaterThan(0);
    } else {
      console.log("No ContextMenu triggers found on the page");
      // Take screenshot to see what's on the page
      await page.screenshot({
        path: "page-debug.png",
        fullPage: true,
      });
    }
  });

  it("should check CSS rules applied to ContextMenu", async () => {
    await page.goto("http://localhost:5173", { waitUntil: "networkidle0" });

    // Get all CSS rules related to ContextMenu animations
    const cssRules = await page.evaluate(() => {
      const rules = [];
      for (let i = 0; i < document.styleSheets.length; i++) {
        try {
          const sheet = document.styleSheets[i];
          for (let j = 0; j < sheet.cssRules.length; j++) {
            const rule = sheet.cssRules[j];
            if (
              rule.selectorText &&
              (rule.selectorText.includes("cm-menu") || rule.selectorText.includes("context-menu"))
            ) {
              rules.push({
                selector: rule.selectorText,
                cssText: rule.cssText,
              });
            }
          }
        } catch (e) {
          // Skip external stylesheets due to CORS
        }
      }
      return rules;
    });

    console.log("CSS rules for ContextMenu:");
    cssRules.forEach((rule) => {
      console.log(`${rule.selector}:`);
      console.log(rule.cssText);
      console.log("---");
    });

    // Look for problematic transform rules
    const problematicRules = cssRules.filter(
      (rule) => rule.cssText.includes("translateY") || rule.cssText.includes("translate(")
    );

    if (problematicRules.length > 0) {
      console.log("❌ FOUND PROBLEMATIC RULES WITH TRANSLATE:");
      problematicRules.forEach((rule) => {
        console.log(rule.selector, ":", rule.cssText);
      });
    }

    expect(cssRules.length).toBeGreaterThan(0);
  });
});
