'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
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
    <div>
      {/* Banner Section */}
      <section className="pb-0">
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden rounded-t-3xl mx-2 min-h-[300px] md:min-h-[400px] flex items-center">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('/collection-banner.jpg')",
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-black/80" />
          
          {/* Content */}
          <div className="relative px-6 sm:px-8 lg:px-12 pt-32 w-full">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center gap-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li className="text-gray-500">/</li>
                <li className="text-white font-medium">All Peptides</li>
              </ol>
            </nav>
            
            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold text-white">
              All Peptides
            </h1>
            
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="px-6 sm:px-8 lg:px-12 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
                  {/* Badges */}
                  {(product.onSale || product.stockStatus !== 'instock') && (
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                      {product.onSale && product.regularPrice && product.salePrice && (
                        <span className="bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                          Save {Math.round(((parseFloat(product.regularPrice) - parseFloat(product.salePrice)) / parseFloat(product.regularPrice)) * 100)}%
                        </span>
                      )}
                      {product.stockStatus !== 'instock' && (
                        <span className="bg-gray-400 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                          Sold Out
                        </span>
                      )}
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <>
                        <img 
                          src={product.images[0] || '/placeholder.jpg'} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:hidden" 
                        />
                        <img 
                          src={product.images[1] || product.images[0] || '/placeholder.jpg'} 
                          alt={product.name} 
                          className="w-full h-full object-cover hidden group-hover:block" 
                        />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="bg-gray-50 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-gray-500 text-xs mb-1 uppercase tracking-wide">PEPT</p>
                        <h3 className="text-gray-900 text-base">{product.name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-red-500 font-semibold text-base">
                          Dhs. {product.price}
                        </p>
                        {product.onSale && product.regularPrice && (
                          <p className="text-gray-400 text-sm line-through">
                            Dhs. {product.regularPrice}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* View Details Button */}
                    <Link 
                      href={`/products/${product.slug}`}
                      className={`block w-full text-center py-3 rounded-full font-semibold transition-colors ${
                        product.stockStatus === 'instock'
                          ? 'bg-gray-900 text-white hover:bg-gray-800'
                          : 'bg-gray-600 text-white cursor-not-allowed'
                      }`}
                    >
                      {product.stockStatus === 'instock' ? 'View Details' : 'Sold Out'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Results Count */}
            <div className="mt-12 text-center text-gray-600">
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
            <p className="text-gray-500">
              Check back soon for new products.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
