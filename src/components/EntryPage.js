import ExportButtons from './ExportButtons';
import BuyMeACoffee from './BuyMeACoffee';
import DiaryEditor from './DiaryEditor';
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getDiaryEntriesFromSupabase } from '../dbSupabase';
import { useSupabaseUser } from '../useSupabaseUser';
function EntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [entry, setEntry] = React.useState(null);
  const [editing, setEditing] = React.useState(false);
  const user = useSupabaseUser();

  React.useEffect(() => {
    if (user && user.id) {
      getDiaryEntriesFromSupabase(user.id).then(({ data }) => {
        const found = (data || []).find(e => String(e.id) === String(id));
        setEntry(found || null);
      });
    }
  }, [id, user]);

  React.useEffect(() => {
    if (location.search.includes('edit=true')) {
      setEditing(true);
    }
  }, [location.search]);

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded shadow p-10 text-center w-full max-w-3xl mx-auto text-lg">
          <p className="text-base text-gray-700">Entry not found.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow" onClick={() => navigate(-1)}>Go Back</button>
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
            onSave={() => { setEditing(false); navigate(0); }}
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
          <BuyMeACoffee inline />
        </div>
      </div>
    </div>
  );
}

export default EntryPage;
