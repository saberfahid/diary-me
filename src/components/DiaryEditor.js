import React, { useState, useEffect } from 'react';
import { useSupabaseUser } from '../useSupabaseUser';
import { uploadImageToSupabase, deleteImageFromSupabase } from '../uploadImageSupabase';
import { DiaryDataService } from '../DiaryDataService';

const moods = [
  { icon: '😊', label: 'Happy' },
  { icon: '😢', label: 'Sad' },
  { icon: '😡', label: 'Angry' },
  { icon: '😱', label: 'Surprised' },
  { icon: '😴', label: 'Tired' },
  { icon: '😍', label: 'Love' }
];

function DiaryEditor(props) {
  const initial = props.initialEntry || {};
  const [title, setTitle] = useState(initial.title || '');
  const [mood, setMood] = useState(initial.mood || moods[0].icon);
  const [tags, setTags] = useState(initial.tags ? initial.tags.join(', ') : '');
  const [date, setDate] = useState(initial.date || new Date().toISOString().slice(0, 10));
  const [image, setImage] = useState(initial.image || null);
  const [imageFile, setImageFile] = useState(null);
  const [content, setContent] = useState(initial.content || '');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const user = useSupabaseUser();
  const [dataService, setDataService] = useState(null);

  useEffect(() => {
    if (user?.id) {
      setDataService(new DiaryDataService(user.id));
    }
  }, [user?.id]);

  const handleSave = async () => {
    if (!title || !content) {
      setError('Please fill in both Title and Content to save your entry.');
      return;
    }
    
    if (!dataService) {
      setError('Data service not initialized. Please try again.');
      return;
    }

    setError('');
    setIsSaving(true);

    try {
      let imageUrl = image;
      
      // Upload image if new file selected
      if (imageFile && user && user.id) {
        const { url, error: uploadError } = await uploadImageToSupabase(imageFile, user.id);
        if (uploadError) {
          setError('Failed to upload image: ' + uploadError.message);
          setIsSaving(false);
          return;
        }
        imageUrl = url;
      }

      const entryData = {
        title,
        content,
        mood,
        tags: tags.split(',').map(t => t.trim()),
        date,
        image: imageUrl,
        created: initial.created || Date.now(),
      };

      let result;
      if (initial.id) {
        // Update existing entry
        result = await dataService.updateEntry(initial.id, entryData);
      } else {
        // Create new entry
        result = await dataService.saveEntry(entryData);
      }

      if (result.success) {
        // Clear form for new entries
        if (!initial.id) {
          setTitle('');
          setContent('');
          setImage(null);
          setImageFile(null);
          setTags('');
          setMood(moods[0].icon);
          setDate(new Date().toISOString().slice(0, 10));
        }
        
        if (typeof props.onSave === 'function') {
          props.onSave();
        }
      } else {
        setError('Failed to save entry: ' + (result.error?.message || 'Unknown error'));
      }
    } catch (error) {
      setError('Failed to save entry: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = async () => {
    if (image && image.startsWith('http') && user && user.id) {
      // If it's a Supabase URL, delete from storage
      const { error } = await deleteImageFromSupabase(image);
      if (error) {
        console.error('Failed to delete image from storage:', error);
      }
    }
    setImage(null);
    setImageFile(null);
  };

  return (
  <div className="w-full max-w-[400px] mx-auto p-4 bg-white rounded-2xl shadow-2xl border border-white/40" style={{boxSizing: 'border-box'}}>
      <h2 className="text-xl font-bold text-blue-700 mb-2">New Diary Entry</h2>
      {error && <p className="mb-2 text-xs text-red-600 font-semibold">{error}</p>}
      <input
        type="text"
        className="w-full mb-2 p-2 border rounded"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <div className="flex gap-2 mb-2 flex-wrap">
        {moods.map(m => (
          <button
            key={m.icon}
            className={`flex flex-col items-center text-xl px-2 py-1 rounded border ${mood === m.icon ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 border-gray-200'}`}
            onClick={() => setMood(m.icon)}
            type="button"
          >
            <span>{m.icon}</span>
            <span className="text-xs font-semibold mt-1 text-blue-700">{m.label}</span>
          </button>
        ))}
      </div>
      <input
        type="text"
        className="w-full mb-2 p-2 border rounded"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={e => setTags(e.target.value)}
      />
      <input
        type="date"
        className="mb-2 p-2 border rounded w-full"
        value={date}
        onChange={e => setDate(e.target.value)}
      />
      <label className="flex items-center gap-2 cursor-pointer bg-white border text-blue-700 px-2 py-1 rounded font-bold shadow hover:bg-blue-50 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16.5 7.5l-4.5 4.5-4.5-4.5M12 12V3" />
        </svg>
        Upload Image
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </label>
      {image && (
        <div className="mb-2 relative">
          <img src={image} alt="Diary" className="max-h-32 rounded w-full object-cover" />
          <button
            onClick={handleImageRemove}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            title="Remove image"
          >
            ×
          </button>
        </div>
      )}
      <textarea
        className="border rounded p-2 mb-2 min-h-[100px] w-full font-mono resize-vertical"
        placeholder="Write your diary entry in Markdown..."
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <button
        className={`px-4 py-2 rounded shadow text-sm font-semibold w-full transition-colors ${
          isSaving 
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : (initial.id ? 'Update Entry' : 'Save Entry')}
      </button>
    </div>
  );
}

export default DiaryEditor;
