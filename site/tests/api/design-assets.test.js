import { describe, it, expect, beforeAll } from "vitest";
import axios from "axios";

// Backend URL for testing
const BACKEND_URL = "http://localhost:8001";

describe("Design Assets API Integration", () => {
  let backendAvailable = false;

  beforeAll(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/health`);
      backendAvailable = response.status === 200;
    } catch (error) {
      console.warn("Backend not available for design assets integration tests");
      backendAvailable = false;
    }
  });

  describe("Logo Assets", () => {
    it("should serve small logo from design assets endpoint", async () => {
      if (!backendAvailable) {
        console.warn("Skipping test - backend not available");
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/design-assets/logos/logo-32px.svg`);
      
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/image\/svg/);
      expect(response.data).toContain("<svg");
      expect(response.data).toContain("</svg>");
    });

    it("should serve gray logo from design assets endpoint", async () => {
      if (!backendAvailable) {
        console.warn("Skipping test - backend not available");
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/design-assets/logos/logo-32px-gray.svg`);
      
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/image\/svg/);
      expect(response.data).toContain("<svg");
      expect(response.data).toContain("</svg>");
    });

    it("should serve full logotype from design assets endpoint", async () => {
      if (!backendAvailable) {
        console.warn("Skipping test - backend not available");
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/design-assets/logos/logotype.svg`);
      
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/image\/svg/);
      expect(response.data).toContain("<svg");
      expect(response.data).toContain("</svg>");
    });
  });

  describe("CSS Assets", () => {
    it("should serve typography CSS from design assets endpoint", async () => {
      if (!backendAvailable) {
        console.warn("Skipping test - backend not available");
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/design-assets/css/typography.css`);
      
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/text\/css/);
      expect(response.data).toContain("font-family");
    });

    it("should serve components CSS from design assets endpoint", async () => {
      if (!backendAvailable) {
        console.warn("Skipping test - backend not available");
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/design-assets/css/components.css`);
      
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/text\/css/);
    });

    it("should serve layout CSS from design assets endpoint", async () => {
      if (!backendAvailable) {
        console.warn("Skipping test - backend not available");
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/design-assets/css/layout.css`);
      
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/text\/css/);
    });

    it("should serve variables CSS from design assets endpoint", async () => {
      if (!backendAvailable) {
        console.warn("Skipping test - backend not available");
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/design-assets/css/variables.css`);
      
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/text\/css/);
      expect(response.data).toContain("--");
    });
  });

  describe("Error Handling", () => {
    it("should return 404 for non-existent design asset", async () => {
      if (!backendAvailable) {
        console.warn("Skipping test - backend not available");
        return;
      }

      try {
        await axios.get(`${BACKEND_URL}/design-assets/logos/non-existent.svg`);
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    it("should return 404 for non-existent CSS file", async () => {
      if (!backendAvailable) {
        console.warn("Skipping test - backend not available");
        return;
      }

      try {
        await axios.get(`${BACKEND_URL}/design-assets/css/non-existent.css`);
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });
  });
});