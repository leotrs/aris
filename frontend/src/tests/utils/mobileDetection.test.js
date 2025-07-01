import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isMobileDevice, isTouchDevice, getEnhancedMobileMode } from "@/utils/mobileDetection.js";

describe("Mobile Detection Utils", () => {
  let originalUserAgent;
  let originalOntouchstart;
  let originalMaxTouchPoints;

  beforeEach(() => {
    // Store original values
    originalUserAgent = navigator.userAgent;
    originalOntouchstart = window.ontouchstart;
    originalMaxTouchPoints = navigator.maxTouchPoints;
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(navigator, "userAgent", {
      value: originalUserAgent,
      configurable: true,
    });
    if (originalOntouchstart !== undefined) {
      window.ontouchstart = originalOntouchstart;
    } else {
      delete window.ontouchstart;
    }
    Object.defineProperty(navigator, "maxTouchPoints", {
      value: originalMaxTouchPoints,
      configurable: true,
    });
  });

  describe("isMobileDevice", () => {
    it("should detect iPhone user agents", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15",
        configurable: true,
      });

      expect(isMobileDevice()).toBe(true);
    });

    it("should detect iPad user agents", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15",
        configurable: true,
      });

      expect(isMobileDevice()).toBe(true);
    });

    it("should detect Android user agents", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36",
        configurable: true,
      });

      expect(isMobileDevice()).toBe(true);
    });

    it("should detect BlackBerry user agents", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (BlackBerry; CPU BlackBerry OS 7.1.0) AppleWebKit/534.11",
        configurable: true,
      });

      expect(isMobileDevice()).toBe(true);
    });

    it("should detect Opera Mini user agents", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Opera/9.80 (J2ME/MIDP; Opera Mini/9.80) Presto/2.23.129",
        configurable: true,
      });

      expect(isMobileDevice()).toBe(true);
    });

    it("should return false for Chrome desktop user agents", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        configurable: true,
      });

      expect(isMobileDevice()).toBe(false);
    });

    it("should return false for Firefox desktop user agents", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
        configurable: true,
      });

      expect(isMobileDevice()).toBe(false);
    });

    it("should return false for Safari desktop user agents", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
        configurable: true,
      });

      expect(isMobileDevice()).toBe(false);
    });
  });

  describe("isTouchDevice", () => {
    it("should detect touch capability via ontouchstart", () => {
      // Add ontouchstart property to window
      window.ontouchstart = null;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 0,
        configurable: true,
      });

      expect(isTouchDevice()).toBe(true);
    });

    it("should detect touch via navigator.maxTouchPoints > 0", () => {
      // Remove ontouchstart and set maxTouchPoints
      delete window.ontouchstart;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 5,
        configurable: true,
      });

      expect(isTouchDevice()).toBe(true);
    });

    it("should detect touch via both ontouchstart and maxTouchPoints", () => {
      window.ontouchstart = null;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 10,
        configurable: true,
      });

      expect(isTouchDevice()).toBe(true);
    });

    it("should return false for non-touch devices", () => {
      // Remove touch indicators
      delete window.ontouchstart;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 0,
        configurable: true,
      });

      expect(isTouchDevice()).toBe(false);
    });

    it("should return false when maxTouchPoints is undefined", () => {
      delete window.ontouchstart;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: undefined,
        configurable: true,
      });

      expect(isTouchDevice()).toBe(false);
    });
  });

  describe("getEnhancedMobileMode", () => {
    it("should return false for desktop with narrow viewport (no mobile device, no touch)", () => {
      // Mock desktop environment
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0",
        configurable: true,
      });
      delete window.ontouchstart;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 0,
        configurable: true,
      });

      const isSmallViewport = true; // Narrow viewport
      expect(getEnhancedMobileMode(isSmallViewport)).toBe(false);
    });

    it("should return true for mobile device with small viewport", () => {
      // Mock mobile environment
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15",
        configurable: true,
      });
      window.ontouchstart = null;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 5,
        configurable: true,
      });

      const isSmallViewport = true; // Small viewport
      expect(getEnhancedMobileMode(isSmallViewport)).toBe(true);
    });

    it("should return false for mobile device with large viewport (tablet landscape)", () => {
      // Mock mobile environment
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15",
        configurable: true,
      });
      window.ontouchstart = null;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 5,
        configurable: true,
      });

      const isSmallViewport = false; // Large viewport
      expect(getEnhancedMobileMode(isSmallViewport)).toBe(false);
    });

    it("should return true for touch device with small viewport (touch laptop)", () => {
      // Mock touch laptop environment
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0",
        configurable: true,
      });
      window.ontouchstart = null;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 10,
        configurable: true,
      });

      const isSmallViewport = true; // Small viewport
      expect(getEnhancedMobileMode(isSmallViewport)).toBe(true);
    });

    it("should return false for touch device with large viewport", () => {
      // Mock touch laptop environment
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0",
        configurable: true,
      });
      window.ontouchstart = null;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 10,
        configurable: true,
      });

      const isSmallViewport = false; // Large viewport
      expect(getEnhancedMobileMode(isSmallViewport)).toBe(false);
    });

    it("should return false when viewport is large regardless of mobile/touch capabilities", () => {
      // Mock mobile environment but large viewport
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15",
        configurable: true,
      });
      window.ontouchstart = null;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 5,
        configurable: true,
      });

      const isSmallViewport = false; // Large viewport should override mobile detection
      expect(getEnhancedMobileMode(isSmallViewport)).toBe(false);
    });
  });
});
