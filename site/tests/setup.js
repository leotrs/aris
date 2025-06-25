import { vi } from 'vitest'

// Mock Nuxt composables
global.defineNuxtConfig = vi.fn()
global.useRuntimeConfig = vi.fn(() => ({
  public: {
    apiBase: 'http://localhost:8000'
  }
}))

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}