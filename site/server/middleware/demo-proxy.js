import { defineEventHandler, getRequestURL, sendRedirect, createError } from "h3";

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);

  // Only handle /demo requests (with or without trailing slash)
  if (url.pathname === "/demo" || url.pathname === "/demo/") {
    // Get frontend URL from runtime config or environment
    const config = useRuntimeConfig();
    const frontendUrl = config.public.frontendUrl || process.env.FRONTEND_URL;

    if (!frontendUrl) {
      console.error("Demo proxy error: FRONTEND_URL not configured");
      throw createError({
        statusCode: 502,
        statusMessage: "Demo service not configured",
      });
    }

    const targetUrl = `${frontendUrl}/demo`;

    try {
      // Redirect to the frontend demo
      return sendRedirect(event, targetUrl, 302);
    } catch (error) {
      console.error("Demo proxy error:", error);
      throw createError({
        statusCode: 502,
        statusMessage: "Demo service unavailable",
      });
    }
  }
});
