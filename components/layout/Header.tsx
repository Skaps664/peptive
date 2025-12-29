'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const toggleCart = useCartStore((state) => state.toggleCart);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'All Peptides', href: '/products' },
    { name: 'Dosage Calculator', href: '/calculator' },
    { name: 'Peptive Ai', href: 'https://ai.peptivepeptides.com/' },
  ];

  return (
    <header className="bg-white sticky top-2 z-50 rounded-t-3xl mx-2">
      <nav className="px-6 sm:px-8 lg:px-12 ">
        <div className="flex justify-between items-center h-32">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">肽</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-3 text-gray-900 text-sm font-medium rounded-full overflow-hidden group transition-colors"
              >
                <span className="absolute inset-0 bg-black origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-full"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-400">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Cart & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* User Icon */}
            <button className="p-2 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:animate-wiggle" aria-label="User account">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:animate-wiggle"
              aria-label="Shopping cart"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
