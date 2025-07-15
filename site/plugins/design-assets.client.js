// Plugin to load design assets from backend
/* eslint-env node */
export default defineNuxtPlugin(() => {
  // Only run on client side and not in test environment
  if (process.client && process.env.NODE_ENV !== "test") {
    const config = useRuntimeConfig();
    // Determine backend URL based on environment
    const backendUrl =
      process.env.NODE_ENV === "production" ? "https://api.aris.pub" : config.public.backendUrl;

    // Only load design assets if we have a valid backend URL
    if (backendUrl && backendUrl !== "undefined" && backendUrl !== undefined) {
      // Load design assets CSS
      const designAssets = ["typography.css", "components.css", "layout.css", "variables.css"];

      designAssets.forEach((filename) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = `${backendUrl}/design-assets/css/${filename}`;
        document.head.appendChild(link);
      });
    }
  }
});
