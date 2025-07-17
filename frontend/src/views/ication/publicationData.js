// Publication data service for fetching published preprint content
import { File } from "@/models/File.js";

// Fetch preprint data and convert to File-compatible format
export const fetchPublicationData = async (identifier) => {
  try {
    // Fetch preprint data from backend using fetch (no auth required)
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/ication/${identifier}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const preprintData = await response.json();

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
