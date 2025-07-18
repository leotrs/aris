import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchPublicationData,
  createPublicationApi,
  createPublicationFileStore,
  createPublicationUser,
  createPublicationAnnotations,
} from "@/views/ication/publicationData.js";
import { File } from "@/models/File.js";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Ication Data Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("createPublicationApi", () => {
    it("returns correct API interface", () => {
      const api = createPublicationApi();

      expect(api).toHaveProperty("get");
      expect(api).toHaveProperty("post");
      expect(api).toHaveProperty("getUri");
      expect(api).toHaveProperty("defaults");

      expect(typeof api.get).toBe("function");
      expect(typeof api.post).toBe("function");
      expect(typeof api.getUri).toBe("function");
    });

    it("getUri returns correct backend URL", () => {
      const api = createPublicationApi();
      expect(api.getUri()).toBe(import.meta.env.VITE_API_BASE_URL);
    });

    it("defaults has correct structure", () => {
      const api = createPublicationApi();
      expect(api.defaults).toHaveProperty("baseURL");
      expect(api.defaults).toHaveProperty("headers");
      expect(api.defaults.baseURL).toBe(import.meta.env.VITE_API_BASE_URL);
    });
  });

  describe("API Methods", () => {
    let api;

    beforeEach(() => {
      api = createPublicationApi();
    });

    describe("GET method", () => {
      it("makes correct GET request", async () => {
        const mockResponse = { test: "data" };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: vi.fn().mockResolvedValue(mockResponse),
        });

        const result = await api.get("/test");

        expect(mockFetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_BASE_URL}/test`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        expect(result).toEqual({ data: mockResponse });
      });

      it("handles 404 errors correctly", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: "Not Found",
        });

        await expect(api.get("/nonexistent")).rejects.toThrow("HTTP 404: Not Found");
      });

      it("handles network errors correctly", async () => {
        mockFetch.mockRejectedValueOnce(new Error("Network error"));

        await expect(api.get("/test")).rejects.toThrow("Network error");
      });
    });

    describe("POST method", () => {
      it("makes correct POST request", async () => {
        const mockResponse = { rendered: "html" };
        const payload = { source: ":rsm: test ::" };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: vi.fn().mockResolvedValue(mockResponse),
        });

        const result = await api.post("/render", payload);

        expect(mockFetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_BASE_URL}/render`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        expect(result).toEqual({ data: mockResponse });
      });

      it("handles POST errors correctly", async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        });

        await expect(api.post("/render", {})).rejects.toThrow("HTTP 500: Internal Server Error");
      });
    });
  });

  describe("fetchPublicationData", () => {
    beforeEach(() => {
      // Reset any state before each test
    });

    it("successfully fetches and converts preprint data", async () => {
      const mockPreprintData = {
        id: 123,
        title: "Test Preprint",
        source: ":rsm: test content ::",
        last_edited_at: "2023-01-01T00:00:00Z",
        published_at: "2023-01-02T00:00:00Z",
        public_uuid: "abc123",
        permalink_slug: "test-preprint",
        abstract: "Test abstract",
        keywords: ["test", "preprint"],
        authors: "Test Author",
        version: 1,
        citation_info: { apa: "Test Citation" },
        tags: [{ id: 1, name: "test", color: "#ff0000" }],
        settings: {
          background: "#ffffff",
          fontSize: "18px",
          fontFamily: "'Source Sans 3', sans-serif",
          lineHeight: "1.6",
          marginWidth: "64px",
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockPreprintData),
      });

      const result = await fetchPublicationData("abc123");

      expect(mockFetch).toHaveBeenCalledWith(`${import.meta.env.VITE_API_BASE_URL}/ication/abc123`);

      expect(result).toHaveProperty("file");
      expect(result).toHaveProperty("metadata");
      expect(result.file).toEqual(
        expect.objectContaining({
          id: 123,
          title: "Test Preprint",
          source: ":rsm: test content ::",
        })
      );
      expect(result.metadata).toEqual(mockPreprintData);
      expect(result.file.id).toBe(123);
      expect(result.file.title).toBe("Test Preprint");
    });

    it("handles 404 errors for non-existent preprints", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(fetchPublicationData("nonexistent")).rejects.toThrow("HTTP 404: Not Found");
    });

    it("uses default settings when none provided", async () => {
      const mockPreprintData = {
        id: 123,
        title: "Test Preprint",
        source: ":rsm: test content ::",
        last_edited_at: "2023-01-01T00:00:00Z",
        published_at: "2023-01-02T00:00:00Z",
        public_uuid: "abc123",
        permalink_slug: "test-preprint",
        abstract: "Test abstract",
        keywords: ["test", "preprint"],
        authors: "Test Author",
        version: 1,
        citation_info: { apa: "Test Citation" },
        tags: null,
        settings: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockPreprintData),
      });

      const result = await fetchPublicationData("abc123");

      expect(result.file.tags).toEqual([]);
      expect(result.file._settings).toEqual({
        background: "#ffffff",
        fontSize: "18px",
        fontFamily: "'Source Sans 3', sans-serif",
        lineHeight: "1.6",
        marginWidth: "64px",
      });
    });
  });

  describe("createPublicationFileStore", () => {
    it("creates file store with correct structure", () => {
      const mockFile = new File({
        id: 123,
        title: "Test File",
        source: ":rsm: test ::",
        tags: [{ id: 1, name: "test", color: "#ff0000" }],
      });

      const fileStore = createPublicationFileStore(mockFile);

      expect(fileStore).toHaveProperty("files");
      expect(fileStore).toHaveProperty("tags");
      expect(fileStore).toHaveProperty("isLoading");
      expect(fileStore).toHaveProperty("error");
      expect(fileStore).toHaveProperty("queueSync");
      expect(fileStore).toHaveProperty("loadFiles");
      expect(fileStore).toHaveProperty("loadTags");

      expect(fileStore.files).toEqual([mockFile]);
      expect(fileStore.tags).toEqual(mockFile.tags);
      expect(fileStore.isLoading).toBe(false);
      expect(fileStore.error).toBe(undefined);
      expect(typeof fileStore.queueSync).toBe("function");
      expect(typeof fileStore.loadFiles).toBe("function");
      expect(typeof fileStore.loadTags).toBe("function");
    });

    it("handles files without tags", () => {
      const mockFile = new File({
        id: 123,
        title: "Test File",
        source: ":rsm: test ::",
        tags: null,
      });

      const fileStore = createPublicationFileStore(mockFile);

      expect(fileStore.tags).toEqual([]);
    });

    it("store methods return promises", async () => {
      const mockFile = new File({
        id: 123,
        title: "Test File",
        source: ":rsm: test ::",
      });

      const fileStore = createPublicationFileStore(mockFile);

      await expect(fileStore.queueSync()).resolves.toBeUndefined();
      await expect(fileStore.loadFiles()).resolves.toBeUndefined();
      await expect(fileStore.loadTags()).resolves.toBeUndefined();
    });
  });

  describe("createPublicationUser", () => {
    it("creates anonymous user with correct structure", () => {
      const user = createPublicationUser();

      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("firstName");
      expect(user).toHaveProperty("lastName");

      expect(user.id).toBe(null);
      expect(user.username).toBe("anonymous");
      expect(user.email).toBe(null);
      expect(user.firstName).toBe("Anonymous");
      expect(user.lastName).toBe("User");
    });
  });

  describe("createPublicationAnnotations", () => {
    it("creates empty annotations array", () => {
      const annotations = createPublicationAnnotations();

      expect(Array.isArray(annotations)).toBe(true);
      expect(annotations.length).toBe(0);
    });
  });
});
