import ExportButtons from './ExportButtons';
import BuyMeACoffee from './BuyMeACoffee';
import DiaryEditor from './DiaryEditor';
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DiaryDataService from '../DiaryDataService';
import { useSupabaseUser } from '../useSupabaseUser';
function EntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [entry, setEntry] = React.useState(null);
  const [editing, setEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const user = useSupabaseUser();

  React.useEffect(() => {
    const loadEntry = async () => {
      if (!user?.id || !id) {
        setLoading(false);
        return;
      }

      try {
        const diaryService = new DiaryDataService(user.id);
        await diaryService.initialize();
        
        // Try to get the specific entry first
        let foundEntry = await diaryService.getEntryById(id);
        
        // If not found locally, sync with Supabase and try again
        if (!foundEntry) {
          console.log('Entry not found locally, syncing with Supabase...');
          await diaryService.syncWithSupabase();
          foundEntry = await diaryService.getEntryById(id);
        }
        
        // Last resort: load all entries and find by ID
        if (!foundEntry) {
          console.log('Still not found, searching all entries...');
          const allEntries = await diaryService.getEntries();
          foundEntry = allEntries.find(e => String(e.id) === String(id));
        }
        
        setEntry(foundEntry || null);
      } catch (error) {
        console.error('Error loading entry:', error);
        setEntry(null);
      }
      setLoading(false);
    };

    loadEntry();
  }, [id, user?.id]);

  React.useEffect(() => {
    if (location.search.includes('edit=true')) {
      setEditing(true);
    }
  }, [location.search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded shadow p-10 text-center w-full max-w-3xl mx-auto text-lg">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-base text-gray-700">Loading entry...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded shadow p-10 text-center w-full max-w-3xl mx-auto text-lg">
          <p className="text-base text-gray-700 mb-2">Entry not found.</p>
          <p className="text-sm text-gray-500 mb-4">The entry with ID "{id}" could not be loaded.</p>
          <div className="flex gap-2 justify-center">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700" 
              onClick={() => navigate('/')}
            >
              Go to Home
            </button>
            <button 
              className="px-4 py-2 bg-gray-600 text-white rounded shadow hover:bg-gray-700" 
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded shadow p-10 w-full max-w-3xl mx-auto relative text-lg">
          <button
            className="absolute top-2 right-2 text-red-500 font-bold text-2xl hover:text-red-700"
            onClick={() => setEditing(false)}
          >×</button>
          <h2 className="text-xl font-bold mb-4 text-blue-700 text-center">Edit Entry</h2>
          <DiaryEditor
            initialEntry={entry}
            onSave={(updatedEntry) => { 
              setEntry(updatedEntry);
              setEditing(false); 
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded shadow p-10 w-full max-w-3xl mx-auto relative text-lg">
        <button
          className="absolute top-2 right-2 text-red-500 font-bold text-2xl hover:text-red-700"
          onClick={() => navigate(-1)}
        >×</button>
  <h2 className="text-4xl font-bold mb-4 text-blue-700 text-center">{entry.title}</h2>
  <div className="mb-4 text-lg text-gray-500 text-center">{entry.date} {entry.mood && <span className="ml-2 text-2xl">{entry.mood}</span>}</div>
        {entry.tags && entry.tags.length > 0 && (
          <div className="mb-4 text-base bg-blue-100 px-3 py-2 rounded text-gray-700 inline-block font-bold text-center">{entry.tags.join(', ')}</div>
        )}
  {entry.image && <img src={entry.image} alt="Diary" className="my-6 max-h-80 rounded mx-auto" />}
  <div className="prose prose-lg max-w-none bg-gray-50 p-6 rounded border border-gray-200 text-gray-900 text-center" dangerouslySetInnerHTML={{ __html: entry.content }} />
        <div className="flex flex-col items-center mt-4 gap-2">
          <ExportButtons entry={entry} />
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded shadow text-sm font-semibold"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Entry link copied! You can share it, but only you can view it on this device.');
            }}
          >
            Share Entry
          </button>
          <button
            className="bg-green-600 text-white px-3 py-1 rounded shadow text-sm font-semibold"
            onClick={() => setEditing(true)}
          >
            Edit Entry
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded shadow text-sm font-semibold hover:bg-red-600"
            onClick={async () => {
              if (!window.confirm('Are you sure you want to delete this diary entry? This action cannot be undone.')) {
                return;
              }
              
              try {
                const diaryService = new DiaryDataService(user.id);
                await diaryService.initialize();
                const result = await diaryService.deleteEntry(entry.id);
                
                if (result.success) {
                  // Navigate back to home after successful deletion
                  navigate('/', { replace: true });
                } else {
                  alert('Failed to delete entry: ' + (result.error?.message || 'Unknown error'));
                }
              } catch (error) {
                console.error('Error deleting entry:', error);
                alert('Error deleting entry: ' + error.message);
              }
            }}
          >
            Delete Entry
          </button>
          <BuyMeACoffee inline />
        </div>
      </div>
    </div>
  );
}

export default EntryPage;
