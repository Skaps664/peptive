"use client";

import { useState, useEffect } from 'react';

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('peptive-welcome-popup-seen');
    if (!hasSeenPopup) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Submit to Google Sheets
    console.log('Form submitted:', formData);
    
    // Mark popup as seen
    localStorage.setItem('peptive-welcome-popup-seen', 'true');
    setIsOpen(false);
  };

  const handleClose = () => {
    localStorage.setItem('peptive-welcome-popup-seen', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Language Selector */}
        <div className="absolute top-4 left-4 flex gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              language === 'en' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ar')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              language === 'ar' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            عربي
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="pt-16 px-8 pb-8">
          <h2 className="text-2xl font-bold text-center mb-2">
            FREE Peptide Protocol Map
          </h2>
          <h3 className="text-2xl font-bold text-center mb-4">
            Sent On Whatsapp 🥳📱
          </h3>
          
          <p className="text-center text-gray-600 mb-6">
            Please enter your details to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>

            {/* Phone Input */}
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-3 border border-gray-300 rounded-lg bg-gray-50">
                <span className="text-lg">🇵🇰</span>
                <span className="font-medium">+92</span>
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200 uppercase text-sm"
            >
              CLAIM FREE PROTOCOL & CONTINUE TO SHOP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
