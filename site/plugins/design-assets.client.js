// Plugin to load design assets from backend
/* eslint-env node */
export default defineNuxtPlugin(() => {
  // Only run on client side
  if (process.client) {
    const _config = useRuntimeConfig();
    // Determine backend URL based on environment
    const backendUrl =
      process.env.NODE_ENV === "production" ? "https://api.aris.pub" : process.env.NUXT_BACKEND_URL;

    // Load RSM CSS first (contains core design system variables)
    const rsmLink = document.createElement("link");
    rsmLink.rel = "stylesheet";
    rsmLink.href = `${backendUrl}/static/rsm.css`;
    document.head.appendChild(rsmLink);

    // Load design assets CSS
    const designAssets = ["typography.css", "components.css", "layout.css", "variables.css"];

    designAssets.forEach((filename) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `${backendUrl}/design-assets/css/${filename}`;
      document.head.appendChild(link);
    });
  }
});
