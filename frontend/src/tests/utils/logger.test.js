import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getLogger } from "@/utils/logger.js";

describe("Logger", () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = {
      debug: vi.spyOn(console, "debug").mockImplementation(() => {}),
      info: vi.spyOn(console, "info").mockImplementation(() => {}),
      warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
      error: vi.spyOn(console, "error").mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates logger with module name", () => {
    const logger = getLogger("TestModule");
    expect(logger).toBeDefined();
    expect(logger.module).toBe("TestModule");
  });

  it("logs info messages with structured format", () => {
    const logger = getLogger("TestModule");
    logger.setLogLevel(0); // DEBUG level to ensure all logs are output
    logger.info("Test message", { key: "value" });

    expect(consoleSpy.info).toHaveBeenCalledOnce();
    const logCall = consoleSpy.info.mock.calls[0][0];
    expect(logCall).toContain("INFO");
    expect(logCall).toContain("TestModule");
    expect(logCall).toContain("Test message");
    expect(logCall).toContain('{"key":"value"}');
  });

  it("logs errors with structured format", () => {
    const logger = getLogger("TestModule");
    logger.error("Error occurred", { error: "test error" });

    expect(consoleSpy.error).toHaveBeenCalledOnce();
    const logCall = consoleSpy.error.mock.calls[0][0];
    expect(logCall).toContain("ERROR");
    expect(logCall).toContain("TestModule");
    expect(logCall).toContain("Error occurred");
  });

  it("logs API errors with structured data", () => {
    const logger = getLogger("TestModule");
    const mockError = {
      message: "Network Error",
      response: {
        status: 500,
        statusText: "Internal Server Error",
      },
    };

    logger.apiError("/api/test", mockError);

    expect(consoleSpy.error).toHaveBeenCalledOnce();
    const logCall = consoleSpy.error.mock.calls[0][0];
    expect(logCall).toContain("API request failed");
    expect(logCall).toContain("/api/test");
    expect(logCall).toContain("500");
  });

  it("logs performance metrics", () => {
    const logger = getLogger("TestModule");
    logger.setLogLevel(0); // DEBUG level to ensure all logs are output
    logger.performance("test operation", 123.45, { detail: "info" });

    expect(consoleSpy.debug).toHaveBeenCalledOnce();
    const logCall = consoleSpy.debug.mock.calls[0][0];
    expect(logCall).toContain("Performance: test operation took 123.45ms");
    expect(logCall).toContain('"detail":"info"');
  });

  it("logs user actions", () => {
    const logger = getLogger("TestModule");
    logger.setLogLevel(0); // DEBUG level to ensure all logs are output
    logger.userAction("button click", { buttonId: "save" });

    expect(consoleSpy.info).toHaveBeenCalledOnce();
    const logCall = consoleSpy.info.mock.calls[0][0];
    expect(logCall).toContain("User action: button click");
    expect(logCall).toContain('"buttonId":"save"');
  });

  it("formats timestamp correctly", () => {
    const logger = getLogger("TestModule");
    logger.setLogLevel(0); // DEBUG level to ensure all logs are output
    logger.info("Test message");

    const logCall = consoleSpy.info.mock.calls[0][0];
    // Should contain ISO timestamp format (YYYY-MM-DD HH:mm:ss)
    expect(logCall).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
  });
});
