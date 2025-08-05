/**
 * Vitest setup file for unit tests
 */

import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mock Nuxt runtime config
global.useRuntimeConfig = vi.fn(() => ({
  public: {
    backendUrl: "http://localhost:8000",
  },
}));

// Mock $fetch function
global.$fetch = vi.fn();

// Mock window.innerWidth for responsive tests
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

// Mock process.client for client-side checks
global.process = {
  ...global.process,
  client: true,
};
