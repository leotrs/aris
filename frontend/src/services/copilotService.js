/**
 * AI Copilot Service
 * Handles communication with the backend copilot API
 */

/**
 * Get JWT token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
function getAuthToken() {
  return localStorage.getItem("accessToken");
}

/**
 * Send a chat message to the AI copilot
 * @param {string} message - The user's message
 * @param {number} [fileId] - Optional file ID for context
 * @returns {Promise<Object>} Response from the AI copilot
 * @throws {Error} Various error types based on response status
 */
async function sendMessage(message, fileId = null) {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }

  const requestBody = {
    message,
    context: {},
  };

  if (fileId) {
    requestBody.context.file_id = fileId;
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";
  
  try {
    const response = await fetch(`${apiBaseUrl}/copilot/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      await response.json(); // Read response to handle error properly

      switch (response.status) {
        case 401:
          throw new Error("Authentication required. Please log in.");
        case 429:
          throw new Error("Rate limit exceeded. Please try again later.");
        case 503:
          throw new Error("AI service is temporarily unavailable. Please try again later.");
        default:
          throw new Error("Server error occurred. Please try again.");
      }
    }

    return await response.json();
  } catch (error) {
    if (
      error.message.includes("Authentication") ||
      error.message.includes("Rate limit") ||
      error.message.includes("unavailable") ||
      error.message.includes("Server error")
    ) {
      throw error;
    }
    throw new Error("Network error occurred. Please check your connection.");
  }
}

export const copilotService = {
  sendMessage,
};
