'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import CartItem from './CartItem';
import Button from '@/components/ui/Button';

export default function CartSidebar() {
  const { items, isOpen, closeCart, getSubtotal } = useCartStore();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const subtotal = getSubtotal();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-all duration-500 ease-in-out z-40 ${
          isOpen ? 'bg-opacity-50 visible' : 'bg-opacity-0 invisible'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-full w-full sm:w-[90%] md:w-[70%] lg:w-[40%] xl:w-[30%] bg-white shadow-2xl z-50 flex flex-col transition-all duration-500 ease-in-out rounded-l-[2rem] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900">Cart</h2>
          <button
            onClick={closeCart}
            className="text-gray-900 hover:text-gray-600 transition-colors p-1"
            aria-label="Close cart"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="mb-12 max-w-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Your cart is currently empty.
                </h3>
                <p className="text-base text-gray-600 mb-1">Not sure where to start?</p>
                <p className="text-base text-gray-600">Try these collections:</p>
              </div>
              <button
                onClick={closeCart}
                className="inline-flex items-center gap-3 text-base font-medium text-gray-900 hover:gap-4 transition-all group"
              >
                <span>Continue shopping</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-8 space-y-5 bg-gray-50">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-base text-gray-700 font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-gray-900">{formatPrice(subtotal)}</span>
            </div>

            <p className="text-sm text-gray-500">
              Shipping and taxes calculated at checkout
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <Link href="/checkout" onClick={closeCart} className="block">
                <button className="w-full bg-gray-900 text-white font-semibold py-4 text-base rounded-full hover:bg-gray-800 transition-colors">
                  Proceed to Checkout
                </button>
              </Link>
              <Link href="/cart" onClick={closeCart} className="block">
                <button className="w-full border-2 border-gray-900 text-gray-900 font-semibold py-4 text-base rounded-full hover:bg-gray-50 transition-colors">
                  View Cart
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
