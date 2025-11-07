import React from 'react';

const BuyMeACoffee = () => (
  <a
    href={process.env.REACT_APP_SUPPORT_LINK || "https://hellomydude.gumroad.com/coffee"}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-2 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-1 text-xs sm:text-base sm:py-2 sm:px-4"
    style={{ boxShadow: '0 2px 8px rgba(255,193,7,0.18)', minWidth: '32px', maxWidth: '120px' }}
  >
  <span role="img" aria-label="coffee">☕</span>
  </a>
);

export default BuyMeACoffee;
