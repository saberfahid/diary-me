// Supabase table: diary_entries
// Columns: id (uuid, primary key), user_id (uuid), title (text), content (text), mood (text), tags (text[]), date (date), image (text)

import { supabase } from './components/supabaseClient';

export async function saveDiaryEntryToSupabase(entry, userId) {
  const { data, error } = await supabase
    .from('diary_entries')
    .insert([{ ...entry, user_id: userId }]);
  return { data, error };
}

export async function getDiaryEntriesFromSupabase(userId) {
  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  return { data, error };
}
