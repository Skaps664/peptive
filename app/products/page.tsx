'use client';

import { useEffect, useState } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { woocommerce } = await import('@/lib/woocommerce');
        const data = await woocommerce.getProducts({ perPage: 24 });
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="px-6 sm:px-8 lg:px-12 py-12">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Discover our complete range of premium peptides and supplements, carefully formulated to support your health and fitness goals.
        </p>
      </div>

      {/* Filters Section (Placeholder for future enhancement) */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              All Products
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              On Sale
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Best Sellers
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading products...</p>
        </div>
      ) : products.length > 0 ? (
        <>
          <ProductGrid products={products} />
          
          {/* Results Count */}
          <div className="mt-8 text-center text-gray-600">
            Showing {products.length} products
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <svg
            className="w-24 h-24 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Products Found</h2>
          <p className="text-gray-500 mb-6">
            Please configure your WooCommerce store and add products.
          </p>
          <div className="max-w-md mx-auto p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Setup Required:</strong> Make sure your .env.local file is configured with valid WooCommerce API credentials.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
