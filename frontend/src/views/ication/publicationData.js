// Publication data service for fetching published preprint content
import { File } from "@/models/File.js";
import { demoFile } from "@/views/demo/demoData.js";

// Demo preprint data for testing citation modal
const demoPreprintData = {
  id: 999,
  title: "Sample Research Paper: The Future of Web-Native Publishing",
  source: demoFile.source,
  abstract: "This paper explores the revolutionary potential of web-native scientific publishing platforms in transforming how research is disseminated, consumed, and validated. We examine the limitations of traditional PDF-based publishing and propose a new paradigm that leverages modern web technologies to create interactive, accessible, and dynamic research documents.",
  keywords: "web-native, publishing, research, interactive, accessibility",
  authors: "Dr. Sarah Chen, Prof. Michael Rodriguez",
  version: 1,
  public_uuid: "demo",
  permalink_slug: "future-web-native-publishing",
  published_at: "2025-01-15T10:00:00Z",
  last_edited_at: "2025-01-15T09:45:00Z",
  tags: ["research", "publishing", "web-technology"],
  citation_info: {
    title: "Sample Research Paper: The Future of Web-Native Publishing",
    authors: "Dr. Sarah Chen, Prof. Michael Rodriguez",
    published_year: 2025,
    abstract: "This paper explores the revolutionary potential of web-native scientific publishing platforms in transforming how research is disseminated, consumed, and validated.",
    keywords: "web-native, publishing, research, interactive, accessibility",
    formats: {
      apa: "Chen, S., & Rodriguez, M. (2025). Sample Research Paper: The Future of Web-Native Publishing. Aris Preprint.",
      bibtex: `@article{chen2025future,
  title={Sample Research Paper: The Future of Web-Native Publishing},
  author={Chen, Sarah and Rodriguez, Michael},
  year={2025},
  publisher={Aris Preprint}
}`,
      chicago: "Chen, Sarah, and Michael Rodriguez. \"Sample Research Paper: The Future of Web-Native Publishing.\" Aris Preprint, 2025.",
      mla: "Chen, Sarah, and Michael Rodriguez. \"Sample Research Paper: The Future of Web-Native Publishing.\" Aris Preprint, 2025."
    }
  },
  settings: {
    background: "#ffffff",
    fontSize: "18px",
    fontFamily: "'Source Sans 3', sans-serif",
    lineHeight: "1.6",
    marginWidth: "64px",
  }
};

// Fetch preprint data and convert to File-compatible format
export const fetchPublicationData = async (identifier) => {
  try {
    let preprintData;
    
    // Handle demo identifier specially
    if (identifier === "demo") {
      preprintData = demoPreprintData;
    } else {
      // Fetch preprint data from backend using fetch (no auth required)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ication/${identifier}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      preprintData = await response.json();
    }

    // Convert to File-compatible format
    const publicationFile = new File({
      id: preprintData.id,
      title: preprintData.title,
      source: preprintData.source,
      last_edited_at: preprintData.last_edited_at,
      published_at: preprintData.published_at,
      public_uuid: preprintData.public_uuid,
      permalink_slug: preprintData.permalink_slug,
      abstract: preprintData.abstract,
      keywords: preprintData.keywords,
      authors: preprintData.authors,
      version: preprintData.version,
      citation_info: preprintData.citation_info,
      tags: preprintData.tags || [],
      _settings: preprintData.settings || {
        background: "#ffffff",
        fontSize: "18px",
        fontFamily: "'Source Sans 3', sans-serif",
        lineHeight: "1.6",
        marginWidth: "64px",
      },
    });

    return {
      file: publicationFile,
      metadata: preprintData,
    };
  } catch (error) {
    console.error("Failed to fetch preprint data:", error);
    throw error;
  }
};

// Fetch citation metadata for a preprint
export const fetchCitationMetadata = async (identifier) => {
  try {
    // Handle demo identifier specially
    if (identifier === "demo") {
      return demoPreprintData;
    }
    
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/ication/${identifier}/metadata`
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch citation metadata:", error);
    throw error;
  }
};

// Create mock API client for preprint context
export const createPublicationApi = () => ({
  get: async (url) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return { data: await response.json() };
  },
  post: async (url, data) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return { data: await response.json() };
  },
  getUri: () => import.meta.env.VITE_API_BASE_URL,
  defaults: {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { common: {} },
  },
});

// Create mock file store for preprint context
export const createPublicationFileStore = (publicationFile) => ({
  files: [publicationFile],
  tags: publicationFile.tags || [],
  isLoading: false,
  error: undefined,
  queueSync: () => Promise.resolve(),
  loadFiles: () => Promise.resolve(),
  loadTags: () => Promise.resolve(),
});

// Create mock user for preprint context (public viewing)
export const createPublicationUser = () => ({
  id: null,
  username: "anonymous",
  email: null,
  firstName: "Anonymous",
  lastName: "User",
});

// Create empty annotations array for preprint context
export const createPublicationAnnotations = () => [];
