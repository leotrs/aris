// Demo data service providing hard-coded content for the demo workspace

export const demoFile = {
  id: 999,
  title: "Sample Research Paper: The Future of Web-Native Publishing",
  source: `:rsm:
# The Future of Web-Native Publishing

:abstract:

  This paper explores the revolutionary potential of web-native scientific publishing platforms in transforming how research is disseminated, consumed, and validated. We examine the limitations of traditional PDF-based publishing and propose a new paradigm that leverages modern web technologies to create interactive, accessible, and dynamic research documents.

::

## Introduction

The current landscape of scientific publishing relies heavily on static document formats that were designed for print media. While PDFs have served the academic community for decades, they present significant limitations in our increasingly digital world\\:

:itemize:

  :item: *Limited interactivity*\\: Static content cannot adapt to user preferences or provide dynamic visualizations

  :item: *Accessibility barriers*\\: Poor screen reader support and fixed layouts

  :item: *Version control issues*\\: Difficulty tracking changes and updates

  :item: *Discovery challenges*\\: Content locked in non-searchable formats

::

### Research Questions

This study addresses three primary research questions\\:

:enumerate:

  :item: How can web-native technologies improve research accessibility and engagement?

  :item: What are the key technical requirements for a modern publishing platform?

  :item: How might interactive documents change the peer review process?

::

## Methodology

Our research employed a mixed-methods methodology approach combining\\:

:itemize:

  :item: Literature review of existing publishing platforms

  :item: Technical analysis of web standards and capabilities

  :item: User interviews with researchers and publishers

  :item: Prototype development and testing

::

### Technical Implementation

We developed a proof-of-concept platform using\\:

:itemize:

  :item: **Frontend**\\: Vue.js with reactive state management

  :item: **Backend**\\: FastAPI with PostgreSQL database

  :item: **Document Format**\\: RSM (Readable Research Markup)

  :item: **Deployment**\\: Docker containers on cloud infrastructure

::

## Results

Our findings demonstrate significant advantages of web-native publishing across multiple dimensions. The methodology validation confirmed our hypothesis that web-native platforms provide superior accessibility and engagement compared to traditional PDF-based systems.

## Discussion

The transition to web-native publishing represents more than a technological upgrade—it's a fundamental shift toward more inclusive and accessible research communication.

### Key Benefits

:enumerate:

  :item: *Enhanced Accessibility*\\: Screen readers, keyboard navigation, and customizable display options

  :item: *Dynamic Content*\\: Interactive figures, embedded data, and real-time updates

  :item: *Better Discovery*\\: Full-text search, semantic markup, and linked data

  :item: *Collaborative Features*\\: Inline comments, annotations, and version tracking

::

## Future Work

This research opens several avenues for future investigation\\:

Development of authoring tools for non-technical researchers. Integration with existing
manuscript submission systems. Analysis of impact on citation patterns and research
discovery. Exploration of multimedia content integration (videos, interactive
simulations).

## Conclusion

Web-native scientific publishing represents a paradigm shift that can address many limitations of current publishing models. While technical and adoption challenges exist, the potential benefits for accessibility, engagement, and scientific communication are substantial.

The future of research dissemination lies not in replicating print formats digitally, but in embracing the unique capabilities of web technologies to create more inclusive, interactive, and impactful scholarly communication.

## Acknowledgments

We thank the research participants who provided valuable feedback and the open-source community whose tools made this work possible.

*This is a demonstration document showcasing the capabilities of web-native research publishing. The content is fictional but representative of actual research papers.*

::`,
  last_edited_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  tags: [
    { id: 1, name: "publishing", color: "#3b82f6" },
    { id: 2, name: "web-technology", color: "#10b981" },
    { id: 3, name: "research", color: "#f59e0b" },
  ],
  minimap: null,
  ownerId: 1,
  _settings: {
    background: "#ffffff",
    fontSize: "18px",
    fontFamily: "'Source Sans 3', sans-serif",
    lineHeight: "1.6",
    marginWidth: "64px",
  },
  selected: false,
  filtered: false,
  isMountedAt: null,
  html: null, // Will be generated from source
};

export const demoUser = {
  id: 1,
  username: "demo_user",
  email: "demo@example.com",
  firstName: "Demo",
  lastName: "User",
};

export const demoFileStore = {
  files: [demoFile],
  tags: [
    { id: 1, name: "publishing", color: "#3b82f6", created_at: "2024-01-01T00:00:00Z" },
    { id: 2, name: "web-technology", color: "#10b981", created_at: "2024-01-02T00:00:00Z" },
    { id: 3, name: "research", color: "#f59e0b", created_at: "2024-01-03T00:00:00Z" },
  ],
  isLoading: false,
  error: undefined,
  queueSync: () => Promise.resolve(),
  loadFiles: () => Promise.resolve(),
  loadTags: () => Promise.resolve(),
};

export const demoAnnotations = [
  {
    id: 1,
    type: "comment",
    content: "This is an excellent point about accessibility barriers in traditional publishing.",
    user: demoUser,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    type: "note",
    content: "Consider adding more details about the technical implementation here.",
    user: demoUser,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock API that returns demo data
export const createDemoApi = () => ({
  get: async (url) => {
    // Add support for file content endpoint
    if (url && url.includes("/files/") && url.includes("/content")) {
      return Promise.resolve({ data: demoFile.html || "" });
    }
    return Promise.resolve({ data: {} });
  },
  post: async (url, payload) => {
    if (url.includes("/render")) {
      // Detect environment: only use real backend in E2E tests, not unit tests
      const isE2ETest =
        typeof window !== "undefined" &&
        (window.location?.href?.includes("/demo") ||
          globalThis.playwright ||
          (process.env.NODE_ENV === "test" && process.env.VITEST !== "true"));

      // For unit tests, return mock HTML to avoid network calls
      if (!isE2ETest) {
        console.log(`[DEBUG-DEMO] Unit test detected, returning mock HTML`);
        return {
          data: `<div class="manuscript">
            <h1>The Future of Web-Native Publishing</h1>
            <div class="abstract">
              <p>This paper explores the revolutionary potential of web-native scientific publishing...</p>
            </div>
            <h2>Introduction</h2>
            <p>The current landscape of scientific publishing relies heavily on static document formats...</p>
          </div>`,
        };
      }

      // Use the actual backend /render endpoint for RSM content in E2E tests
      const startTime = Date.now();
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/render`;
      const sourceData = payload?.source || demoFile.source;

      console.log(`[DEBUG-DEMO] RENDER REQUEST STARTING: ${new Date().toISOString()}`);
      console.log(`[DEBUG-DEMO] API URL: ${apiUrl}`);
      console.log(`[DEBUG-DEMO] Source length: ${sourceData.length} chars`);
      console.log(`[DEBUG-DEMO] Source preview: ${sourceData.substring(0, 100)}...`);
      console.log(`[DEBUG-DEMO] User agent: ${navigator.userAgent}`);

      try {
        console.log(`[DEBUG-DEMO] Making fetch request...`);
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: sourceData,
          }),
        });

        const fetchTime = Date.now() - startTime;
        console.log(`[DEBUG-DEMO] Fetch completed in ${fetchTime}ms`);
        console.log(`[DEBUG-DEMO] Response status: ${response.status} ${response.statusText}`);
        console.log(`[DEBUG-DEMO] Response ok: ${response.ok}`);
        console.log(`[DEBUG-DEMO] Response headers:`, Object.fromEntries(response.headers));

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[DEBUG-DEMO] Response not ok - body: ${errorText}`);
          throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }

        console.log(`[DEBUG-DEMO] Parsing response as JSON...`);
        const html = await response.json();
        const totalTime = Date.now() - startTime;

        console.log(`[DEBUG-DEMO] RENDER REQUEST SUCCESSFUL in ${totalTime}ms`);
        console.log(
          `[DEBUG-DEMO] Response length: ${typeof html === "string" ? html.length : JSON.stringify(html).length} chars`
        );
        console.log(
          `[DEBUG-DEMO] Response preview: ${typeof html === "string" ? html.substring(0, 100) : JSON.stringify(html).substring(0, 100)}...`
        );

        return { data: html };
      } catch (error) {
        const totalTime = Date.now() - startTime;
        console.error(`[DEBUG-DEMO] RENDER REQUEST FAILED after ${totalTime}ms:`, error);
        console.error(`[DEBUG-DEMO] Error name: ${error.name}`);
        console.error(`[DEBUG-DEMO] Error message: ${error.message}`);
        console.error(`[DEBUG-DEMO] Error stack:`, error.stack);

        // Return empty HTML - the /render endpoint MUST work in production
        return { data: "" };
      }
    }
    if (url.includes("/settings")) {
      return Promise.resolve({
        data: demoFile._settings,
      });
    }
    return Promise.resolve({ data: {} });
  },
  put: () => Promise.resolve({ data: {} }),
  delete: () => Promise.resolve({ data: {} }),
  // Return the backend URI for static assets
  getUri: () => import.meta.env.VITE_API_BASE_URL,
  // Mirror axios instance interface - components depend on defaults.baseURL and defaults.headers
  defaults: {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      common: {},
    },
  },
});
