import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';

// Stub useElementSize and useTemplateRef from @vueuse/core
const widthRef = ref(200);
const heightRef = ref(400);
vi.mock('@vueuse/core', () => ({
  useElementSize: () => ({ width: widthRef, height: heightRef }),
  useTemplateRef: () => ({ value: {} }),
}));

// Stub MinimapUtils functions
vi.mock('@/utils/MinimapUtils.js', () => ({
  makeMinimap: vi.fn(),
  resizeMinimap: vi.fn(),
  highlightScrollPos: vi.fn(),
  makeIcons: vi.fn().mockResolvedValue([]),
}));
import { makeMinimap } from '@/utils/MinimapUtils.js';
import Minimap from '@/components/Minimap.vue';

// Helper to flush pending promise callbacks (microtasks)
const flushPromises = () => Promise.resolve();

describe('Minimap.vue - immediate and debounced rebuild', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    makeMinimap.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('executes makeMinimap immediately and again after debounce', async () => {
    makeMinimap
      .mockResolvedValueOnce({ svg: '<svg>1</svg>', svgInitialData: { a: 1 } })
      .mockResolvedValueOnce({ svg: '<svg>2</svg>', svgInitialData: { a: 2 } });

    const file = { id: 1, isMountedAt: true, html: '<p/>', icons: [] };
    const wrapper = mount(Minimap, {
      props: { file },
      global: {
        stubs: [
          'Tooltip',
          'IconBookmarkFilled',
          'IconStarFilled',
          'IconHeartFilled',
          'IconCircleCheckFilled',
          'IconAlertTriangleFilled',
          'IconHelpSquareRoundedFilled',
          'IconQuoteFilled',
        ],
      },
    });

    // Leading run on mount
    await vi.advanceTimersByTimeAsync(0);
    await flushPromises();
    expect(makeMinimap).toHaveBeenCalledTimes(1);
    expect(wrapper.html()).toContain('<svg>1</svg>');

    // Trailing run after debounce interval
    await vi.advanceTimersByTimeAsync(100);
    await flushPromises();
    expect(makeMinimap).toHaveBeenCalledTimes(2);
    expect(wrapper.html()).toContain('<svg>2</svg>');
  });

  it('cancels previous trailing run when props change before debounce', async () => {
    makeMinimap
      .mockResolvedValueOnce({ svg: '<svg>A</svg>', svgInitialData: {} })
      .mockResolvedValueOnce({ svg: '<svg>B</svg>', svgInitialData: {} })
      .mockResolvedValueOnce({ svg: '<svg>C</svg>', svgInitialData: {} });

    const file1 = { id: 1, isMountedAt: true, html: '<p/>', icons: [] };
    const wrapper = mount(Minimap, {
      props: { file: file1 },
      global: {
        stubs: [
          'Tooltip',
          'IconBookmarkFilled',
          'IconStarFilled',
          'IconHeartFilled',
          'IconCircleCheckFilled',
          'IconAlertTriangleFilled',
          'IconHelpSquareRoundedFilled',
          'IconQuoteFilled',
        ],
      },
    });

    // Initial run on mount
    await vi.advanceTimersByTimeAsync(0);
    await flushPromises();
    expect(makeMinimap).toHaveBeenCalledTimes(1);

    // Change props to cancel previous trailing and trigger new immediate run
    await wrapper.setProps({ file: { id: 2, isMountedAt: true, html: '<p/>', icons: [] } });
    await flushPromises();
    expect(makeMinimap).toHaveBeenCalledTimes(2);

    // Only one trailing run after debounce
    await vi.advanceTimersByTimeAsync(100);
    await flushPromises();
    expect(makeMinimap).toHaveBeenCalledTimes(3);
  });
});