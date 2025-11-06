import React, { useState } from 'react';

const MobileMenu = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 px-4 py-3 shadow-lg">
        <span className="text-2xl font-bold text-white">Diary Me</span>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-blue-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="bg-white/95 shadow-lg rounded-b-2xl px-6 py-4 flex flex-col gap-4 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
