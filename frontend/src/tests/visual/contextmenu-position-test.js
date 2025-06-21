import puppeteer from "puppeteer";

// Simple script to manually test the animation behavior
async function testContextMenuAnimation() {
  const browser = await puppeteer.launch({
    headless: false, // Show the browser
    slowMo: 50, // Slow down actions to observe
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  try {
    // Navigate to the dev server
    await page.goto("http://localhost:5173", { waitUntil: "networkidle0" });

    // Wait a bit for everything to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Looking for ContextMenu triggers...");

    // Try to find any context menu triggers
    const triggers = await page.$$eval(
      '[class*="context-menu-trigger"], [class*="cm-btn"], [class*="fm-wrapper"] button',
      (elements) =>
        elements.map((el) => ({
          tagName: el.tagName,
          className: el.className,
          text: el.textContent?.trim(),
          visible: el.offsetParent !== null,
        }))
    );

    console.log("Found triggers:", triggers);

    if (triggers.length > 0) {
      // Find the first visible trigger
      const visibleTrigger = await page.$(
        '[class*="context-menu-trigger"]:not([style*="display: none"]), [class*="cm-btn"]:not([style*="display: none"]), [class*="fm-wrapper"] button:not([style*="display: none"])'
      );

      if (visibleTrigger) {
        console.log("Found visible trigger, testing animation...");

        // Monitor animation
        await page.evaluate(() => {
          window.animationLog = [];

          // Observer for new elements
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
                  window.animationLog.push({
                    event: "menu-appeared",
                    time: performance.now(),
                    position: { x: rect.x, y: rect.y },
                    styles: {
                      transform: getComputedStyle(node).transform,
                      opacity: getComputedStyle(node).opacity,
                    },
                  });

                  // Monitor position changes
                  let frame = 0;
                  const monitorFrame = () => {
                    frame++;
                    const currentRect = node.getBoundingClientRect();
                    const currentStyles = getComputedStyle(node);

                    window.animationLog.push({
                      event: "animation-frame",
                      frame,
                      time: performance.now(),
                      position: { x: currentRect.x, y: currentRect.y },
                      styles: {
                        transform: currentStyles.transform,
                        opacity: currentStyles.opacity,
                      },
                    });

                    if (
                      frame < 20 &&
                      (currentStyles.opacity !== "1" || currentStyles.transform.includes("scale"))
                    ) {
                      requestAnimationFrame(monitorFrame);
                    }
                  };
                  requestAnimationFrame(monitorFrame);
                }
              });
            });
          });

          observer.observe(document.body, { childList: true, subtree: true });
        });

        // Click the trigger
        await visibleTrigger.click();

        // Wait for animation to complete
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get animation log
        const animationLog = await page.evaluate(() => window.animationLog);

        console.log("\\n=== ANIMATION ANALYSIS ===");
        animationLog.forEach((log, i) => {
          console.log(`${i}: ${log.event} at ${Math.round(log.time)}ms`);
          console.log(
            `   Position: x=${Math.round(log.position.x)}, y=${Math.round(log.position.y)}`
          );
          console.log(`   Transform: ${log.styles.transform}`);
          console.log(`   Opacity: ${log.styles.opacity}`);
          console.log("");
        });

        // Check for position changes during animation
        const frames = animationLog.filter((log) => log.event === "animation-frame");
        if (frames.length > 1) {
          const firstFrame = frames[0];
          const lastFrame = frames[frames.length - 1];

          const deltaX = Math.abs(lastFrame.position.x - firstFrame.position.x);
          const deltaY = Math.abs(lastFrame.position.y - firstFrame.position.y);

          console.log(`Position delta: x=${deltaX}, y=${deltaY}`);

          if (deltaX > 2 || deltaY > 2) {
            console.log("❌ ANIMATION ISSUE: Position changed during animation (fly-in detected)");
          } else {
            console.log("✅ GOOD: Position remained stable during animation");
          }
        }

        // Take a screenshot
        await page.screenshot({ path: "contextmenu-animation-test.png" });
        console.log("Screenshot saved as contextmenu-animation-test.png");
      } else {
        console.log("No visible triggers found");
      }
    } else {
      console.log("No triggers found at all");
    }

    // Keep browser open for manual inspection
    console.log("\\nBrowser will stay open for 10 seconds for manual inspection...");
    await new Promise((resolve) => setTimeout(resolve, 10000));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}

// Run the test
testContextMenuAnimation().catch(console.error);
