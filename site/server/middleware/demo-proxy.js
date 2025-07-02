import { defineEventHandler, getRequestURL, sendRedirect, createError } from "h3";

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);

  // Only handle /demo requests (with or without trailing slash)
  if (url.pathname === "/demo" || url.pathname === "/demo/") {
    const frontendUrl = process.env.FRONTEND_URL;
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
