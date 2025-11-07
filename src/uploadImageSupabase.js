import { supabase } from './supabaseClient';

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

export async function deleteImageFromSupabase(imageUrl) {
  if (!imageUrl) return { error: null };
  
  try {
    // Extract the file path from the URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/diary-media/userId/filename.ext
    const urlParts = imageUrl.split('/');
    const bucketIndex = urlParts.indexOf('diary-media');
    if (bucketIndex === -1) return { error: new Error('Invalid image URL format') };
    
    // Get the path after 'diary-media/'
    const filePath = urlParts.slice(bucketIndex + 1).join('/');
    
    const { error } = await supabase.storage
      .from('diary-media')
      .remove([filePath]);
    
    return { error };
  } catch (err) {
    return { error: err };
  }
}
