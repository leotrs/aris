// Ication data service for fetching published preprint content
import { File } from "@/models/File.js";

// Create API instance for preprint data fetching
export const createIcationApi = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  return {
    get: async (url) => {
      try {
        const response = await fetch(`${baseURL}${url}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { data };
      } catch (error) {
        console.error("API request failed:", error);
        throw error;
      }
    },

    post: async (url, payload) => {
      try {
        const response = await fetch(`${baseURL}${url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { data };
      } catch (error) {
        console.error("API request failed:", error);
        throw error;
      }
    },

    // Return the backend URI for static assets
    getUri: () => baseURL,

    // Mirror axios instance interface - components depend on defaults.baseURL and defaults.headers
    defaults: {
      baseURL: baseURL,
      headers: {
        common: {},
      },
    },
  };
};

// Fetch preprint data and convert to File-compatible format
export const fetchIcationData = async (identifier) => {
  const api = createIcationApi();

  try {
    // Fetch preprint data from backend
    const response = await api.get(`/ication/${identifier}`);
    const preprintData = response.data;

    // Convert to File-compatible format
    const icationFile = new File({
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
      file: icationFile,
      metadata: preprintData,
    };
  } catch (error) {
    console.error("Failed to fetch preprint data:", error);
    throw error;
  }
};

// Create mock file store for preprint context
export const createIcationFileStore = (icationFile) => ({
  files: [icationFile],
  tags: icationFile.tags || [],
  isLoading: false,
  error: undefined,
  queueSync: () => Promise.resolve(),
  loadFiles: () => Promise.resolve(),
  loadTags: () => Promise.resolve(),
});

// Create mock user for preprint context (public viewing)
export const createIcationUser = () => ({
  id: null,
  username: "anonymous",
  email: null,
  firstName: "Anonymous",
  lastName: "User",
});

// Create empty annotations array for preprint context
export const createIcationAnnotations = () => [];
