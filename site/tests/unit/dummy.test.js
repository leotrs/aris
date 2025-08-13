/**
 * Dummy test to prevent vitest from exiting with code 1 when no test files exist
 */
import { describe, it, expect } from 'vitest'

describe('Site Unit Tests', () => {
  it('should pass dummy test', () => {
    expect(true).toBe(true)
  })
})