'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function InstantAuthenticationPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[70vh] bg-white flex items-center justify-center px-6 py-12">
      <div className="text-center max-w-4xl mx-auto">
        {/* Main Heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-8">
          Instant Authentication
        </h1>

        {/* Checkmark Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-black rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 md:w-12 md:h-12 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl font-medium text-black">
          The Mark of True Peptive.
        </p>
      </div>
    </div>
  );
}
