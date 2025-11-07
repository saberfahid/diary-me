// Dexie.js database setup for diary entries
import Dexie from 'dexie';

export const db = new Dexie('diaryme');
// Version 1: Original schema
db.version(1).stores({
  entries: '++id, title, date, mood, tags, created',
});
// Version 2: Add missing fields
db.version(2).stores({
  entries: '++id, title, content, date, mood, tags, image, created, needsSync',
});
// Version 3: Add supabase_id for better ID mapping
db.version(3).stores({
  entries: '++id, title, content, date, mood, tags, image, created, needsSync, supabase_id',
});

export async function saveDiaryEntry(entry) {
  console.log('db.js: Saving entry to IndexedDB:', entry);
  const result = await db.entries.add(entry);
  console.log('db.js: Entry saved with ID:', result);
  return result;
}

export async function getDiaryEntries() {
  const entries = await db.entries.orderBy('created').reverse().toArray();
  console.log('db.js: Retrieved entries from IndexedDB:', entries.length, entries);
  return entries;
}

export async function getDiaryEntriesByDate(date) {
  return db.entries.where('date').equals(date).toArray();
}

export async function deleteDiaryEntry(id) {
  return db.entries.delete(id);
}

export async function updateDiaryEntry(id, entry) {
  return db.entries.update(id, entry);
}

export async function getDiaryEntryById(id) {
  return db.entries.get(id);
}
