// Plugin to load design assets from backend
export default defineNuxtPlugin(() => {
  // Only run on client side
  if (process.client) {
    // Determine backend URL based on environment
    const backendUrl =
      process.env.NODE_ENV === "production" ? "https://api.aris.pub" : "http://localhost:8001";

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
