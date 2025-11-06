import { supabase } from './components/supabaseClient';

export async function uploadImageToSupabase(file, userId) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  const { error } = await supabase.storage.from('diary-media').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) return { error };
  const url = supabase.storage.from('diary-media').getPublicUrl(fileName).data.publicUrl;
  return { url };
}
