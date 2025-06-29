import { config } from '@vue/test-utils';

config.global.stubs = {
  Teleport: true,
  RouterLink: true,
  RouterView: true,
  Transition: true,
  TransitionGroup: true,
};

// Silence all Vue warning messages in tests (missing components/injections, etc.)
config.global.config.warnHandler = () => {};

// Suppress console.log and console.debug during unit tests to reduce noise
// Keep console.error and console.warn for important messages
const originalConsoleLog = console.log;
const originalConsoleDebug = console.debug;
const originalConsoleWarn = console.warn;

console.log = () => {};
console.debug = () => {};

// Suppress specific Vue warnings that are noisy in tests
console.warn = (message, ...args) => {
  // Filter out Suspense experimental feature warnings
  if (typeof message === 'string' && message.includes('<Suspense> is an experimental feature')) {
    return;
  }
  // Filter out router injection warnings from tests
  if (typeof message === 'string' && message.includes('injection "Symbol(router)" not found')) {
    return;
  }
  // Call original warn for other messages
  originalConsoleWarn(message, ...args);
};

// Optional: restore console methods in case tests need them explicitly
// @ts-ignore
global.originalConsoleLog = originalConsoleLog;
// @ts-ignore  
global.originalConsoleDebug = originalConsoleDebug;
// @ts-ignore
global.originalConsoleWarn = originalConsoleWarn;