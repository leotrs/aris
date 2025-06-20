import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { useFloatingUI } from "@/composables/useFloatingUI.js";

// Mock @floating-ui/vue
vi.mock("@floating-ui/vue", () => ({
  useFloating: vi.fn(),
  offset: vi.fn(() => "offset-middleware"),
  flip: vi.fn(() => "flip-middleware"),
  shift: vi.fn(() => "shift-middleware"),
  autoUpdate: vi.fn(() => "auto-update-fn"),
}));

describe("useFloatingUI composable", () => {
  let mockUseFloating;
  let referenceRef;
  let floatingRef;

  beforeEach(async () => {
    const { useFloating } = await vi.importMock("@floating-ui/vue");
    mockUseFloating = useFloating;
    mockUseFloating.mockReturnValue({
      floatingStyles: ref("transform: translate(10px, 20px)"),
      placement: ref("bottom"),
      update: vi.fn(),
    });

    referenceRef = ref(null);
    floatingRef = ref(null);
  });

  it("should provide default floating UI configuration", () => {
    useFloatingUI(referenceRef, floatingRef);

    expect(mockUseFloating).toHaveBeenCalledWith(
      referenceRef,
      floatingRef,
      expect.objectContaining({
        middleware: expect.arrayContaining([
          "offset-middleware",
          "flip-middleware",
          "shift-middleware",
        ]),
        placement: "bottom",
        strategy: "fixed",
        whileElementsMounted: expect.any(Function),
      })
    );
  });

  it("should allow custom placement override", () => {
    useFloatingUI(referenceRef, floatingRef, { placement: "top" });

    expect(mockUseFloating).toHaveBeenCalledWith(
      referenceRef,
      floatingRef,
      expect.objectContaining({
        placement: "top",
      })
    );
  });

  it("should allow custom middleware configuration", () => {
    const customMiddleware = ["custom-middleware"];
    useFloatingUI(referenceRef, floatingRef, { middleware: customMiddleware });

    expect(mockUseFloating).toHaveBeenCalledWith(
      referenceRef,
      floatingRef,
      expect.objectContaining({
        middleware: expect.arrayContaining([
          "offset-middleware",
          "flip-middleware",
          "shift-middleware",
          "custom-middleware",
        ]),
      })
    );
  });

  it("should allow custom offset configuration", async () => {
    useFloatingUI(referenceRef, floatingRef, { offset: 8 });

    const { offset } = await vi.importMock("@floating-ui/vue");
    expect(offset).toHaveBeenCalledWith(8);
  });

  it("should return floating styles and placement from useFloating", () => {
    const result = useFloatingUI(referenceRef, floatingRef);

    expect(result.floatingStyles.value).toBe("transform: translate(10px, 20px)");
    expect(result.placement.value).toBe("bottom");
  });

  it("should allow strategy override", () => {
    useFloatingUI(referenceRef, floatingRef, { strategy: "absolute" });

    expect(mockUseFloating).toHaveBeenCalledWith(
      referenceRef,
      floatingRef,
      expect.objectContaining({
        strategy: "absolute",
      })
    );
  });

  it("should preserve additional options passed", () => {
    const customOptions = {
      transform: false,
      open: ref(true),
    };

    useFloatingUI(referenceRef, floatingRef, customOptions);

    expect(mockUseFloating).toHaveBeenCalledWith(
      referenceRef,
      floatingRef,
      expect.objectContaining({
        transform: false,
        open: customOptions.open,
      })
    );
  });
});
