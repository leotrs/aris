import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { copilotService } from "@/services/copilotService.js";

// Mock fetch globally
global.fetch = vi.fn();

describe("copilotService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage for JWT token
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => "mock-jwt-token"),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("sendMessage", () => {
    it("should send a chat message with authentication headers", async () => {
      const mockResponse = {
        message: "Help me with this",
        response: "Here's how I can help...",
        context_used: true,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await copilotService.sendMessage("Help me with this", 123);

      expect(fetch).toHaveBeenCalledWith("/copilot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mock-jwt-token",
        },
        body: JSON.stringify({
          message: "Help me with this",
          context: {
            file_id: 123,
          },
        }),
      });

      expect(result).toEqual(mockResponse);
    });

    it("should send message without file_id when not provided", async () => {
      const mockResponse = {
        message: "General help",
        response: "General response...",
        context_used: false,
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await copilotService.sendMessage("General help");

      expect(fetch).toHaveBeenCalledWith("/copilot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mock-jwt-token",
        },
        body: JSON.stringify({
          message: "General help",
          context: {},
        }),
      });
    });

    it("should handle 401 unauthorized error", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ detail: "Unauthorized" }),
      });

      await expect(copilotService.sendMessage("Help me")).rejects.toThrow(
        "Authentication required. Please log in."
      );
    });

    it("should handle 429 rate limit error", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: () => Promise.resolve({ detail: "Rate limit exceeded" }),
      });

      await expect(copilotService.sendMessage("Help me")).rejects.toThrow(
        "Rate limit exceeded. Please try again later."
      );
    });

    it("should handle 503 service unavailable error", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: () => Promise.resolve({ detail: "Service unavailable" }),
      });

      await expect(copilotService.sendMessage("Help me")).rejects.toThrow(
        "AI service is temporarily unavailable. Please try again later."
      );
    });

    it("should handle generic server errors", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ detail: "Internal server error" }),
      });

      await expect(copilotService.sendMessage("Help me")).rejects.toThrow(
        "Server error occurred. Please try again."
      );
    });

    it("should handle network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(copilotService.sendMessage("Help me")).rejects.toThrow(
        "Network error occurred. Please check your connection."
      );
    });

    it("should throw error when no authentication token is available", async () => {
      window.localStorage.getItem.mockReturnValue(null);

      await expect(copilotService.sendMessage("Help me")).rejects.toThrow(
        "Authentication token not found. Please log in."
      );
    });
  });
});
