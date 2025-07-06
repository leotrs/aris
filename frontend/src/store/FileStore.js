import { ref, computed, reactive } from "vue";
import { File } from "@/models/File.js";

/**
 * Creates a file store for managing file state and synchronization
 * @param {Object} api - Axios API instance for backend communication
 * @param {Object} user - User information object
 * @returns {Object} File store with methods and state
 */
export function createFileStore(api, user) {
  // Reactive state
  const files = ref([]);
  const numFiles = computed(() => files.value?.length || 0);
  const tags = ref([]);
  const syncQueue = reactive(new Set());
  const syncInProgress = ref(false);

  // Track if store is still active to prevent race conditions
  const isActive = ref(true);

  // Forward declare store for circular reference
  // eslint-disable-next-line prefer-const
  let store;

  /**
   * Queue a file for synchronization
   * @param {Object|Number} fileOrFileId - File object or file ID to synchronize
   */
  const queueSync = async (fileOrFileId) => {
    const fileId = typeof fileOrFileId === "number" ? fileOrFileId : fileOrFileId.id;
    syncQueue.add(fileId);
    await scheduleSyncProcess();
  };

  /**
   * Process the sync queue
   */
  const syncProcess = async () => {
    if (syncInProgress.value || syncQueue.size === 0) return;

    try {
      syncInProgress.value = true;

      for (const fileId of syncQueue) {
        const file = files.value.find((f) => f.id === fileId);
        if (!file) continue;
        await File.save(file, api, user);
      }

      syncQueue.clear();
    } catch (error) {
      console.error("Error during file sync:", error);
    } finally {
      syncInProgress.value = false;
      // If there are still items in the queue, schedule another sync
      if (syncQueue.size > 0) {
        scheduleSyncProcess();
      }
    }
  };

  /**
   * Schedule sync process with debounce
   */
  let syncTimeout = null;
  const scheduleSyncProcess = () => {
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(syncProcess, 800);
  };

  /**
   * Load files from the server
   */
  const loadFiles = async () => {
    try {
      const response = await api.get(`/users/${user.id}/files`, {
        params: { with_tags: true },
      });

      // Only update reactive state if store is still active
      if (!isActive.value) {
        console.log("FileStore: Skipping files update - store is no longer active");
        return;
      }

      // Preserve selected and filtered states when reloading
      files.value = response.data.map((newFile) => {
        const existingFile = files.value.find((f) => f.id === newFile.id);

        // DONT use createFile - that will create a new file in the DB!
        return new File(
          {
            ...newFile,
            filtered: existingFile ? existingFile.filtered : false,
            selected: existingFile ? existingFile.selected : false,
            isMountedAt: existingFile ? existingFile.isMountedAt : false,
            html: existingFile ? existingFile.html : false,
            ownerId: user.id,
          },
          store
        );
      });
    } catch (error) {
      if (isActive.value) {
        console.error("Error loading files:", error);
      }
    }
  };

  /**
   * Create a new file in the DB
   * @param {Object} fileData - Initial file data
   * @returns {Object} The newly created file
   */
  const createFile = async (fileData = {}) => {
    const newFile = new File(
      {
        ...fileData,
        last_edited_at: new Date().toISOString(),
      },
      store
    );

    files.value.push(newFile);
    await File.save(newFile, api, user);
    return newFile;
  };

  /**
   * Delete a file
   * @param {Number|String|Object} fileOrId - File or ID of file to delete
   */
  const deleteFile = async (fileOrId) => {
    const fileId = typeof fileOrId === "object" ? fileOrId.id : fileOrId;
    const file = files.value.find((f) => f.id === fileId);

    if (!file) return;

    // Delete from server first
    const success = await File.delete(file, api, user);

    if (success) {
      // Remove from local collection
      const index = files.value.findIndex((f) => f.id === fileId);
      if (index !== -1) {
        files.value.splice(index, 1);
      }
      // Remove from sync queue
      syncQueue.delete(fileId);
    }
  };

  /**
   * Sort files with the provided compare function
   * @param {Function} compareFunc - Compare function for sorting
   */
  const sortFiles = (compareFunc) => {
    files.value.sort(compareFunc);
  };

  /**
   * Filter files with the provided filter function
   * @param {Function} filterFunc - Filter function
   */
  const filterFiles = (filterFunc) => {
    files.value.forEach((file) => {
      file.filtered = filterFunc(file);
    });
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    files.value.forEach((file) => {
      file.filtered = false;
    });
  };

  /**
   * Select a file (deselects any other)
   * @param {Object} file - File to select
   */
  const selectFile = (file) => {
    if (file.selected) return;

    // Deselect any currently selected file
    const currentSelected = files.value.find((f) => f.selected);
    if (currentSelected) currentSelected.selected = false;

    // Select the new file
    file.selected = true;
  };

  /**
   * Clear file selection
   */
  const clearSelection = () => {
    files.value.forEach((file) => {
      file.selected = false;
    });
  };

  /**
   * Get the n most recently edited files
   * @param {Number} n - Number of recent files to return (default: 5)
   * @returns {Array} Array of the n most recently edited files
   */
  const getRecentFiles = (n = 5) => {
    return files.value
      .slice() // Create a copy to avoid mutating the original array
      .sort((a, b) => new Date(b.last_edited_at) - new Date(a.last_edited_at))
      .slice(0, n);
  };

  /**
   * Add a tag to a file (proxy to File.addTag)
   * @param {Object} file - The file object
   * @param {Number|String} tagId - ID of tag to add
   */
  const addTagToFile = async (file, tagId) => {
    await File.addTag(file, tagId, api, user);
  };

  /**
   * Remove a tag from a file (proxy to File.removeTag)
   * @param {Object} file - The file object
   * @param {Number|String} tagId - ID of tag to remove
   */
  const removeTagFromFile = async (file, tagId) => {
    await File.removeTag(file, tagId, api, user);
  };

  /**
   * Toggle a tag on a file (add if not present, remove if present)
   * @param {Object} file - The file object
   * @param {Number|String} tagId - ID of tag to toggle
   */
  const toggleFileTag = async (file, tagId) => {
    const hasTag = file.tags.some((tag) => tag.id === tagId);

    if (hasTag) {
      return await File.removeTag(file, tagId, api, user);
    } else {
      return await File.addTag(file, tagId, api, user);
    }
  };

  /**
   * Load tags from the server
   */
  const loadTags = async () => {
    try {
      const response = await api.get(`/users/${user.id}/tags`);
      tags.value = response.data;
    } catch (error) {
      console.error("Error loading tags:", error);
    }
  };

  /**
   * Create a new tag
   * @param {String} name - Tag name
   * @param {String} color - Tag color (optional)
   */
  const createTag = async (name, color = null) => {
    try {
      await api.post(`/users/${user.id}/tags`, {
        name,
        color: color || "",
      });
      await loadTags();
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  /**
   * Update an existing tag
   * @param {Object} oldTag - Existing tag
   * @param {Object} newTag - Updated tag data
   */
  const updateTag = async (oldTag, newTag) => {
    if (!oldTag) {
      await loadTags();
      return;
    }

    const url = `/users/${user.id}/tags/${oldTag.id}`;

    try {
      if (newTag === null) {
        await api.delete(url);
      } else {
        await api.put(url, newTag);
      }
      await loadTags();
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };

  /**
   * Get all tags
   * @returns {Array} Array of tags
   */
  const getTags = () => tags.value;

  /**
   * Cleanup store to prevent race conditions during component unmounting
   */
  const cleanup = () => {
    isActive.value = false;
  };

  // Computed properties
  const selectedFile = computed(() => files.value.find((f) => f.selected) || {});
  const filteredFiles = computed(() => files.value.filter((f) => !f.filtered));

  // Create the store object
  store = {
    // State
    files,
    numFiles,
    tags,
    syncInProgress,
    selectedFile,
    filteredFiles,
    syncQueue, // Add syncQueue to the store for tests

    // File methods
    loadFiles,
    createFile,
    deleteFile,
    sortFiles,
    filterFiles,
    clearFilters,
    selectFile,
    clearSelection,
    queueSync,
    getRecentFiles,

    // Tag methods
    loadTags,
    createTag,
    updateTag,
    getTags,
    addTagToFile,
    removeTagFromFile,
    toggleFileTag,

    // Cleanup method
    cleanup,
  };

  return store;
}
