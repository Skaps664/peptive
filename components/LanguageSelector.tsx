'use client';

import { useState } from 'react';

const languages = [
  'English',
  ' العربية',
];



export default function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isOpen, setIsOpen] = useState(false);
  let closeTimeout: NodeJS.Timeout | null = null;

  const handleMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    closeTimeout = setTimeout(() => {
      setIsOpen(false);
    }, 1000); // 1 second delay
  };

  return (
    <div className="relative" style={{ display: 'inline-block' }}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          type="button"
          className={`flex items-center gap-2 bg-[#1f1f1f] text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-all duration-300 min-w-[120px]`}
          tabIndex={0}
        >
          
          <span className="text-xs flex-1 text-left">{selectedLanguage}</span>
          <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        <div
          className={`absolute top-full left-0 mt-2 bg-[#1f1f1f] text-white rounded-b-2xl shadow-2xl overflow-hidden z-[100] min-w-[120px] transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        >
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setSelectedLanguage(lang);
                setIsOpen(false);
              }}
              className={`w-full text-left px-5 py-3 text-sm font-normal focus:outline-none transition-all duration-300 relative ${selectedLanguage === lang ? 'font-semibold' : ''}`}
              style={{ background: 'none' }}
            >
              <span className="relative group inline-block w-full">
                <span className="transition-colors duration-300">{lang}</span>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
