'use client';

import { useState } from 'react';

const countries = [
  'Bahrain',
  'Kuwait',
  'Oman',
  'Qatar',
  'Saudi Arabia',
  'United Arab Emirates',
  'United States',
];

export default function CountrySelector() {
  const [selectedCountry, setSelectedCountry] = useState('United Arab Emirates');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">{selectedCountry}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 bg-white text-gray-900 rounded-lg shadow-xl overflow-hidden z-20 min-w-[200px]">
            {countries.map((country) => (
              <button
                key={country}
                onClick={() => {
                  setSelectedCountry(country);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors ${
                  selectedCountry === country ? 'bg-gray-50 font-medium' : ''
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
