import React from 'react';

function EntryModal({ entry, onClose }) {
  if (!entry) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative">
        <button
          className="absolute top-4 right-4 text-red-500 font-bold text-xl hover:text-red-700"
          onClick={onClose}
        >×</button>
        <h2 className="text-2xl font-bold mb-2 text-blue-700">{entry.title}</h2>
        <div className="mb-2 text-gray-500">{entry.date} {entry.mood && <span className="ml-2">{entry.mood}</span>}</div>
        {entry.tags && entry.tags.length > 0 && (
          <div className="mb-2 text-xs bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 px-2 py-1 rounded-full text-gray-700 inline-block">{entry.tags.join(', ')}</div>
        )}
        {entry.image && <img src={entry.image} alt="Diary" className="my-3 max-h-40 rounded-xl shadow" />}
        <div className="prose max-w-none bg-white/60 p-3 rounded-lg border border-gray-200" dangerouslySetInnerHTML={{ __html: entry.content }} />
      </div>
    </div>
  );
}

export default EntryModal;
