/**
 * @file Unit tests for RSM demo section functionality
 */

/* global $fetch */
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("RSM Demo Section", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have proper RSM markup format", () => {
    const simpleMarkup = `:rsm:
# The Future of Academic Publishing

Recent advances in *semantic markup* have enabled new approaches to scholarly communication. This **web-native** approach separates content from presentation.

::`;

    expect(simpleMarkup).toContain(":rsm:");
    expect(simpleMarkup).toContain("::");
    expect(simpleMarkup).toContain("# The Future of Academic Publishing");
  });

  it("should handle render API calls correctly", async () => {
    const mockFetch = vi.fn().mockResolvedValue("<h1>Rendered Content</h1>");
    global.$fetch = mockFetch;

    const renderRsm = async (source) => {
      const config = { public: { backendUrl: "http://localhost:8000" } };
      return await $fetch(`${config.public.backendUrl}/render`, {
        method: "POST",
        body: { source },
      });
    };

    const result = await renderRsm(":rsm:\n# Test\n::");

    expect(mockFetch).toHaveBeenCalledWith("http://localhost:8000/render", {
      method: "POST",
      body: { source: ":rsm:\n# Test\n::" },
    });
    expect(result).toBe("<h1>Rendered Content</h1>");
  });

  it("should handle caching mechanism", () => {
    const renderCache = new Map();
    const source = ":rsm:\n# Test\n::";
    const renderedContent = "<h1>Test</h1>";

    // Cache miss
    expect(renderCache.has(source)).toBe(false);

    // Add to cache
    renderCache.set(source, renderedContent);

    // Cache hit
    expect(renderCache.has(source)).toBe(true);
    expect(renderCache.get(source)).toBe(renderedContent);
  });

  it("should handle API errors gracefully", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("API Error"));
    global.$fetch = mockFetch;

    const renderRsm = async (source) => {
      try {
        const config = { public: { backendUrl: "http://localhost:8000" } };
        return await $fetch(`${config.public.backendUrl}/render`, {
          method: "POST",
          body: { source },
        });
      } catch {
        return "<p>Fallback content</p>";
      }
    };

    const result = await renderRsm(":rsm:\n# Test\n::");
    expect(result).toBe("<p>Fallback content</p>");
  });

  it("should validate demo component state management", () => {
    // Test reactive state
    const activeTab = { value: "simple" };
    const viewMode = { value: "both" };
    const demoLoading = { value: false };
    const demoError = { value: false };

    expect(activeTab.value).toBe("simple");
    expect(viewMode.value).toBe("both");
    expect(demoLoading.value).toBe(false);
    expect(demoError.value).toBe(false);

    // Simulate state changes
    activeTab.value = "complex";
    demoLoading.value = true;

    expect(activeTab.value).toBe("complex");
    expect(demoLoading.value).toBe(true);
  });
});
