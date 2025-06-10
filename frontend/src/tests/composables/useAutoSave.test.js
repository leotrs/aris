import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock Vue lifecycle hooks to avoid warnings when running composables outside component setup
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    onMounted: vi.fn(),
    onBeforeUnmount: vi.fn(),
  };
});

import { ref, nextTick } from 'vue';
import { useAutoSave } from '@/composables/useAutoSave.js';

describe('useAutoSave', () => {
  let mockSaveFunction;
  let mockCompileFunction;
  let mockFile;
  let consoleErrorSpy;

  beforeEach(() => {
    // Setup fake timers
    vi.useFakeTimers();

    // Reset mocks
    vi.clearAllMocks();
    vi.clearAllTimers();

    // Create mock functions
    mockSaveFunction = vi.fn().mockResolvedValue();
    mockCompileFunction = vi.fn();

    // Create mock file ref
    mockFile = ref({
      source: 'initial content'
    });

    // Spy on console.error
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    consoleErrorSpy.mockRestore();
  });

  it('should initialize with correct default values', () => {
    const { saveStatus, lastSaved } = useAutoSave({
      file: mockFile,
      saveFunction: mockSaveFunction
    });

    expect(saveStatus.value).toBe('idle');
    expect(typeof lastSaved.value).toBe('number');
    expect(lastSaved.value).toBeLessThanOrEqual(Date.now());
  });

  it('should clear previous debounce timeout on subsequent inputs', async () => {
    const { onInput } = useAutoSave({
      file: mockFile,
      saveFunction: mockSaveFunction,
      debounceTime: 1000
    });

    const mockEvent1 = { target: { value: 'content 1' } };
    const mockEvent2 = { target: { value: 'content 2' } };

    await onInput(mockEvent1);
    vi.advanceTimersByTime(500);

    await onInput(mockEvent2);
    vi.advanceTimersByTime(500);

    // Should not have called save yet (first timeout was cleared)
    expect(mockSaveFunction).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    await nextTick();

    // Should only call save once with the final content
    expect(mockSaveFunction).toHaveBeenCalledTimes(1);
    expect(mockSaveFunction).toHaveBeenCalledWith(expect.objectContaining({
      source: 'content 2'
    }));
  });

  it('should handle save errors', async () => {
    const saveError = new Error('Save failed');
    const failingSaveFunction = vi.fn().mockRejectedValue(saveError);

    const { saveStatus, manualSave } = useAutoSave({
      file: mockFile,
      saveFunction: failingSaveFunction
    });

    await manualSave();
    await nextTick();

    expect(saveStatus.value).toBe('error');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving file:', saveError);

    // Should reset to pending after 5 seconds
    vi.advanceTimersByTime(5000);
    await nextTick();

    expect(saveStatus.value).toBe('pending');
  });

  it('should not save if file has no source', async () => {
    const emptyFile = ref({ source: '' });

    const { manualSave } = useAutoSave({
      file: emptyFile,
      saveFunction: mockSaveFunction
    });

    await manualSave();
    await nextTick();

    expect(mockSaveFunction).not.toHaveBeenCalled();
  });

  it('should not save if file is null', async () => {
    const nullFile = ref(null);

    const { manualSave } = useAutoSave({
      file: nullFile,
      saveFunction: mockSaveFunction
    });

    await manualSave();
    await nextTick();

    expect(mockSaveFunction).not.toHaveBeenCalled();
  });

  it('should handle manual save and clear debounce timeout', async () => {
    const { onInput, manualSave } = useAutoSave({
      file: mockFile,
      saveFunction: mockSaveFunction,
      debounceTime: 2000
    });

    const mockEvent = { target: { value: 'manual save content' } };

    await onInput(mockEvent);

    // Manually save before debounce completes
    await manualSave();
    await nextTick();

    expect(mockSaveFunction).toHaveBeenCalledTimes(1);

    // Advance past debounce time - should not trigger another save
    vi.advanceTimersByTime(2000);
    await nextTick();

    expect(mockSaveFunction).toHaveBeenCalledTimes(1);
  });

  it('should set up auto-save interval', async () => {
    const composable = useAutoSave({
      file: mockFile,
      saveFunction: mockSaveFunction,
      autoSaveInterval: 10000
    });
    composable.startAutoSave();

    // Set status to pending to trigger auto-save
    composable.saveStatus.value = 'pending';

    // Advance by auto-save interval
    vi.advanceTimersByTime(10000);
    await nextTick();

    expect(mockSaveFunction).toHaveBeenCalled();
  });

  it('should auto-save when enough time has passed since last save', async () => {
    const composable = useAutoSave({
      file: mockFile,
      saveFunction: mockSaveFunction,
      autoSaveInterval: 5000
    });
    composable.startAutoSave();

    // Simulate old last saved time
    composable.lastSaved.value = Date.now() - 6000;

    // Advance by auto-save interval
    vi.advanceTimersByTime(5000);
    await nextTick();

    expect(mockSaveFunction).toHaveBeenCalled();
  });

  it('should work without compile function', async () => {
    const { onInput } = useAutoSave({
      file: mockFile,
      saveFunction: mockSaveFunction,
      debounceTime: 1000
    });

    const mockEvent = { target: { value: 'no compile test' } };

    await onInput(mockEvent);
    vi.advanceTimersByTime(1000);
    await nextTick();

    expect(mockSaveFunction).toHaveBeenCalled();
    // Should not throw error when compileFunction is null
  });

  it('should use custom debounce and auto-save intervals', async () => {
    const customDebounce = 3000;
    const customAutoSave = 60000;

    const { onInput } = useAutoSave({
      file: mockFile,
      saveFunction: mockSaveFunction,
      compileFunction: mockCompileFunction, // Add compile function to avoid the error
      debounceTime: customDebounce,
      autoSaveInterval: customAutoSave
    });

    const mockEvent = { target: { value: 'custom timing test' } };

    await onInput(mockEvent);

    // Should not save before custom debounce time
    vi.advanceTimersByTime(2000);
    expect(mockSaveFunction).not.toHaveBeenCalled();

    // Should save after custom debounce time
    vi.advanceTimersByTime(1000);
    await nextTick();
    expect(mockSaveFunction).toHaveBeenCalled();
  });

  it('should not change status from saved to idle if status changed', async () => {
    const { saveStatus, manualSave } = useAutoSave({
      file: mockFile,
      saveFunction: mockSaveFunction
    });

    await manualSave();
    await nextTick();

    expect(saveStatus.value).toBe('saved');

    // Change status before timeout
    saveStatus.value = 'pending';

    vi.advanceTimersByTime(3000);
    await nextTick();

    // Should remain 'pending', not change to 'idle'
    expect(saveStatus.value).toBe('pending');
  });

  it('should not change status from error to pending if status changed', async () => {
    const failingSaveFunction = vi.fn().mockRejectedValue(new Error('Test error'));

    const { saveStatus, manualSave } = useAutoSave({
      file: mockFile,
      saveFunction: failingSaveFunction
    });

    await manualSave();
    await nextTick();

    expect(saveStatus.value).toBe('error');

    // Change status before timeout
    saveStatus.value = 'saving';

    vi.advanceTimersByTime(5000);
    await nextTick();

    // Should remain 'saving', not change to 'pending'
    expect(saveStatus.value).toBe('saving');
  });
});
