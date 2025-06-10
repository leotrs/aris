import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Vue composition API functions
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    getCurrentInstance: vi.fn(),
    onMounted: vi.fn((cb) => {
      if (typeof cb === 'function') cb();
    }),
    onBeforeUnmount: vi.fn(),
  };
});

describe('useKeyboardShortcuts', () => {
  let useKeyboardShortcuts;
  let getActiveComponents;
  let getRegisteredComponents;
  let getComponentMetadata;
  let registerAsFallback;
  let getCurrentInstance;
  let onMounted;
  let onBeforeUnmount;

  beforeEach(async () => {
    vi.resetModules();
    // Stub window event listeners before importing module
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();

    const vue = await import('vue');
    getCurrentInstance = vue.getCurrentInstance;
    onMounted = vue.onMounted;
    onBeforeUnmount = vue.onBeforeUnmount;

    // Provide a fake component instance
    getCurrentInstance.mockReturnValue({
      uid: 42,
      type: { name: 'TestComponent' },
      proxy: { $options: { name: 'TestComponent' } },
    });

    // Reset mock call counts before loading the module
    vi.clearAllMocks();

    ({ useKeyboardShortcuts,
       getActiveComponents,
       getRegisteredComponents,
       getComponentMetadata,
       registerAsFallback } = await import('@/composables/useKeyboardShortcuts.js'));
  });

  it('provides the expected composable API', () => {
    const api = useKeyboardShortcuts({}, false, 'TestComponent');
    expect(api).toEqual(expect.objectContaining({
      activate: expect.any(Function),
      deactivate: expect.any(Function),
      isRegistered: expect.any(Function),
      addShortcuts: expect.any(Function),
      removeShortcuts: expect.any(Function),
      getShortcuts: expect.any(Function),
    }));
  });

  it('activates automatically when autoActivate is true', () => {
    const { isRegistered } = useKeyboardShortcuts({}, true, 'TestComponent');
    expect(isRegistered()).toBe(true);
  });

  it('does not activate automatically when autoActivate is false', () => {
    const { isRegistered } = useKeyboardShortcuts({}, false, 'TestComponent');
    expect(isRegistered()).toBe(false);
  });

  it('always calls onBeforeUnmount', () => {
    useKeyboardShortcuts({}, false, 'TestComponent');
    expect(onBeforeUnmount).toHaveBeenCalledTimes(1);
  });

  it('errors when used outside of setup', () => {
    getCurrentInstance.mockReturnValue(null);
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const api = useKeyboardShortcuts({}, true);
    expect(spy).toHaveBeenCalledWith('useKeyboardShortcuts must be used within setup()');
    expect(api).toEqual({});
    spy.mockRestore();
  });

  it('normalizes shortcuts and warns for invalid entries', () => {
    const fnA = function myAction() {};
    const fnB = () => {};
    const objC = { fn: () => {}, description: 'desc' };
    const spyWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { getShortcuts } = useKeyboardShortcuts({ A: fnA, B: fnB, C: objC, D: null }, false, 'TestComponent');
    const shortcuts = getShortcuts();
    expect(shortcuts.A).toEqual({ fn: fnA, description: 'myAction' });
    expect(shortcuts.B).toEqual({ fn: fnB, description: fnB.name });
    expect(shortcuts.C).toEqual(objC);
    expect(shortcuts.D).toEqual({ fn: expect.any(Function), description: 'Invalid shortcut' });
    expect(spyWarn).toHaveBeenCalled();
    spyWarn.mockRestore();
  });

  it('registers shortcuts and metadata correctly', () => {
    const fn = () => {};
    useKeyboardShortcuts({ x: fn }, false, 'MyCompName');
    const regs = getRegisteredComponents();
    expect(regs['42'].x.fn).toBe(fn);
    const meta = getComponentMetadata();
    expect(meta['42']).toEqual({ name: 'MyCompName' });
  });

  it('activate, deactivate and isRegistered manipulate active components', () => {
    const { activate, deactivate, isRegistered } = useKeyboardShortcuts({}, false, 'TestComponent');
    expect(isRegistered()).toBe(false);
    activate();
    expect(isRegistered()).toBe(true);
    expect(getActiveComponents().map(c => c.uid)).toContain(42);
    deactivate();
    expect(isRegistered()).toBe(false);
    expect(getActiveComponents()).toHaveLength(0);
  });

  it('addShortcuts and removeShortcuts update the registered shortcuts', () => {
    const fn1 = () => {};
    const fn2 = () => {};
    const { getShortcuts, addShortcuts, removeShortcuts } = useKeyboardShortcuts({ A: fn1 }, false, 'TestComponent');
    expect(getShortcuts()).toHaveProperty('A');
    addShortcuts({ B: fn2 });
    expect(getShortcuts()).toHaveProperty('B');
    removeShortcuts(['A']);
    expect(getShortcuts()).not.toHaveProperty('A');
    removeShortcuts();
    expect(getShortcuts()).toEqual({});
  });

  it('handles single-key shortcuts via keydown events', () => {
    const fn = vi.fn();
    useKeyboardShortcuts({ a: fn }, true, 'TestComponent');
    const calls = window.addEventListener.mock.calls.filter(c => c[0] === 'keydown');
    expect(calls).toHaveLength(1);
    const handler = calls[0][1];
    const event = new KeyboardEvent('keydown', { key: 'a' });
    Object.defineProperty(event, 'target', { value: document.body, configurable: true });
    handler(event);
    expect(fn).toHaveBeenCalled();
  });

  it('dispatches sequence shortcuts when keys pressed in order', () => {
    const fn = vi.fn();
    useKeyboardShortcuts({ 'a,b': fn }, true, 'TestComponent');
    const [[, handler]] = window.addEventListener.mock.calls.filter(c => c[0] === 'keydown');
    const eventA = new KeyboardEvent('keydown', { key: 'a' });
    Object.defineProperty(eventA, 'target', { value: document.body, configurable: true });
    handler(eventA);
    const eventB = new KeyboardEvent('keydown', { key: 'b' });
    Object.defineProperty(eventB, 'target', { value: document.body, configurable: true });
    handler(eventB);
    expect(fn).toHaveBeenCalled();
  });

});