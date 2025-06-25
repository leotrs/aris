import { vi } from "vitest";

// Mock Nuxt composables
global.defineNuxtConfig = vi.fn();
global.useRuntimeConfig = vi.fn(() => ({
  public: {
    apiBase: "http://localhost:8000",
  },
}));

// Mock Nuxt router composables
global.useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
}));

global.useRoute = vi.fn(() => ({
  path: "/",
  params: {},
  query: {},
  hash: "",
  name: "index",
}));

global.navigateTo = vi.fn();

// Mock Nuxt Image component
global.NuxtImg = {
  name: "NuxtImg",
  template: "<img />",
  props: ["src", "alt", "width", "height"],
};

// Mock Nuxt Link component
global.NuxtLink = {
  name: "NuxtLink",
  template: "<a><slot /></a>",
  props: ["to", "href"],
};

// Mock process.env for testing
global.process = {
  env: {
    NODE_ENV: "test",
  },
};

// Mock window.location and navigation to prevent JSDOM warnings
Object.defineProperty(window, "location", {
  writable: true,
  value: {
    href: "http://localhost:3000",
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
});

// Mock navigation API that JSDOM doesn't implement
global.HTMLAnchorElement.prototype.click = vi.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
