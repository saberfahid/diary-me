import React, { useState } from 'react';

function SideNote() {
  const [open, setOpen] = useState(false);
  return (
  <div className="fixed bottom-2 left-2 z-[9999] pointer-events-auto sm:bottom-4 sm:left-4">
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded-full shadow-lg hover:bg-blue-600 font-bold text-xs sm:text-base"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close Guide' : 'Open DiaryMe Quick Guide'}
      >
  {open ? 'Close Guide' : 'Guide'}
      </button>
      {open && (
        <div className="mt-2 w-48 sm:w-64 bg-white/95 border border-blue-200 rounded-xl shadow-lg p-2 sm:p-3 text-gray-800 text-xs z-[9999]">
          <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 text-blue-700">Quick Guide</h3>
          <ul className="list-disc ml-3 space-y-1 text-xs">
            <li>Your private, local diary. No account needed. Everything stays on your device.</li>
            <li><span className="font-semibold">Create</span> a new entry with <span className="text-blue-600 font-bold">mood</span>, <span className="text-blue-600 font-bold">tags</span>, and <span className="text-blue-600 font-bold">images</span>.</li>
            <li><span className="font-semibold">Edit</span> or <span className="font-semibold">delete</span> entries anytime.</li>
            <li><span className="font-semibold">Export</span> your diary as Word, PDF, or EPUB.</li>
            <li><span className="font-semibold">100% private</span> – your data never leaves your device.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default SideNote;
