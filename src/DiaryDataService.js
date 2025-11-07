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

  // Initialize the service and perform initial sync
  async initialize() {
    console.log('DiaryDataService: Initializing for user:', this.userId);
    
    // Perform initial sync on login to ensure all devices see the same data
    if (this.userId && this.isOnline) {
      console.log('DiaryDataService: Performing initial sync on login...');
      await this.syncWithSupabase(true); // Force sync on initialization
    }
    
    return Promise.resolve();
  }

  // Save entry locally first, then sync to Supabase
  async saveEntry(entryData) {
    try {
      // Use a proper UUID-like ID instead of timestamp
      const localId = entryData.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const entryWithId = { ...entryData, id: localId, needsSync: true };
      
      console.log('DiaryDataService: Saving entry locally:', entryWithId);
      
      // Save locally first (immediate response)
      const savedId = await saveDiaryEntry(entryWithId);
      
      // Force immediate sync if online - no manual intervention needed
      if (this.isOnline && this.userId) {
        try {
          const { data: supabaseData, error } = await saveDiaryEntryToSupabase(entryWithId, this.userId);
          if (!error && supabaseData && supabaseData.length > 0) {
            const realId = supabaseData[0].id;
            // Update local entry with real Supabase ID
            await updateDiaryEntry(savedId, { 
              id: realId, 
              needsSync: false 
            });
            console.log('DiaryDataService: Entry automatically synced to Supabase:', realId);
            return { success: true, id: realId };
          }
        } catch (syncError) {
          console.error('Immediate sync failed, adding to queue for auto-retry:', syncError);
        }
      }
      
      // Add to sync queue for later if immediate sync failed
      this.addToSyncQueue('create', entryWithId);
      
      return { success: true, id: savedId };
    } catch (error) {
      console.error('Error saving entry locally:', error);
      return { success: false, error };
    }
  }

  // Update entry locally first, then sync to Supabase automatically
  async updateEntry(entryId, entryData) {
    try {
      // Update locally first (immediate response)
      await updateDiaryEntry(entryId, { ...entryData, needsSync: true });
      
      // Force immediate sync if online - automatic background processing
      if (this.isOnline && this.userId) {
        try {
          const { error: updateError } = await updateDiaryEntryInSupabase({ id: entryId, ...entryData }, this.userId, entryId);
          if (!updateError) {
            await updateDiaryEntry(entryId, { needsSync: false });
            console.log('DiaryDataService: Entry automatically updated in Supabase:', entryId);
          }
        } catch (syncError) {
          console.error('Immediate update sync failed, queued for auto-retry:', syncError);
          // Add to sync queue for automatic retry
          this.addToSyncQueue('update', { id: entryId, ...entryData });
        }
        await this.processSyncQueue();
      } else {
        // Add to sync queue for when connection returns
        this.addToSyncQueue('update', { id: entryId, ...entryData });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating entry locally:', error);
      return { success: false, error };
    }
  }

  // Delete entry locally first, then sync to Supabase automatically
  async deleteEntry(entryId) {
    try {
      // Get entry data first (for image cleanup)
      const entry = await getDiaryEntryById(entryId);
      
      // Delete locally first (immediate response)
      await deleteLocalEntry(entryId);
      
      // Force immediate sync if online - automatic background processing
      if (this.isOnline && this.userId) {
        try {
          const { error: deleteError } = await deleteDiaryEntryFromSupabase(entryId, this.userId);
          if (!deleteError) {
            console.log('DiaryDataService: Entry automatically deleted from Supabase:', entryId);
            // Delete image if exists
            if (entry?.image && entry.image.startsWith('http')) {
              await deleteImageFromSupabase(entry.image);
            }
          }
        } catch (syncError) {
          console.error('Immediate delete sync failed, queued for auto-retry:', syncError);
          // Add to sync queue for automatic retry
          this.addToSyncQueue('delete', { id: entryId, image: entry?.image });
        }
        await this.processSyncQueue();
      } else {
        // Add to sync queue for when connection returns
        this.addToSyncQueue('delete', { id: entryId, image: entry?.image });
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
      const entries = await getDiaryEntries();
      console.log('DiaryDataService: Retrieved entries from local DB:', entries.length, entries);
      return entries;
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
      console.log('DiaryDataService: Starting sync with Supabase for user:', this.userId);
      
      // Get remote entries from Supabase
      const { data: remoteEntries, error } = await getDiaryEntriesFromSupabase(this.userId);
      if (error) {
        console.error('Error fetching remote entries:', error);
        return;
      }

      console.log('DiaryDataService: Found remote entries:', remoteEntries?.length || 0);

      // Get local entries
      const localEntries = await getDiaryEntries();
      console.log('DiaryDataService: Found local entries:', localEntries?.length || 0);
      
      // STEP 1: Process pending sync operations first
      await this.processSyncQueue();
      
      // STEP 2: Merge remote entries into local database
      const remoteEntriesArray = remoteEntries || [];
      
      for (const remoteEntry of remoteEntriesArray) {
        const localEntry = localEntries.find(l => 
          l.id === remoteEntry.id || 
          l.supabase_id === remoteEntry.id ||
          (l.id.toString().startsWith('local_') && l.supabase_id === remoteEntry.id)
        );
        
        if (localEntry) {
          // Entry exists locally - update if remote is newer (and not pending sync)
          if (!localEntry.needsSync) {
            const remoteUpdated = new Date(remoteEntry.updated_at || remoteEntry.created_at);
            const localUpdated = new Date(localEntry.updated_at || localEntry.created_at || localEntry.created);
            
            if (remoteUpdated > localUpdated) {
              console.log('DiaryDataService: Updating local entry with remote data:', remoteEntry.id);
              await updateDiaryEntry(localEntry.id, { 
                ...remoteEntry, 
                id: localEntry.id, // Keep local ID for IndexedDB
                supabase_id: remoteEntry.id,
                needsSync: false 
              });
            }
          }
        } else {
          // Entry doesn't exist locally - add it
          console.log('DiaryDataService: Adding new remote entry to local:', remoteEntry.id);
          await saveDiaryEntry({ 
            ...remoteEntry, 
            id: remoteEntry.id, // Use Supabase ID as local ID
            supabase_id: remoteEntry.id,
            needsSync: false 
          });
        }
      }
      
      // STEP 3: Upload any local entries that aren't in Supabase
      const localOnlyEntries = localEntries.filter(local => {
        if (local.needsSync) return true; // Definitely needs sync
        
        const existsRemote = remoteEntriesArray.some(remote => 
          remote.id === local.id || 
          remote.id === local.supabase_id ||
          local.id === remote.id
        );
        
        return !existsRemote;
      });
      
      console.log('DiaryDataService: Found local-only entries to sync:', localOnlyEntries.length);
      
      for (const localEntry of localOnlyEntries) {
        if (!localEntry.id.toString().startsWith('local_')) {
          // Skip entries that might be duplicates
          continue;
        }
        
        try {
          console.log('DiaryDataService: Uploading local entry to Supabase:', localEntry.id);
          const { data: supabaseData, error: uploadError } = await saveDiaryEntryToSupabase(localEntry, this.userId);
          
          if (!uploadError && supabaseData && supabaseData.length > 0) {
            const supabaseId = supabaseData[0].id;
            await updateDiaryEntry(localEntry.id, { 
              supabase_id: supabaseId,
              needsSync: false 
            });
            console.log('DiaryDataService: Successfully uploaded entry:', supabaseId);
          }
        } catch (uploadError) {
          console.error('DiaryDataService: Failed to upload entry:', uploadError);
        }
      }
      
      console.log('DiaryDataService: Sync with Supabase completed');
      
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
        const { data: supabaseData, error: createError } = await saveDiaryEntryToSupabase(data, this.userId);
        if (!createError && supabaseData && supabaseData.length > 0) {
          // Update local entry with Supabase ID and mark as synced
          const supabaseId = supabaseData[0].id;
          await updateDiaryEntry(data.id, { 
            supabase_id: supabaseId, 
            needsSync: false 
          });
          console.log('DiaryDataService: Entry synced to Supabase with ID:', supabaseId);
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

  // Get entry by ID (local first, with fallback search)
  async getEntryById(entryId) {
    try {
      console.log('DiaryDataService: Looking for entry with ID:', entryId);
      
      // First try direct lookup
      let entry = await getDiaryEntryById(entryId);
      
      if (!entry) {
        // If not found, try searching all entries (handles ID mismatches)
        const allEntries = await getDiaryEntries();
        entry = allEntries.find(e => 
          String(e.id) === String(entryId) || 
          (e.supabase_id && String(e.supabase_id) === String(entryId))
        );
        console.log('DiaryDataService: Searched all entries, found:', !!entry);
      }
      
      return entry || null;
    } catch (error) {
      console.error('Error getting entry by ID:', error);
      return null;
    }
  }
}

export default DiaryDataService;