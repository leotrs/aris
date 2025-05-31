// File.js
import { reactive } from 'vue';
import RelativeTime from "@yaireo/relative-time";

// Singleton for date formatting
const relativeTime = new RelativeTime({ locale: "en" });

// Global reference to the fileStore
let fileStore = null;

/**
 * File class encapsulating a single file's data and operations
 */
export class File {
  constructor(rawData = {}, store = null) {
    if (store && !fileStore) fileStore = store;
    // Create a reactive object with all file properties
    const reactiveFile = reactive({
      // File metadata
      id: rawData.id || null,
      title: rawData.title,
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

      // Date methods -- remember JS needs the timestamp to end with a 'Z' to interpret
      // it as UTC
      getFormattedDate() {
        const utcDate = new Date(this.last_edited_at + 'Z');
        return relativeTime.from(utcDate, Date.now());
      },
      getFullDateTime() {
        const date = new Date(this.last_edited_at + 'Z');
        return date.toLocaleString(undefined, {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // ensures user’s local tz
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        });
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
      fileStore?.queueSync(file);
    }
    return file;
  }

  /**
   * Saves file data to the server
   * @param {Object} file - The file to save
   * @param {Object} api - API instance
   * @param {Object} user - User information
   */
  static async save(file, api, user) {
    try {
      let fileData = File.toJSON(file);
      fileData.owner_id = user.id;
      delete fileData.ownerId;

      if (file.id) {
        // Update existing file
        await api.put(`/files/${file.id}`, fileData);
      } else {
        // Create new file
        const response = await api.post(`/files`, fileData);
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
    if (!file.selected) file.selected = true;
  }

  /**
   * Adds a tag to a file
   * @param {Object} file - The file object
   * @param {Number|String} tagId - ID of tag to add
   * @param {Object} api - API instance
   * @param {Object} user - User information
   */
  static async addTag(file, tagId, api, user) {
    if (file.tags.some((t) => t.id == tagId)) return false;

    try {
      await api.post(`/users/${user.id}/files/${file.id}/tags/${tagId}`);

      // (Optimistically) add tag from file object
      const tagToAdd = fileStore?.tags.value.find((t) => t.id == tagId);
      if (!tagToAdd) console.error("Something went horribly wrong.");
      file.tags.push(tagToAdd);
      file.tags.sort((a, b) => a.created_at - b.created_at);

      return true;
    } catch (error) {
      console.error(`Error removing tag from file:`, error);
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
    if (!file.tags.some((t) => t.id == tagId)) return false;

    try {
      await api.delete(`/users/${user.id}/files/${file.id}/tags/${tagId}`);

      // (Optimistically) remove tag from file object
      const tagIndex = file.tags.findIndex(tag => tag.id == tagId);
      if (tagIndex !== -1) file.tags.splice(tagIndex, 1);

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
