'use client';

import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-5 lg:gap-5 xl:gap-5 2xl:gap-6 p-6 lg:p-6 xl:p-6 2xl:p-7 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
      {/* Product Image */}
      <div className="relative w-24 h-24 lg:w-24 xl:w-24 2xl:w-28 2xl:h-28 flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-md">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
        <p className="text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-2xl font-bold text-gray-900 mb-4">{formatPrice(item.price)}</p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 lg:gap-3 xl:gap-3 2xl:gap-4">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-9 h-9 lg:w-9 xl:w-9 2xl:w-10 2xl:h-10 flex items-center justify-center border-2 border-gray-300 rounded-xl hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all font-bold text-lg"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-xl font-bold w-10 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-9 h-9 lg:w-9 xl:w-9 2xl:w-10 2xl:h-10 flex items-center justify-center border-2 border-gray-300 rounded-xl hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all font-bold text-lg"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Remove & Subtotal */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeItem(item.id)}
          className="text-base md:text-lg lg:text-lg xl:text-lg font-bold text-red-600 hover:text-red-700 hover:underline transition-all"
          aria-label="Remove item"
        >
          Remove
        </button>
        <p className="text-lg md:text-xl lg:text-xl xl:text-2xl font-extrabold text-gray-900">
          {formatPrice(parseFloat(item.price) * item.quantity)}
        </p>
      </div>
    </div>
  );
}
