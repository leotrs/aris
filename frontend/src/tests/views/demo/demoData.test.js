import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  demoFile,
  demoUser,
  demoFileStore,
  demoAnnotations,
  createDemoApi,
} from "@/views/demo/demoData.js";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Demo Data Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Demo Data Structure", () => {
    describe("demoFile", () => {
      it("has correct structure and required properties", () => {
        expect(demoFile).toHaveProperty("id");
        expect(demoFile).toHaveProperty("title");
        expect(demoFile).toHaveProperty("source");
        expect(demoFile).toHaveProperty("last_edited_at");
        expect(demoFile).toHaveProperty("tags");
        expect(demoFile).toHaveProperty("minimap");
        expect(demoFile).toHaveProperty("ownerId");
      });

      it("has correct ID and basic properties", () => {
        expect(demoFile.id).toBe(999);
        expect(demoFile.title).toBe("Sample Research Paper: The Future of Web-Native Publishing");
        expect(typeof demoFile.source).toBe("string");
        expect(demoFile.source.length).toBeGreaterThan(0);
      });

      it("has properly formatted RSM content", () => {
        expect(demoFile.source).toMatch(/^:rsm:/);
        expect(demoFile.source).toMatch(/::$/);
        expect(demoFile.source).toContain("# The Future of Web-Native Publishing");
      });

      it("contains expected RSM markup elements", () => {
        expect(demoFile.source).toContain(":abstract:");
        expect(demoFile.source).toContain(":itemize:");
        expect(demoFile.source).toContain(":enumerate:");
        expect(demoFile.source).toContain(":item:");
      });

      it("has valid tags array", () => {
        expect(Array.isArray(demoFile.tags)).toBe(true);
        expect(demoFile.tags.length).toBeGreaterThan(0);

        demoFile.tags.forEach((tag) => {
          expect(tag).toHaveProperty("id");
          expect(tag).toHaveProperty("name");
          expect(tag).toHaveProperty("color");
          expect(typeof tag.name).toBe("string");
          expect(typeof tag.color).toBe("string");
          expect(tag.color).toMatch(/^#[0-9a-f]{6}$/i);
        });
      });

      it("has valid last_edited_at timestamp", () => {
        expect(typeof demoFile.last_edited_at).toBe("string");
        expect(new Date(demoFile.last_edited_at)).toBeInstanceOf(Date);
        expect(isNaN(new Date(demoFile.last_edited_at).getTime())).toBe(false);
      });
    });

    describe("demoUser", () => {
      it("has correct user structure", () => {
        expect(demoUser).toHaveProperty("id");
        expect(demoUser).toHaveProperty("username");
        expect(demoUser).toHaveProperty("email");
        expect(demoUser).toHaveProperty("firstName");
        expect(demoUser).toHaveProperty("lastName");
      });

      it("has valid user data", () => {
        expect(demoUser.id).toBe(1);
        expect(typeof demoUser.username).toBe("string");
        expect(typeof demoUser.email).toBe("string");
        expect(demoUser.email).toContain("@");
        expect(typeof demoUser.firstName).toBe("string");
        expect(typeof demoUser.lastName).toBe("string");
      });
    });

    describe("demoFileStore", () => {
      it("has correct file store structure", () => {
        expect(demoFileStore).toHaveProperty("files");
        expect(Array.isArray(demoFileStore.files)).toBe(true);
        expect(demoFileStore.files.length).toBeGreaterThan(0);
      });

      it("contains the demo file in the store", () => {
        const demoFileInStore = demoFileStore.files.find((f) => f.id === demoFile.id);
        expect(demoFileInStore).toBeDefined();
        expect(demoFileInStore.title).toBe(demoFile.title);
      });

      it("has demo files for demonstration", () => {
        expect(demoFileStore.files.length).toBeGreaterThanOrEqual(1);

        demoFileStore.files.forEach((file) => {
          expect(file).toHaveProperty("id");
          expect(file).toHaveProperty("title");
          expect(file).toHaveProperty("last_edited_at");
          expect(typeof file.title).toBe("string");
        });
      });
    });

    describe("demoAnnotations", () => {
      it("is an array with annotation objects", () => {
        expect(Array.isArray(demoAnnotations)).toBe(true);
        expect(demoAnnotations.length).toBeGreaterThan(0);
      });

      it("has properly structured annotations", () => {
        demoAnnotations.forEach((annotation) => {
          expect(annotation).toHaveProperty("id");
          expect(annotation).toHaveProperty("content");
          expect(annotation).toHaveProperty("user");
          expect(annotation).toHaveProperty("created_at");

          expect(typeof annotation.content).toBe("string");
          expect(annotation.user).toHaveProperty("username");
          expect(typeof annotation.created_at).toBe("string");
          expect(isNaN(new Date(annotation.created_at).getTime())).toBe(false);
        });
      });
    });
  });

  describe("Demo API Mock Functionality", () => {
    let api;

    beforeEach(() => {
      api = createDemoApi();
    });

    describe("API Interface", () => {
      it("returns correct API interface", () => {
        expect(api).toHaveProperty("get");
        expect(api).toHaveProperty("post");
        expect(api).toHaveProperty("put");
        expect(api).toHaveProperty("delete");
        expect(api).toHaveProperty("getUri");

        expect(typeof api.get).toBe("function");
        expect(typeof api.post).toBe("function");
        expect(typeof api.put).toBe("function");
        expect(typeof api.delete).toBe("function");
        expect(typeof api.getUri).toBe("function");
      });

      it("getUri returns correct backend URL", () => {
        expect(api.getUri()).toBe("http://localhost:8000");
      });
    });

    describe("GET method", () => {
      it("returns empty data for unknown endpoints", async () => {
        const result = await api.get("/unknown");
        expect(result).toEqual({ data: {} });
      });

      it("returns empty data for all GET endpoints", async () => {
        const result = await api.get("/settings");
        expect(result).toHaveProperty("data");
        expect(result.data).toEqual({});
      });
    });

    describe("POST method - /render endpoint", () => {
      it("calls backend render endpoint with correct parameters", async () => {
        const mockResponse = {
          json: vi.fn().mockResolvedValue("<html>Rendered Content</html>"),
        };
        mockFetch.mockResolvedValue(mockResponse);

        await api.post("/render");

        expect(mockFetch).toHaveBeenCalledWith("http://localhost:8000/render", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: demoFile.source,
          }),
        });
      });

      it("returns rendered HTML from backend", async () => {
        const mockHtml = "<html><body>Rendered RSM Content</body></html>";
        const mockResponse = {
          json: vi.fn().mockResolvedValue(mockHtml),
        };
        mockFetch.mockResolvedValue(mockResponse);

        const result = await api.post("/render");

        expect(result.data).toBe(mockHtml);
      });

      it("handles backend render success", async () => {
        const mockHtml = "<div class='manuscriptwrapper'>Test Content</div>";
        const mockResponse = {
          json: vi.fn().mockResolvedValue(mockHtml),
        };
        mockFetch.mockResolvedValue(mockResponse);

        const result = await api.post("/render");

        expect(result).toEqual({ data: mockHtml });
        expect(mockResponse.json).toHaveBeenCalled();
      });

      it("falls back to markdown converter on network error", async () => {
        mockFetch.mockRejectedValue(new Error("Network error"));

        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        const result = await api.post("/render");

        expect(consoleSpy).toHaveBeenCalledWith("Failed to render RSM content:", expect.any(Error));
        expect(result.data).toBeDefined();
        expect(typeof result.data).toBe("string");
        expect(result.data.length).toBeGreaterThan(0);

        consoleSpy.mockRestore();
      });

      it("falls back to markdown converter on fetch failure", async () => {
        mockFetch.mockResolvedValue({
          json: vi.fn().mockRejectedValue(new Error("JSON parse error")),
        });

        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        const result = await api.post("/render");

        expect(consoleSpy).toHaveBeenCalled();
        expect(result.data).toBeDefined();
        expect(typeof result.data).toBe("string");

        consoleSpy.mockRestore();
      });

      it("returns empty data for non-render POST endpoints", async () => {
        const result = await api.post("/other-endpoint");
        expect(result).toEqual({ data: {} });
      });
    });

    describe("Other HTTP methods", () => {
      it("PUT returns empty data", async () => {
        const result = await api.put("/any-endpoint");
        expect(result).toEqual({ data: {} });
      });

      it("DELETE returns empty data", async () => {
        const result = await api.delete("/any-endpoint");
        expect(result).toEqual({ data: {} });
      });
    });
  });

  describe("RSM Content Processing", () => {
    let api;

    beforeEach(() => {
      api = createDemoApi();
    });

    it("sends correct RSM content to backend", async () => {
      const mockResponse = {
        json: vi.fn().mockResolvedValue("<html>test</html>"),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await api.post("/render");

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);

      expect(requestBody.source).toBe(demoFile.source);
      expect(requestBody.source).toMatch(/^:rsm:/);
      expect(requestBody.source).toMatch(/::$/);
    });

    it("handles complex RSM markup correctly", async () => {
      const mockResponse = {
        json: vi.fn().mockResolvedValue("<html>complex content</html>"),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await api.post("/render");

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      const rsmContent = requestBody.source;

      // Verify RSM contains expected elements
      expect(rsmContent).toContain(":abstract:");
      expect(rsmContent).toContain(":itemize:");
      expect(rsmContent).toContain(":enumerate:");
      expect(rsmContent).toContain(":item:");
    });
  });

  describe("Error Handling", () => {
    let api;

    beforeEach(() => {
      api = createDemoApi();
    });

    it("handles network timeout gracefully", async () => {
      mockFetch.mockImplementation(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 100))
      );

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await api.post("/render");

      expect(result.data).toBeDefined();
      expect(typeof result.data).toBe("string");
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("handles malformed JSON response", async () => {
      mockFetch.mockResolvedValue({
        json: vi.fn().mockRejectedValue(new SyntaxError("Unexpected token")),
      });

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await api.post("/render");

      expect(result.data).toBeDefined();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("handles server error responses", async () => {
      mockFetch.mockResolvedValue({
        json: vi.fn().mockRejectedValue(new Error("500 Internal Server Error")),
      });

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await api.post("/render");

      expect(result.data).toBeDefined();
      expect(consoleSpy).toHaveBeenCalledWith("Failed to render RSM content:", expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});
