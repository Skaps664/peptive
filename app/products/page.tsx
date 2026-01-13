'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Product } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';
import { wordpress } from '@/lib/wordpress';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

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

    // Fetch banner image
    wordpress.getPageBySlug('site-page').then(page => {
      console.log('Site page:', page);
      if (page?.acf?.all_products_image) {
        const banner = typeof page.acf.all_products_image === 'string' ? page.acf.all_products_image : page.acf.all_products_image?.url;
        if (banner) setBannerImage(banner);
      }
    }).catch(console.error);
  }, []);

  return (
    <div>
      {/* Banner Section */}
      <section className="pb-0">
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden rounded-t-3xl mx-2 min-h-[300px] md:min-h-[400px] flex items-center">
          {/* Background Image */}
          {bannerImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{
                backgroundImage: `url(${bannerImage})`,
              }}
            />
          )}
          
          {/* Geometric pattern background (fallback) */}
          {!bannerImage && (
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%), 
                                 radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2%, transparent 0%)`,
                backgroundSize: '100px 100px'
              }}></div>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-black/80" />
          
          {/* Content */}
          <div className="relative px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 pt-32 w-full">
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
      <section className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <>
            {/* Products Grid */}
            <ProductGrid products={products} />
            
            {/* Results Count */}
            <div className="mt-12 text-center text-gray-600">
              Showing {products.length} {products.length === 1 ? 'product' : 'products'}
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
