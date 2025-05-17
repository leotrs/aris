// File.js
import { reactive } from 'vue';
import RelativeTime from "@yaireo/relative-Time";

// Singleton for date formatting
const relativeTime = new RelativeTime({ locale: "en" });

/**
 * File class encapsulating a single file's data and operations
 */
export class File {
  constructor(rawData = {}, store = null) {
    // Create a reactive object with all file properties
    const reactiveFile = reactive({
      // File metadata
      id: rawData.id || null,
      title: rawData.title || 'Untitled',
      source: rawData.source || '',
      last_edited_at: rawData.last_edited_at || new Date().toISOString(),
      tags: rawData.tags || [],
      minimap: rawData.minimap || null,
      ownerId: rawData.owner_id || null,

      // UI state
      selected: rawData.selected || false,
      filtered: rawData.filtered || false,
      isMountedAt: rawData.isMountedAt || null,

      // Track if file has unsaved changes
      isDirty: false,

      // Reference to parent store for sync operations
      _store: store,

      // Method to format the timestamp for display
      getFormattedDate() {
        return relativeTime.from(new Date(this.last_edited_at));
      }
    });

    return reactiveFile;
  }

  /**
   * Updates file with new data and marks it for sync
   * @param {Object} file - The reactive file object
   * @param {Object} changes - Object with properties to update
   * @param {Boolean} markDirty - Whether to mark file as needing sync
   */
  static update(file, changes, markDirty = true) {
    Object.assign(file, changes);
    if (markDirty) {
      file.isDirty = true;
      file._store?.queueSync(file);
    }
    return file;
  }

  /**
   * Saves file data to the server
   * @param {Object} file - The file to save
   * @param {Object} api - API instance
   * @param {Object} user - User information
   */
  static async save(file, api) {
    try {
      let fileData = File.toJSON(file);
      fileData.owner_id = fileData.ownerId;
      delete fileData.ownerId;

      if (file.id) {
        // Update existing file
        await api.put(`/files/${file.id}`, fileData);
      } else {
        // Create new file
        const response = await api.post(`/files/`, fileData);
        Object.assign(file, response.data);
      }

      file.isDirty = false;
      return true;
    } catch (error) {
      console.error(`Error saving file:`, error);
      return false;
    }
  }

  /**
   * Deletes a file from the server
   * @param {Object} file - The file to delete
   * @param {Object} api - API instance
   * @param {Object} user - User information
   */
  static async delete(file, api, user) {
    try {
      if (!file.id) return true; // Nothing to delete

      await api.delete(`/files/${file.id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting file:`, error);
      return false;
    }
  }

  /**
   * Selects a file in its collection
   * @param {Object} file - The file to select
   */
  static select(file) {
    if (file._store) {
      file._store.selectFile(file);
    } else if (!file.selected) {
      file.selected = true;
    }
  }

  /**
   * Adds a tag to a file
   * @param {Object} file - The file object
   * @param {Number|String} tagId - ID of tag to add
   * @param {Object} api - API instance
   * @param {Object} user - User information
   */
  static async addTag(file, tagId, api, user) {
    try {
      await api.post(`/users/${user.id}/files/${file.id}/tags/${tagId}`);

      // Add tag to local file if not already present
      if (!file.tags.some(tag => tag.id === tagId)) {
        // If the store has tag info, use it
        if (file._store && file._store.getTags) {
          const tag = file._store.getTags().find(t => t.id === tagId);
          if (tag) {
            file.tags.push({ ...tag });
          }
        }
      }

      return true;
    } catch (error) {
      console.error(`Error adding tag to file:`, error);
      return false;
    }
  }

  /**
   * Removes a tag from a file
   * @param {Object} file - The file object
   * @param {Number|String} tagId - ID of tag to remove
   * @param {Object} api - API instance
   * @param {Object} user - User information
   */
  static async removeTag(file, tagId, api, user) {
    try {
      await api.delete(`/users/${user.id}/files/${file.id}/tags/${tagId}`);

      // Remove tag from local file
      const tagIndex = file.tags.findIndex(tag => tag.id === tagId);
      if (tagIndex !== -1) {
        file.tags.splice(tagIndex, 1);
      }

      return true;
    } catch (error) {
      console.error(`Error removing tag from file:`, error);
      return false;
    }
  }

  /**
   * Creates a plain JS object from file (for API calls)
   * @param {Object} file - The file object
   * @returns {Object} Plain JS object with file data
   */
  static toJSON(file) {
    const { id, title, source, tags, ownerId } = file;
    return {
      id,
      title,
      source,
      ownerId,
      // Only send tag IDs to API
      tags: tags?.map(tag => typeof tag === 'object' ? tag.id : tag) ?? []
    };
  }
}
