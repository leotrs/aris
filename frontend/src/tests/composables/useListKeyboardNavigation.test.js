import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Vue composition API functions, but keep ref, watch, nextTick
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    getCurrentInstance: vi.fn(),
    onMounted: vi.fn(cb => { if (typeof cb === 'function') cb(); }),
    onBeforeUnmount: vi.fn(),
  };
});

describe('useListKeyboardNavigation', () => {
  let useListKeyboardNavigation;
  let getCurrentInstance;
  let onBeforeUnmount;
  let ref;
  let nextTick;

  beforeEach(async () => {
    vi.resetModules();
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();

    const vue = await import('vue');
    getCurrentInstance = vue.getCurrentInstance;
    onBeforeUnmount = vue.onBeforeUnmount;
    ref = vue.ref;
    nextTick = vue.nextTick;

    getCurrentInstance.mockReturnValue({
      uid: 42,
      type: { name: 'TestComponent' },
      proxy: { $options: { name: 'TestComponent' } },
    });
    vi.clearAllMocks();

    ({ useListKeyboardNavigation } = await import('@/composables/useListKeyboardNavigation.js'));
  });

  it('provides the expected composable API', () => {
    const listLengthRef = ref(0);
    const rootElementRef = ref(null);
    const api = useListKeyboardNavigation(listLengthRef, rootElementRef, false, false);
    expect(api).toEqual(expect.objectContaining({
      activeIndex: expect.any(Object),
      nextItem: expect.any(Function),
      prevItem: expect.any(Function),
      clearSelection: expect.any(Function),
      activate: expect.any(Function),
      deactivate: expect.any(Function),
    }));
  });

  it('always calls onBeforeUnmount hook from useKeyboardShortcuts', () => {
    const listLengthRef = ref(1);
    const rootElementRef = ref(null);
    useListKeyboardNavigation(listLengthRef, rootElementRef, false, false);
    expect(onBeforeUnmount).toHaveBeenCalledTimes(1);
  });

  it('warns on invalid list length in nextItem', () => {
    const listLengthRef = ref(0);
    const rootElementRef = ref(null);
    const { nextItem, activeIndex } = useListKeyboardNavigation(listLengthRef, rootElementRef, false, false);
    const ev = { preventDefault: vi.fn() };
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    nextItem(ev);
    expect(ev.preventDefault).toHaveBeenCalled();
    expect(activeIndex.value).toBe(null);
    expect(warnSpy).toHaveBeenCalledWith('List length is invalid:', 0);
    warnSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('cycles nextItem correctly', () => {
    const listLengthRef = ref(3);
    const rootElementRef = ref(null);
    const { nextItem, activeIndex } = useListKeyboardNavigation(listLengthRef, rootElementRef, false, false);
    const ev = { preventDefault: vi.fn() };
    expect(activeIndex.value).toBe(null);
    nextItem(ev);
    expect(activeIndex.value).toBe(0);
    nextItem(ev);
    expect(activeIndex.value).toBe(1);
    nextItem(ev);
    expect(activeIndex.value).toBe(2);
    nextItem(ev);
    expect(activeIndex.value).toBe(0);
  });

  it('cycles prevItem correctly', () => {
    const listLengthRef = ref(3);
    const rootElementRef = ref(null);
    const { prevItem, activeIndex } = useListKeyboardNavigation(listLengthRef, rootElementRef, false, false);
    const ev = { preventDefault: vi.fn() };
    expect(activeIndex.value).toBe(null);
    prevItem(ev);
    expect(activeIndex.value).toBe(0);
    prevItem(ev);
    expect(activeIndex.value).toBe(2);
    prevItem(ev);
    expect(activeIndex.value).toBe(1);
  });

  it('clears selection correctly', () => {
    const listLengthRef = ref(3);
    const rootElementRef = ref(null);
    const { nextItem, clearSelection, activeIndex } = useListKeyboardNavigation(listLengthRef, rootElementRef, false, false);
    const ev1 = { preventDefault: vi.fn() };
    nextItem(ev1);
    expect(activeIndex.value).toBe(0);
    const ev2 = { preventDefault: vi.fn() };
    clearSelection(ev2);
    expect(ev2.preventDefault).toHaveBeenCalled();
    expect(activeIndex.value).toBe(null);
    expect(() => clearSelection()).not.toThrow();
    expect(activeIndex.value).toBe(null);
  });

  it('scrolls active item into view on activeIndex change', async () => {
    const listLengthRef = ref(3);
    const container = document.createElement('div');
    container.innerHTML = '<div class="item">A</div><div class="item">B</div><div class="item">C</div>';
    const rootElementRef = ref(container);
    const { nextItem } = useListKeyboardNavigation(listLengthRef, rootElementRef, false, false);
    const items = Array.from(container.querySelectorAll('.item'));
    items.forEach(el => { el.scrollIntoView = vi.fn(); });
    const ev = { preventDefault: vi.fn() };
    nextItem(ev);
    await nextTick();
    await nextTick();
    expect(items[0].scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    nextItem(ev);
    await nextTick();
    await nextTick();
    expect(items[1].scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('handles keyboard events to navigate list', () => {
    const listLengthRef = ref(3);
    const rootElementRef = ref(document.createElement('div'));
    const { activeIndex } = useListKeyboardNavigation(listLengthRef, rootElementRef, true, true);
    const call = window.addEventListener.mock.calls.find(c => c[0] === 'keydown');
    expect(call).toBeTruthy();
    const handler = call[1];
    const eventJ = new KeyboardEvent('keydown', { key: 'j' });
    Object.defineProperty(eventJ, 'target', { value: document.body, configurable: true });
    handler(eventJ);
    expect(activeIndex.value).toBe(0);
    const eventDown = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    Object.defineProperty(eventDown, 'target', { value: document.body, configurable: true });
    handler(eventDown);
    expect(activeIndex.value).toBe(1);
    const eventUp = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    Object.defineProperty(eventUp, 'target', { value: document.body, configurable: true });
    handler(eventUp);
    expect(activeIndex.value).toBe(0);
  });

  it('clears selection on Escape when useEscape is true', () => {
    const listLengthRef = ref(2);
    const rootElementRef = ref(document.createElement('div'));
    const { activeIndex } = useListKeyboardNavigation(listLengthRef, rootElementRef, true, true);
    const call = window.addEventListener.mock.calls.find(c => c[0] === 'keydown');
    const handler = call[1];
    const eventJ = new KeyboardEvent('keydown', { key: 'j' });
    Object.defineProperty(eventJ, 'target', { value: document.body, configurable: true });
    handler(eventJ);
    expect(activeIndex.value).toBe(0);
    const eventEsc = new KeyboardEvent('keydown', { key: 'Escape' });
    Object.defineProperty(eventEsc, 'target', { value: document.body, configurable: true });
    handler(eventEsc);
    expect(activeIndex.value).toBe(null);
  });

  it('does not clear selection on Escape when useEscape is false', () => {
    const listLengthRef = ref(2);
    const rootElementRef = ref(document.createElement('div'));
    const { activeIndex } = useListKeyboardNavigation(listLengthRef, rootElementRef, false, true);
    const call = window.addEventListener.mock.calls.find(c => c[0] === 'keydown');
    const handler = call[1];
    const eventJ = new KeyboardEvent('keydown', { key: 'j' });
    Object.defineProperty(eventJ, 'target', { value: document.body, configurable: true });
    handler(eventJ);
    expect(activeIndex.value).toBe(0);
    const eventEsc = new KeyboardEvent('keydown', { key: 'Escape' });
    Object.defineProperty(eventEsc, 'target', { value: document.body, configurable: true });
    handler(eventEsc);
    expect(activeIndex.value).toBe(0);
  });

  it('does not handle key events until activated when autoActivate is false', () => {
    const listLengthRef = ref(3);
    const rootElementRef = ref(document.createElement('div'));
    const { activeIndex, activate } = useListKeyboardNavigation(listLengthRef, rootElementRef, false, false);
    const call = window.addEventListener.mock.calls.find(c => c[0] === 'keydown');
    const handler = call[1];
    const eventJ = new KeyboardEvent('keydown', { key: 'j' });
    Object.defineProperty(eventJ, 'target', { value: document.body, configurable: true });
    handler(eventJ);
    expect(activeIndex.value).toBe(null);
    activate();
    handler(eventJ);
    expect(activeIndex.value).toBe(0);
  });
});
