'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <>
      <footer className="bg-[#1f1f1f] text-white rounded-b-3xl mx-2 mb-2">
        <div className="px-6 sm:px-8 lg:px-12 pt-24 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Left Column - Quick Links & Contact */}
            <div className="space-y-12">
              {/* Quick Links */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4 tracking-wide">QUICK LINKS</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/search" className="text-gray-300 hover:text-white transition-colors">
                      Search
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4 tracking-wide">CONTACT US AT</h3>
                <div className="space-y-2">
                  <a href="tel:+971558225919" className="block underline text-white hover:text-gray-300 transition-colors text-xl">
                    +971 55 822 5919
                  </a>
                  <a href="mailto:peptivepeptides@gmail.com" className="block underline text-white hover:text-gray-300 transition-colors text-xl">
                    peptivepeptides@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Newsletter */}
            <div>
              <h3 className="text-white font-bold text-2xl md:text-3xl mb-6 leading-tight">
                Join the future of biology and get 15% OFF + a FREE copy of our &quot;Peptive Peptide Guide&quot;
              </h3>
              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent border-b-2 border-gray-600 focus:border-white py-3 px-2 text-white placeholder-gray-500 outline-none transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Bar Section */}
      <div className="bg-white py-4">
        <div className="px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <span>©{currentYear} Peptive Pept.</span>
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">
              Privacy policy
            </Link>
          </div>

          {/* Payment Icons */}
          <div className="flex items-center gap-2">
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-gray-900">Pay</span>
            </div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-gray-900">G Pay</span>
            </div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-red-600">JCB</span>
            </div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
              <div className="flex">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 -ml-1"></div>
              </div>
            </div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-blue-900">VISA</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
