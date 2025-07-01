import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ref, computed } from "vue";
import { useEnhancedMobileMode } from "@/composables/useEnhancedMobileMode.js";

describe("useEnhancedMobileMode", () => {
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

  describe("Initialization", () => {
    it("should return a computed ref", () => {
      const isSmallViewport = ref(false);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode).toBeDefined();
      expect(mobileMode.value).toBeDefined();
      expect(typeof mobileMode.value).toBe("boolean");
    });

    it("should accept a computed ref as parameter", () => {
      const viewportWidth = ref(800);
      const isSmallViewport = computed(() => viewportWidth.value <= 640);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBe(false);
    });

    it("should accept a reactive ref as parameter", () => {
      const isSmallViewport = ref(true);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBeDefined();
    });
  });

  describe("Desktop Environment", () => {
    beforeEach(() => {
      // Mock desktop environment (no mobile UA, no touch)
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0",
        configurable: true,
      });
      delete window.ontouchstart;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 0,
        configurable: true,
      });
    });

    it("should return false for desktop with large viewport", () => {
      const isSmallViewport = ref(false);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBe(false);
    });

    it("should return false for desktop with small viewport (narrow browser window)", () => {
      const isSmallViewport = ref(true);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBe(false);
    });

    it("should react to viewport changes", () => {
      const isSmallViewport = ref(false);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBe(false);

      // Change viewport to small
      isSmallViewport.value = true;
      expect(mobileMode.value).toBe(false); // Still false for desktop

      // Change back to large
      isSmallViewport.value = false;
      expect(mobileMode.value).toBe(false);
    });
  });

  describe("Mobile Device Environment", () => {
    beforeEach(() => {
      // Mock mobile environment (iPhone with touch)
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15",
        configurable: true,
      });
      window.ontouchstart = null;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 5,
        configurable: true,
      });
    });

    it("should return true for mobile device with small viewport", () => {
      const isSmallViewport = ref(true);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBe(true);
    });

    it("should return false for mobile device with large viewport", () => {
      const isSmallViewport = ref(false);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBe(false);
    });

    it("should react to viewport changes", () => {
      const isSmallViewport = ref(false);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBe(false);

      // Change viewport to small
      isSmallViewport.value = true;
      expect(mobileMode.value).toBe(true);

      // Change back to large
      isSmallViewport.value = false;
      expect(mobileMode.value).toBe(false);
    });
  });

  describe("Touch Device Environment", () => {
    beforeEach(() => {
      // Mock touch laptop (Windows with touch support)
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0",
        configurable: true,
      });
      window.ontouchstart = null;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 10,
        configurable: true,
      });
    });

    it("should return true for touch device with small viewport", () => {
      const isSmallViewport = ref(true);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBe(true);
    });

    it("should return false for touch device with large viewport", () => {
      const isSmallViewport = ref(false);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBe(false);
    });
  });

  describe("Android Environment", () => {
    beforeEach(() => {
      // Mock Android device
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36",
        configurable: true,
      });
      window.ontouchstart = null;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 5,
        configurable: true,
      });
    });

    it("should return true for Android device with small viewport", () => {
      const isSmallViewport = ref(true);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBe(true);
    });

    it("should return false for Android device with large viewport", () => {
      const isSmallViewport = ref(false);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBe(false);
    });
  });

  describe("Tablet Environment", () => {
    beforeEach(() => {
      // Mock iPad
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15",
        configurable: true,
      });
      window.ontouchstart = null;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 5,
        configurable: true,
      });
    });

    it("should return true for tablet with small viewport (portrait mode)", () => {
      const isSmallViewport = ref(true);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBe(true);
    });

    it("should return false for tablet with large viewport (landscape mode)", () => {
      const isSmallViewport = ref(false);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined navigator properties gracefully", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: "",
        configurable: true,
      });
      delete window.ontouchstart;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: undefined,
        configurable: true,
      });

      const isSmallViewport = ref(true);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBe(false);
    });

    it("should handle null userAgent gracefully", () => {
      Object.defineProperty(navigator, "userAgent", {
        value: null,
        configurable: true,
      });
      delete window.ontouchstart;
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 0,
        configurable: true,
      });

      const isSmallViewport = ref(true);
      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBe(false);
    });

    it("should work with reactive computed properties", () => {
      const viewportWidth = ref(800);
      const isSmallViewport = computed(() => viewportWidth.value <= 640);

      // Mock mobile environment
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15",
        configurable: true,
      });
      window.ontouchstart = null;

      const mobileMode = useEnhancedMobileMode(isSmallViewport);

      expect(mobileMode.value).toBe(false); // Large viewport

      // Resize to mobile viewport
      viewportWidth.value = 375;
      expect(mobileMode.value).toBe(true); // Now mobile

      // Resize back to desktop viewport
      viewportWidth.value = 1200;
      expect(mobileMode.value).toBe(false); // Back to desktop
    });
  });
});
