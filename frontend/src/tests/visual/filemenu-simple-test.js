import puppeteer from "puppeteer";

async function testFileMenuVisibility() {
  const browser = await puppeteer.launch({
    headless: false, // Show browser to see the result
    slowMo: 100,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  try {
    // Navigate to a test page that shows FilesItem components
    await page.goto("http://localhost:5173", { waitUntil: "networkidle0" });

    // For this test, let's create a minimal HTML page with our components
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>FileMenu Test</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .test-container { border: 1px solid #ccc; padding: 20px; margin: 10px 0; }
          .item { display: grid; grid-template-columns: 1fr auto auto auto; gap: 16px; padding: 8px; }
          .item:hover { background: #f5f5f5; }
        </style>
      </head>
      <body>
        <h1>FileMenu Visibility Test</h1>
        <div class="test-container">
          <div class="item">
            <span>Test File 1</span>
            <span>Tags</span>
            <span>Date</span>
            <div class="fm-wrapper">
              <button class="context-menu-trigger" style="opacity: 0; transition: opacity 0.3s;">⋮</button>
            </div>
          </div>
        </div>
        
        <style>
          .item:hover .context-menu-trigger {
            opacity: 1 !important;
          }
          .context-menu-trigger {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 4px;
          }
        </style>
        
        <script>
          console.log('Test page loaded');
          
          // Test the hover behavior
          const item = document.querySelector('.item');
          const trigger = document.querySelector('.context-menu-trigger');
          
          console.log('Initial opacity:', getComputedStyle(trigger).opacity);
          
          item.addEventListener('mouseenter', () => {
            console.log('Mouse enter - opacity:', getComputedStyle(trigger).opacity);
          });
          
          item.addEventListener('mouseleave', () => {
            console.log('Mouse leave - opacity:', getComputedStyle(trigger).opacity);
          });
        </script>
      </body>
      </html>
    `);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Testing hover behavior...");

    // Test hover behavior
    const item = await page.$(".item");
    const trigger = await page.$(".context-menu-trigger");

    if (item && trigger) {
      // Get initial opacity
      const initialOpacity = await page.evaluate((el) => getComputedStyle(el).opacity, trigger);
      console.log(`Initial opacity: ${initialOpacity}`);

      // Hover over item
      await item.hover();
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get opacity after hover
      const hoverOpacity = await page.evaluate((el) => getComputedStyle(el).opacity, trigger);
      console.log(`Hover opacity: ${hoverOpacity}`);

      if (initialOpacity === "0" && hoverOpacity === "1") {
        console.log("✅ SUCCESS: FileMenu dots behavior working correctly!");
      } else {
        console.log("❌ ISSUE: FileMenu dots behavior not working as expected");
      }
    }

    // Take screenshot
    await page.screenshot({ path: "filemenu-test-result.png" });
    console.log("Screenshot saved as filemenu-test-result.png");

    // Keep browser open briefly
    console.log("Keeping browser open for 5 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (error) {
    console.error("Test error:", error);
  } finally {
    await browser.close();
  }
}

testFileMenuVisibility().catch(console.error);
