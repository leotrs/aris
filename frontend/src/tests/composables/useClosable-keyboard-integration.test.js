import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";

// Import the actual composables (don't mock them)
import {
  useKeyboardShortcuts,
  getActiveComponents,
  getRegisteredComponents,
} from "@/composables/useKeyboardShortcuts.js";
import useClosable from "@/composables/useClosable.js";

describe("useClosable keyboard integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add shortcuts to existing component instead of creating duplicate", async () => {
    console.log("=== Testing useClosable Duplicate Component Bug ===");

    // Create a component that uses both useKeyboardShortcuts and useClosable
    const TestComponent = defineComponent({
      setup() {
        const onClose = vi.fn();

        // First, register keyboard shortcuts (like Modal.vue does)
        const keyboardController = useKeyboardShortcuts(
          {
            a: () => console.log("A pressed"),
          },
          true,
          "TestComponent",
          true
        );

        // Then use useClosable (which internally calls useKeyboardShortcuts again)
        useClosable({
          onClose,
          closeOnEsc: true,
          autoActivate: true,
        });

        return { onClose, keyboardController };
      },
      template: "<div>Test Component</div>",
    });

    console.log("Step 1: Check initial component count");
    const initialComponentCount = getActiveComponents().length;
    console.log("Initial active components:", initialComponentCount);

    console.log("Step 2: Mount component with both useKeyboardShortcuts and useClosable");
    const wrapper = mount(TestComponent);

    console.log("Step 3: Check component count after mounting");
    const afterMountCount = getActiveComponents().length;
    console.log("Active components after mount:", afterMountCount);

    const componentIncrease = afterMountCount - initialComponentCount;
    console.log("Component count increase:", componentIncrease);

    if (componentIncrease > 1) {
      console.log("❌ BUG CONFIRMED: useClosable created duplicate component entries");
      console.log("Expected: 1 component registered");
      console.log("Actual:", componentIncrease, "components registered");
    } else {
      console.log("✅ PASS: Only one component registered");
    }

    // The test should pass when the bug is fixed
    expect(componentIncrease).toBe(1);

    // Cleanup
    wrapper.unmount();
  });

  it("should replicate exact Modal.vue scenario", () => {
    console.log("\n=== Modal.vue Scenario ===");

    const ModalComponent = defineComponent({
      setup() {
        const emit = vi.fn();

        console.log("Modal: Registering override keyboard shortcuts...");
        // This is exactly what Modal.vue does
        useKeyboardShortcuts(
          {
            escape: () => emit("close"),
          },
          true,
          "Modal",
          true
        );

        console.log("Modal: Adding useClosable...");
        useClosable({
          onClose: () => emit("close"),
          closeOnEsc: false, // We disabled this in our fix
          closeOnOutsideClick: true,
          closeOnCloseButton: true,
          autoActivate: true,
        });

        return {};
      },
      template: '<div role="dialog">Modal</div>',
    });

    const initialCount = getActiveComponents().length;
    console.log("Initial components:", initialCount);

    mount(ModalComponent);

    const finalCount = getActiveComponents().length;
    console.log("Final components:", finalCount);
    console.log("Increase:", finalCount - initialCount);

    console.log("Modal scenario creates", finalCount - initialCount, "component entries");
  });

  it("should test the original problematic scenario with detailed logging", () => {
    console.log("\n=== Original Problematic Scenario with Details ===");

    const ModalComponent = defineComponent({
      setup() {
        const emit = vi.fn();

        console.log("Modal: Registering override shortcuts (empty)...");
        // Original problematic approach
        const controller1 = useKeyboardShortcuts({}, true, "Modal", true);

        console.log("Modal: Adding useClosable with ESC enabled...");
        useClosable({
          onClose: () => emit("close"),
          closeOnEsc: true, // This creates a SECOND component entry
          closeOnOutsideClick: true,
          closeOnCloseButton: true,
          autoActivate: true,
        });

        return { controller1 };
      },
      template: '<div role="dialog">Modal</div>',
    });

    const initialActiveCount = getActiveComponents().length;
    const initialRegisteredCount = Object.keys(getRegisteredComponents()).length;
    console.log("Initial active components:", initialActiveCount);
    console.log("Initial registered components:", initialRegisteredCount);

    mount(ModalComponent);

    const finalActiveCount = getActiveComponents().length;
    const finalRegisteredCount = Object.keys(getRegisteredComponents()).length;
    console.log("Final active components:", finalActiveCount);
    console.log("Final registered components:", finalRegisteredCount);

    const activeIncrease = finalActiveCount - initialActiveCount;
    const registeredIncrease = finalRegisteredCount - initialRegisteredCount;

    console.log("Active component increase:", activeIncrease);
    console.log("Registered component increase:", registeredIncrease);

    if (registeredIncrease > 1) {
      console.log("❌ BUG CONFIRMED: Multiple component registrations created");
      console.log("This means useClosable is creating a separate keyboard shortcuts instance");
    } else if (activeIncrease > 1) {
      console.log("❌ BUG CONFIRMED: Multiple active components created");
    } else {
      console.log("✅ Only one component entry created");
    }

    // Log the actual registered components to see what's happening
    const registeredComponents = getRegisteredComponents();
    console.log("Registered component IDs:", Object.keys(registeredComponents));

    // The bug is that we get multiple registered components
    expect(registeredIncrease).toBe(1);
  });
});

console.log("Running useClosable keyboard integration test...");
console.log("This test exposes the bug where useClosable creates duplicate component entries");
