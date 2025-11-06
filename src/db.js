// Dexie.js database setup for diary entries
import Dexie from 'dexie';

export const db = new Dexie('diaryme');
db.version(1).stores({
  entries: '++id, title, date, mood, tags, created',
});

export async function saveDiaryEntry(entry) {
  return db.entries.add(entry);
}

export async function getDiaryEntries() {
  return db.entries.orderBy('created').reverse().toArray();
}

export async function getDiaryEntriesByDate(date) {
  return db.entries.where('date').equals(date).toArray();
}

export async function deleteDiaryEntry(id) {
  return db.entries.delete(id);
}
