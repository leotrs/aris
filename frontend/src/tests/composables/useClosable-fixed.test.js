import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";

// Import the actual composables
import {
  useKeyboardShortcuts,
  getActiveComponents,
  getRegisteredComponents,
} from "@/composables/useKeyboardShortcuts.js";
import useClosable from "@/composables/useClosable.js";

describe("useClosable fixed integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should reuse existing keyboard controller instead of creating duplicate", async () => {
    console.log("=== Testing Fixed useClosable Integration ===");

    const FixedModalComponent = defineComponent({
      setup() {
        const emit = vi.fn();

        console.log("Creating keyboard controller with override...");
        // Create the keyboard controller first
        const keyboardController = useKeyboardShortcuts({}, true, "Modal", true);

        console.log("Adding useClosable with existing controller...");
        // Pass the controller to useClosable
        useClosable({
          onClose: () => emit("close"),
          closeOnEsc: true,
          keyboardController, // This should reuse the existing controller
        });

        return { keyboardController };
      },
      template: '<div role="dialog">Fixed Modal</div>',
    });

    const initialActiveCount = getActiveComponents().length;
    const initialRegisteredCount = Object.keys(getRegisteredComponents()).length;
    console.log("Initial active components:", initialActiveCount);
    console.log("Initial registered components:", initialRegisteredCount);

    mount(FixedModalComponent);

    const finalActiveCount = getActiveComponents().length;
    const finalRegisteredCount = Object.keys(getRegisteredComponents()).length;
    console.log("Final active components:", finalActiveCount);
    console.log("Final registered components:", finalRegisteredCount);

    const activeIncrease = finalActiveCount - initialActiveCount;
    const registeredIncrease = finalRegisteredCount - initialRegisteredCount;

    console.log("Active component increase:", activeIncrease);
    console.log("Registered component increase:", registeredIncrease);

    if (registeredIncrease === 1 && activeIncrease === 1) {
      console.log("✅ PASS: Only one component registration created");
      console.log("useClosable successfully reused existing keyboard controller");
    } else {
      console.log("❌ FAIL: Multiple registrations created");
    }

    // Should only create one registration
    expect(registeredIncrease).toBe(1);
    expect(activeIncrease).toBe(1);
  });

  it("should still work when no existing controller is provided", () => {
    console.log("\n=== Testing useClosable without existing controller ===");

    const StandardComponent = defineComponent({
      setup() {
        const emit = vi.fn();

        console.log("Using useClosable without existing controller...");
        useClosable({
          onClose: () => emit("close"),
          closeOnEsc: true,
          // No keyboardController provided
        });

        return {};
      },
      template: "<div>Standard Component</div>",
    });

    const initialCount = getActiveComponents().length;
    mount(StandardComponent);
    const finalCount = getActiveComponents().length;

    console.log("Component increase:", finalCount - initialCount);
    expect(finalCount - initialCount).toBe(1);
  });

  it("should verify escape shortcut is added to existing controller", () => {
    console.log("\n=== Testing escape shortcut integration ===");

    const TestComponent = defineComponent({
      setup() {
        const emit = vi.fn();

        // Create controller with initial shortcuts
        const keyboardController = useKeyboardShortcuts(
          {
            a: () => console.log("A pressed"),
          },
          true,
          "TestComponent",
          false
        );

        // Add useClosable with escape
        useClosable({
          onClose: () => emit("close"),
          closeOnEsc: true,
          keyboardController,
        });

        return { keyboardController };
      },
      template: "<div>Test Component</div>",
    });

    const wrapper = mount(TestComponent);
    const shortcuts = wrapper.vm.keyboardController.getShortcuts();

    console.log("Registered shortcuts:", Object.keys(shortcuts));

    // Should have both 'a' and 'escape' shortcuts
    expect(shortcuts).toHaveProperty("a");
    expect(shortcuts).toHaveProperty("escape");

    console.log("✅ Both original and escape shortcuts are registered");
  });
});

console.log("Running useClosable fixed integration test...");
console.log("This test verifies the fix for duplicate component registrations");
