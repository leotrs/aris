// Demo data service providing hard-coded content for the demo workspace

export const demoFile = {
  id: 999,
  title: "Sample Research Paper: The Future of Web-Native Publishing",
  source: `# The Future of Web-Native Publishing
  
## Abstract

This paper explores the revolutionary potential of web-native scientific publishing platforms in transforming how research is disseminated, consumed, and validated. We examine the limitations of traditional PDF-based publishing and propose a new paradigm that leverages modern web technologies to create interactive, accessible, and dynamic research documents.

## Introduction

The current landscape of scientific publishing relies heavily on static document formats that were designed for print media. While PDFs have served the academic community for decades, they present significant limitations in our increasingly digital world:

- **Limited interactivity**: Static content cannot adapt to user preferences or provide dynamic visualizations
- **Accessibility barriers**: Poor screen reader support and fixed layouts
- **Version control issues**: Difficulty tracking changes and updates
- **Discovery challenges**: Content locked in non-searchable formats

### Research Questions

This study addresses three primary research questions:

1. How can web-native technologies improve research accessibility and engagement?
2. What are the key technical requirements for a modern publishing platform?
3. How might interactive documents change the peer review process?

## Methodology

Our research employed a mixed-methods approach combining:

- Literature review of existing publishing platforms
- Technical analysis of web standards and capabilities  
- User interviews with researchers and publishers
- Prototype development and testing

### Technical Implementation

We developed a proof-of-concept platform using:

- **Frontend**: Vue.js with reactive state management
- **Backend**: FastAPI with PostgreSQL database
- **Document Format**: RSM (Readable Research Markup)
- **Deployment**: Docker containers on cloud infrastructure

## Results

Our findings demonstrate significant advantages of web-native publishing:

### Performance Metrics

| Metric | PDF | Web-Native | Improvement |
|--------|-----|------------|-------------|
| Load Time | 3.2s | 1.1s | 66% faster |
| Accessibility Score | 45/100 | 94/100 | 109% better |
| Mobile Usability | Poor | Excellent | Qualitative |

### User Feedback

Participants reported improved reading experiences:

> "The ability to adjust font size and margins made reading much more comfortable. I could finally read research papers on my phone during commutes." - Researcher A

> "Interactive figures and embedded data visualizations helped me understand complex concepts much faster than static images." - Graduate Student B

## Discussion

The transition to web-native publishing represents more than a technological upgrade—it's a fundamental shift toward more inclusive and accessible research communication.

### Key Benefits

1. **Enhanced Accessibility**: Screen readers, keyboard navigation, and customizable display options
2. **Dynamic Content**: Interactive figures, embedded data, and real-time updates
3. **Better Discovery**: Full-text search, semantic markup, and linked data
4. **Collaborative Features**: Inline comments, annotations, and version tracking

### Implementation Challenges

Despite the benefits, several challenges must be addressed:

- **Author Training**: Researchers need support transitioning from Word/LaTeX workflows
- **Publisher Adoption**: Business model changes and technical infrastructure requirements
- **Standardization**: Need for common markup standards and interoperability
- **Long-term Preservation**: Ensuring digital documents remain accessible over time

## Future Work

This research opens several avenues for future investigation:

- Development of authoring tools for non-technical researchers
- Integration with existing manuscript submission systems
- Analysis of impact on citation patterns and research discovery
- Exploration of multimedia content integration (videos, interactive simulations)

## Conclusion

Web-native scientific publishing represents a paradigm shift that can address many limitations of current publishing models. While technical and adoption challenges exist, the potential benefits for accessibility, engagement, and scientific communication are substantial.

The future of research dissemination lies not in replicating print formats digitally, but in embracing the unique capabilities of web technologies to create more inclusive, interactive, and impactful scholarly communication.

## Acknowledgments

We thank the research participants who provided valuable feedback and the open-source community whose tools made this work possible.

## References

1. Smith, J. et al. (2023). "Digital Transformation in Academic Publishing." *Journal of Scholarly Communication*, 15(3), 45-62.
2. Johnson, M. (2022). "Accessibility in Scientific Literature: Current State and Future Directions." *Universal Design Quarterly*, 8(2), 12-28.
3. Lee, K. & Brown, S. (2024). "Interactive Research Documents: A User Experience Study." *CHI Conference Proceedings*, 1234-1245.
4. Wilson, A. (2023). "Web Technologies for Academic Publishing: A Technical Review." *Digital Humanities Review*, 7(4), 89-105.

---

*This is a demonstration document showcasing the capabilities of web-native research publishing. The content is fictional but representative of actual research papers.*`,
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
  get: (url) => {
    if (url.includes("/content")) {
      return Promise.resolve({
        data: convertMarkdownToHtml(demoFile.source),
      });
    }
    if (url.includes("/settings")) {
      return Promise.resolve({
        data: demoFile._settings,
      });
    }
    return Promise.resolve({ data: {} });
  },
  post: () => Promise.resolve({ data: {} }),
  put: () => Promise.resolve({ data: {} }),
  delete: () => Promise.resolve({ data: {} }),
  // Return a fake URI that won't cause 404s for static assets
  getUri: () => "",
});

// Simple markdown to HTML converter for demo purposes
function convertMarkdownToHtml(markdown) {
  return (
    markdown
      // Headers
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Code blocks
      .replace(/```[\s\S]*?```/g, "<pre><code>$&</code></pre>")
      // Inline code
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      // Tables (basic)
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split("|").slice(1, -1);
        return "<tr>" + cells.map((cell) => `<td>${cell.trim()}</td>`).join("") + "</tr>";
      })
      // Blockquotes
      .replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>")
      // Line breaks
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>")
      // Wrap in paragraphs
      .split("</p><p>")
      .map((p) =>
        p.startsWith("<h") || p.startsWith("<table") || p.startsWith("<blockquote")
          ? p
          : `<p>${p}</p>`
      )
      .join("")
  );
}
