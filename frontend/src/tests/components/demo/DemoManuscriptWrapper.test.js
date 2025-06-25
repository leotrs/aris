import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import DemoManuscriptWrapper from "@/components/demo/DemoManuscriptWrapper.vue";

// Mock the createDemoApi to avoid dynamic imports
vi.mock("@/views/demo/demoData.js", () => ({
  createDemoApi: () => ({
    getUri: () => "http://localhost:8000",
    get: () => Promise.resolve({ data: {} }),
    post: () => Promise.resolve({ data: {} }),
    put: () => Promise.resolve({ data: {} }),
    delete: () => Promise.resolve({ data: {} }),
  }),
}));

// Mock the Manuscript component
vi.mock("@/components/manuscript/Manuscript.vue", () => ({
  default: {
    name: "Manuscript",
    template: '<div data-testid="manuscript-mock">Manuscript Content</div>',
    props: ["htmlString", "showFooter", "settings"],
  },
}));

describe("Demo Manuscript Wrapper", () => {
  let wrapper;

  beforeEach(() => {
    // Mock global import function to prevent ESM URL errors
    const originalImport = global.import;
    global.import = vi.fn().mockImplementation((url) => {
      // Mock the specific files that the component tries to import
      if (url.includes('jquery-3.6.0.js') || 
          url.includes('tooltipster.bundle.js') ||
          url.includes('onload.js') ||
          url.includes('http://')) {
        return Promise.resolve({ 
          onload: vi.fn().mockResolvedValue(true),
          default: {},
        });
      }
      // For other imports, use original behavior or return empty module
      if (originalImport) {
        return originalImport(url);
      }
      return Promise.resolve({});
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.clearAllMocks();
    delete global.import;
  });

  const createWrapper = (props = {}) => {
    return mount(DemoManuscriptWrapper, {
      props: {
        htmlString: "<html><body>Test content</body></html>",
        keys: true,
        showFooter: false,
        settings: {},
        ...props,
      },
    });
  };

  describe("Basic Functionality", () => {
    it("renders wrapper div with correct class", async () => {
      wrapper = createWrapper();
      await nextTick();

      const wrapperDiv = wrapper.find(".manuscript-wrapper");
      expect(wrapperDiv.exists()).toBe(true);
      expect(wrapperDiv.classes()).toContain("demo-mode");
    });

    it("renders Manuscript component when htmlString is provided", async () => {
      wrapper = createWrapper({
        htmlString: "<html><body>Test content</body></html>",
      });
      await nextTick();

      const manuscript = wrapper.find('[data-testid="manuscript-mock"]');
      expect(manuscript.exists()).toBe(true);
    });

    it("does not render Manuscript component when htmlString is empty", async () => {
      wrapper = createWrapper({
        htmlString: "",
      });
      await nextTick();

      const manuscript = wrapper.find('[data-testid="manuscript-mock"]');
      expect(manuscript.exists()).toBe(false);
    });

    it("does not render Manuscript component when htmlString is null", async () => {
      wrapper = createWrapper({
        htmlString: null,
      });
      await nextTick();

      const manuscript = wrapper.find('[data-testid="manuscript-mock"]');
      expect(manuscript.exists()).toBe(false);
    });

    it("does not render Manuscript component when htmlString is undefined", async () => {
      wrapper = createWrapper({
        htmlString: undefined,
      });
      await nextTick();

      const manuscript = wrapper.find('[data-testid="manuscript-mock"]');
      expect(manuscript.exists()).toBe(false);
    });
  });

  describe("Props Handling", () => {
    it("passes htmlString prop correctly to Manuscript component", async () => {
      const testHtml = "<html><body><h1>Test Title</h1><p>Test content</p></body></html>";

      wrapper = createWrapper({
        htmlString: testHtml,
      });
      await nextTick();

      const manuscript = wrapper.findComponent({ name: "Manuscript" });
      expect(manuscript.props("htmlString")).toBe(testHtml);
    });

    it("passes showFooter prop correctly to Manuscript component", async () => {
      wrapper = createWrapper({
        showFooter: true,
      });
      await nextTick();

      const manuscript = wrapper.findComponent({ name: "Manuscript" });
      expect(manuscript.props("showFooter")).toBe(true);
    });

    it("passes showFooter as false by default", async () => {
      wrapper = createWrapper();
      await nextTick();

      const manuscript = wrapper.findComponent({ name: "Manuscript" });
      expect(manuscript.props("showFooter")).toBe(false);
    });

    it("passes settings prop correctly to Manuscript component", async () => {
      const testSettings = {
        fontSize: "18px",
        lineHeight: "1.6",
        fontFamily: "Georgia",
        background: "#f0f0f0",
        marginWidth: "20px",
      };

      wrapper = createWrapper({
        settings: testSettings,
      });
      await nextTick();

      const manuscript = wrapper.findComponent({ name: "Manuscript" });
      expect(manuscript.props("settings")).toEqual(testSettings);
    });

    it("handles empty settings object", async () => {
      wrapper = createWrapper({
        settings: {},
      });
      await nextTick();

      const manuscript = wrapper.findComponent({ name: "Manuscript" });
      expect(manuscript.props("settings")).toEqual({});
    });
  });

  describe("Event Handling", () => {
    it("emits mounted-at event with correct element after mount", async () => {
      wrapper = createWrapper();
      await nextTick();

      // Wait for nextTick to ensure the mounted-at event is emitted
      await new Promise((resolve) => setTimeout(resolve, 0));

      const emitted = wrapper.emitted("mounted-at");
      expect(emitted).toBeTruthy();
      expect(emitted[0]).toBeTruthy();
      expect(emitted[0][0]).toBeInstanceOf(HTMLElement);
    });

    it("does not emit mounted-at event when htmlString is empty", async () => {
      wrapper = createWrapper({
        htmlString: "",
      });
      await nextTick();

      // Wait a bit to ensure no event is emitted
      await new Promise((resolve) => setTimeout(resolve, 10));

      const emitted = wrapper.emitted("mounted-at");
      expect(emitted).toBeFalsy();
    });

    it("emits mounted-at event with the wrapper element", async () => {
      wrapper = createWrapper();
      await nextTick();

      // Wait for the emission
      await new Promise((resolve) => setTimeout(resolve, 0));

      const emitted = wrapper.emitted("mounted-at");
      const emittedElement = emitted[0][0];
      const wrapperElement = wrapper.find(".manuscript-wrapper").element;

      expect(emittedElement).toBe(wrapperElement);
    });
  });

  describe("Required Props", () => {
    it("requires htmlString prop", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Mount without required htmlString prop
      wrapper = mount(DemoManuscriptWrapper, {
        props: {
          keys: true,
        },
      });

      // Vue should warn about missing required prop
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("requires keys prop", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Mount without required keys prop
      wrapper = mount(DemoManuscriptWrapper, {
        props: {
          htmlString: "<html>test</html>",
        },
      });

      // Vue should warn about missing required prop
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("Component Structure", () => {
    it("has correct component structure", async () => {
      wrapper = createWrapper();
      await nextTick();

      // Check wrapper div
      const wrapperDiv = wrapper.find(".manuscript-wrapper.demo-mode");
      expect(wrapperDiv.exists()).toBe(true);

      // Check Manuscript component is inside wrapper
      const manuscript = wrapperDiv.find('[data-testid="manuscript-mock"]');
      expect(manuscript.exists()).toBe(true);
    });

    it("applies demo-mode class to wrapper", async () => {
      wrapper = createWrapper();
      await nextTick();

      const wrapperDiv = wrapper.find(".manuscript-wrapper");
      expect(wrapperDiv.classes()).toContain("demo-mode");
    });
  });

  describe("Edge Cases", () => {
    it("handles complex HTML content", async () => {
      const complexHtml = `
        <html>
          <body>
            <div class="manuscriptwrapper">
              <div class="manuscript">
                <h1>Complex Title</h1>
                <p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
                <ul>
                  <li>List item 1</li>
                  <li>List item 2</li>
                </ul>
                <code>Code snippet</code>
                <blockquote>Quote text</blockquote>
              </div>
            </div>
          </body>
        </html>
      `;

      wrapper = createWrapper({
        htmlString: complexHtml,
      });
      await nextTick();

      const manuscript = wrapper.findComponent({ name: "Manuscript" });
      expect(manuscript.props("htmlString")).toBe(complexHtml);
    });

    it("handles very long HTML content", async () => {
      const longContent = "Very long content ".repeat(1000);
      const longHtml = `<html><body><p>${longContent}</p></body></html>`;

      wrapper = createWrapper({
        htmlString: longHtml,
      });
      await nextTick();

      const manuscript = wrapper.findComponent({ name: "Manuscript" });
      expect(manuscript.props("htmlString")).toBe(longHtml);
    });

    it("handles special characters in HTML content", async () => {
      const specialCharsHtml = `
        <html>
          <body>
            <p>Special chars: &amp; &lt; &gt; &quot; &#39;</p>
            <p>Unicode: ñ é ü 中文 🎉</p>
          </body>
        </html>
      `;

      wrapper = createWrapper({
        htmlString: specialCharsHtml,
      });
      await nextTick();

      const manuscript = wrapper.findComponent({ name: "Manuscript" });
      expect(manuscript.props("htmlString")).toBe(specialCharsHtml);
    });
  });
});
