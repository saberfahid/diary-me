// Local-first data service with Supabase sync
import { 
  saveDiaryEntry, 
  getDiaryEntries, 
  updateDiaryEntry, 
  deleteDiaryEntry as deleteLocalEntry,
  getDiaryEntryById 
} from './db';
import { 
  saveDiaryEntryToSupabase, 
  updateDiaryEntryInSupabase, 
  deleteDiaryEntryFromSupabase,
  getDiaryEntriesFromSupabase 
} from './dbSupabase';
import { deleteImageFromSupabase } from './uploadImageSupabase';

// Local-first data operations
export class DiaryDataService {
  constructor(userId) {
    this.userId = userId;
    this.syncQueue = [];
    this.isOnline = navigator.onLine;
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Save entry locally first, then sync to Supabase
  async saveEntry(entryData) {
    try {
      // Generate a temporary ID if not provided
      const tempId = entryData.id || `temp_${Date.now()}`;
      const entryWithId = { ...entryData, id: tempId, needsSync: true };
      
      // Save locally first (immediate response)
      await saveDiaryEntry(entryWithId);
      
      // Add to sync queue for Supabase
      this.addToSyncQueue('create', entryWithId);
      
      // Try immediate sync if online
      if (this.isOnline && this.userId) {
        await this.processSyncQueue();
      }
      
      return { success: true, id: tempId };
    } catch (error) {
      console.error('Error saving entry locally:', error);
      return { success: false, error };
    }
  }

  // Update entry locally first, then sync to Supabase
  async updateEntry(entryId, entryData) {
    try {
      // Update locally first (immediate response)
      await updateDiaryEntry(entryId, { ...entryData, needsSync: true });
      
      // Add to sync queue for Supabase
      this.addToSyncQueue('update', { id: entryId, ...entryData });
      
      // Try immediate sync if online
      if (this.isOnline && this.userId) {
        await this.processSyncQueue();
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating entry locally:', error);
      return { success: false, error };
    }
  }

  // Delete entry locally first, then sync to Supabase
  async deleteEntry(entryId) {
    try {
      // Get entry data first (for image cleanup)
      const entry = await getDiaryEntryById(entryId);
      
      // Delete locally first (immediate response)
      await deleteLocalEntry(entryId);
      
      // Add to sync queue for Supabase
      this.addToSyncQueue('delete', { id: entryId, image: entry?.image });
      
      // Try immediate sync if online
      if (this.isOnline && this.userId) {
        await this.processSyncQueue();
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting entry locally:', error);
      return { success: false, error };
    }
  }

  // Get entries from local database (fast)
  async getEntries() {
    try {
      return await getDiaryEntries();
    } catch (error) {
      console.error('Error getting local entries:', error);
      return [];
    }
  }

  // Sync local data with Supabase in background
  async syncWithSupabase(forceSync = false) {
    if (!this.userId || (!this.isOnline && !forceSync)) {
      return;
    }

    try {
      // Get remote entries
      const { data: remoteEntries, error } = await getDiaryEntriesFromSupabase(this.userId);
      if (error) {
        console.error('Error fetching remote entries:', error);
        return;
      }

      // Get local entries
      const localEntries = await getDiaryEntries();
      
      // Merge and update local database with remote data
      // (Skip entries that need sync to avoid conflicts)
      const entriesToUpdate = remoteEntries?.filter(remote => {
        const local = localEntries.find(l => l.id === remote.id);
        return !local?.needsSync;
      }) || [];
      
      for (const entry of entriesToUpdate) {
        const existsLocally = localEntries.some(l => l.id === entry.id);
        if (existsLocally) {
          await updateDiaryEntry(entry.id, { ...entry, needsSync: false });
        } else {
          await saveDiaryEntry({ ...entry, needsSync: false });
        }
      }
      
      // Process any pending sync operations
      await this.processSyncQueue();
      
    } catch (error) {
      console.error('Error syncing with Supabase:', error);
    }
  }

  // Add operation to sync queue
  addToSyncQueue(operation, data) {
    this.syncQueue.push({ operation, data, timestamp: Date.now() });
  }

  // Process sync queue
  async processSyncQueue() {
    if (!this.userId || !this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    const queue = [...this.syncQueue];
    this.syncQueue = [];

    for (const item of queue) {
      try {
        await this.processSyncItem(item);
      } catch (error) {
        console.error('Sync error:', error);
        // Re-add to queue for retry
        this.syncQueue.push(item);
      }
    }
  }

  // Process individual sync item
  async processSyncItem({ operation, data }) {
    switch (operation) {
      case 'create': {
        const { error: createError } = await saveDiaryEntryToSupabase(data, this.userId);
        if (!createError) {
          // Mark as synced locally
          await updateDiaryEntry(data.id, { needsSync: false });
        }
        break;
      }

      case 'update': {
        const { error: updateError } = await updateDiaryEntryInSupabase(data, this.userId, data.id);
        if (!updateError) {
          // Mark as synced locally
          await updateDiaryEntry(data.id, { needsSync: false });
        }
        break;
      }

      case 'delete': {
        // Delete from Supabase
        const { error: deleteError } = await deleteDiaryEntryFromSupabase(data.id, this.userId);
        
        // Delete image if exists
        if (!deleteError && data.image && data.image.startsWith('http')) {
          await deleteImageFromSupabase(data.image);
        }
        break;
      }

      default:
        console.error('Unknown sync operation:', operation);
    }
  }

  // Get entry by ID (local first)
  async getEntryById(entryId) {
    try {
      return await getDiaryEntryById(entryId);
    } catch (error) {
      console.error('Error getting entry by ID:', error);
      return null;
    }
  }
}

export default DiaryDataService;