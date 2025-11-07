import ExportButtons from './ExportButtons';
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
  const [deleting, setDeleting] = React.useState(false);
  const user = useSupabaseUser();

  // Auto-redirect when entry is not found (after loading is complete)
  React.useEffect(() => {
    if (!entry && !loading && !deleting) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [entry, loading, deleting, navigate]);

  React.useEffect(() => {
    const loadEntry = async () => {
      if (!user?.id || !id || deleting) {
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
  }, [id, user?.id, deleting]);

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

  if (!entry && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-blue-100 to-purple-200">
        <div className="bg-white/95 rounded-3xl shadow-2xl p-8 text-center max-w-md mx-4">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Entry Not Found</h2>
          <p className="text-gray-600 mb-2">This diary entry couldn't be loaded.</p>
          <p className="text-sm text-gray-500 mb-4">It may have been deleted or the link is invalid.</p>
          <p className="text-xs text-blue-500 mb-6">Redirecting to timeline in 3 seconds...</p>
          <div className="flex gap-3 justify-center">
            <button 
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition-all" 
              onClick={() => navigate('/')}
            >
              Go Now
            </button>
            <button 
              className="px-6 py-2 bg-gray-500 text-white rounded-full font-semibold shadow hover:bg-gray-600 transition-all" 
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
        <div className="mt-8 space-y-4">
          {/* Export Section */}
          <div className="flex justify-center">
            <ExportButtons entry={entry} />
          </div>
          
          {/* Action Buttons - Cute arrangement */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Entry link copied! You can share it, but only you can view it on this device.');
              }}
            >
              📋 Share Entry
            </button>
            
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105"
              onClick={() => setEditing(true)}
            >
              ✏️ Edit Entry
            </button>
            
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={deleting}
              onClick={async () => {
                if (!window.confirm('Are you sure you want to delete this diary entry? This action cannot be undone.')) {
                  return;
                }
                
                setDeleting(true);
                
                try {
                  const diaryService = new DiaryDataService(user.id);
                  await diaryService.initialize();
                  const result = await diaryService.deleteEntry(entry.id);
                  
                  if (result.success) {
                    // Navigate after successful deletion
                    navigate('/', { replace: true });
                  } else {
                    console.error('Failed to delete entry:', result.error);
                    setDeleting(false);
                    alert('Failed to delete entry. Please try again.');
                  }
                } catch (error) {
                  console.error('Error deleting entry:', error);
                  setDeleting(false);
                  alert('Error deleting entry. Please try again.');
                }
              }}
            >
              🗑️ {deleting ? 'Deleting...' : 'Delete Entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntryPage;
