'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/types';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch products on client side to avoid build errors
    async function loadProducts() {
      try {
        const { woocommerce } = await import('@/lib/woocommerce');
        const products = await woocommerce.getFeaturedProducts(4);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    loadProducts();
  }, []);

  const faqs = [
    {
      question: "Where can I buy research peptides online?",
      answer: "You can purchase research peptides directly from Peptive Peptides. We offer high-quality, lab-verified peptides shipped directly from our Swiss facility to your location."
    },
    {
      question: "What are research peptides?",
      answer: "Research peptides are short chains of amino acids used in scientific research and studies. They are designed for laboratory and research purposes only."
    },
    {
      question: "How do I know if a peptide supplier is trustworthy?",
      answer: "Look for suppliers who provide third-party lab testing, transparent sourcing, and detailed product information. At Peptive Peptides, we provide independent lab verification for all our products."
    },
    {
      question: "What should I look for when buying peptides online?",
      answer: "Key factors include purity levels, third-party testing certificates, proper storage and handling, transparent pricing, and direct communication with the supplier."
    },
    {
      question: "Can I buy peptides without a prescription?",
      answer: "Research peptides are sold for research purposes only. Please check your local regulations regarding peptide purchases and usage."
    },
    {
      question: "How are research peptides stored and handled?",
      answer: "Our peptides are stored in temperature-controlled facilities and shipped with appropriate cooling to maintain stability. Upon receipt, they should be refrigerated immediately."
    },
    {
      question: "What are the most popular research peptides?",
      answer: "Popular research peptides include various sequences used in longevity, performance, and recovery research. Browse our catalog to see our full range of available peptides."
    },
    {
      question: "Are research peptides shipped internationally?",
      answer: "Yes, we ship internationally from our Swiss facility. Shipping times and regulations vary by country. Contact us for specific information about your location."
    },
    {
      question: "How quickly will I receive my peptide order?",
      answer: "Delivery times vary based on your location. Domestic orders typically arrive within 3-5 business days, while international orders may take 7-14 business days."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              <p className="text-yellow-500 text-sm font-medium tracking-widest mb-4 uppercase">
                Science They Can&apos;t Silent
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Precision Crafted Research Peptides
              </h1>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                High-purity compounds. Independent lab verification. Trusted by researchers seeking uncompromised quality.
              </p>
              <Link href="/products">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8">
                  Shop All
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
              </Link>
            </div>

            {/* Right Content - Parallax Card */}
            <div className="relative">
              <div 
                className="relative transform transition-transform duration-300"
                style={{
                  transform: `translateY(${scrollY * 0.1}px) rotateX(${scrollY * 0.02}deg)`
                }}
              >
                {/* Card with gradient background */}
                <div className="relative w-full aspect-[3/4] max-w-sm mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-gray-700/50 to-gray-900 rounded-3xl shadow-2xl backdrop-blur-sm border border-gray-700/50"
                    style={{
                      transform: `perspective(1000px) rotateY(${scrollY * 0.02}deg)`
                    }}
                  >
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent rounded-3xl" />
                    
                    {/* Placeholder for product image */}
                    <div className="absolute inset-4 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-yellow-500/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                          <span className="text-4xl font-bold text-yellow-500">肽</span>
                        </div>
                        <p className="text-gray-400 text-sm">Premium Peptides</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    

    {/* Brand Statement Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Research{' '}
            <span className="inline-flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-lg mx-2">
              <span className="text-white font-bold text-xl">肽</span>
            </span>{' '}
            Starts with
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            <span className="border-b-4 border-yellow-500 pb-1">Peptive</span>
          </h2>
        </div>
      </section>
    
    
      {/* Trending Research Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trending Research
            </h2>
            <div className="flex gap-2">
              <button 
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                aria-label="Previous"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                aria-label="Next"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Product Carousel */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-6 pb-4">
              {/* Product Card 1 */}
              <div className="flex-none w-72">
                <div className="bg-gray-100 rounded-2xl p-6 relative group hover:shadow-lg transition-shadow">
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Save 29%
                    </span>
                    <span className="bg-gray-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Sold Out
                    </span>
                  </div>

                  {/* Product Image */}
                  <div className="aspect-square flex items-center justify-center mb-4">
                    <div className="w-32 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative">
                      <div className="absolute top-2 left-2 w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-xs">肽</span>
                      </div>
                      <span className="text-yellow-500 font-bold text-lg">PEPTIVE</span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">PEPT</p>
                    <h3 className="font-semibold text-gray-900 mb-2">Ret 15mg</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">Dhs. 999.00</span>
                      <span className="text-gray-400 text-sm line-through">Dhs. 1,399.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Card 2 */}
              <div className="flex-none w-72">
                <div className="bg-gray-100 rounded-2xl p-6 relative group hover:shadow-lg transition-shadow">
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Save 26%
                    </span>
                    <span className="bg-gray-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Sold Out
                    </span>
                  </div>
                  <div className="aspect-square flex items-center justify-center mb-4">
                    <div className="w-48 h-32 bg-purple-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-yellow-500 rounded-md mx-auto mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">肽</span>
                        </div>
                        <span className="text-purple-900 font-bold text-sm">RETATRUTIDE</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">PEPT</p>
                    <h3 className="font-semibold text-gray-900 mb-2">Ret Pen 12mg</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">Dhs. 1,399.00</span>
                      <span className="text-gray-400 text-sm line-through">Dhs. 1,899.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Card 3 */}
              <div className="flex-none w-72">
                <div className="bg-gray-100 rounded-2xl p-6 relative group hover:shadow-lg transition-shadow">
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Save 30%
                    </span>
                    <span className="bg-gray-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Sold Out
                    </span>
                  </div>
                  <div className="aspect-square flex items-center justify-center mb-4">
                    <div className="w-32 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative">
                      <div className="absolute top-2 left-2 w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-xs">肽</span>
                      </div>
                      <span className="text-yellow-500 font-bold text-lg">PEPTIVE</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">PEPT</p>
                    <h3 className="font-semibold text-gray-900 mb-2">CJC/Ipamorelin 5/5mg</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">Dhs. 699.00</span>
                      <span className="text-gray-400 text-sm line-through">Dhs. 999.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Card 4 */}
              <div className="flex-none w-72">
                <div className="bg-gray-100 rounded-2xl p-6 relative group hover:shadow-lg transition-shadow">
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Save 20%
                    </span>
                    <span className="bg-gray-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Sold Out
                    </span>
                  </div>
                  <div className="aspect-square flex items-center justify-center mb-4">
                    <div className="w-32 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative">
                      <div className="absolute top-2 left-2 w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-xs">肽</span>
                      </div>
                      <span className="text-yellow-500 font-bold text-lg">PEPTIVE</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">PEPT</p>
                    <h3 className="font-semibold text-gray-900 mb-2">TB500 + BPC-157 (10/10mg)</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">Dhs. 799.00</span>
                      <span className="text-gray-400 text-sm line-through">Dhs. 999.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Card 5 */}
              <div className="flex-none w-72">
                <div className="bg-gray-100 rounded-2xl p-6 relative group hover:shadow-lg transition-shadow">
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Save 33%
                    </span>
                    <span className="bg-gray-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Sold Out
                    </span>
                  </div>
                  <div className="aspect-square flex items-center justify-center mb-4">
                    <div className="flex gap-2">
                      <div className="w-24 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative">
                        <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-xs">肽</span>
                        </div>
                        <span className="text-yellow-500 font-bold text-xs">PEPTIVE</span>
                      </div>
                      <div className="w-24 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative">
                        <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-xs">肽</span>
                        </div>
                        <span className="text-yellow-500 font-bold text-xs">PEPTIVE</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">PEPT</p>
                    <h3 className="font-semibold text-gray-900 mb-2">Rapid Fat Loss Stack</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">Dhs. 1,299.00</span>
                      <span className="text-gray-400 text-sm line-through">Dhs. 1,899.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Build Your Stack Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Build Your Stack
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl">
              The choice is yours. With our stack builder, you can select any combination from our range of products.
            </p>
          </div>

          {/* Stack Builder Grid */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Stack Cards Container */}
            <div className="lg:col-span-3 grid md:grid-cols-3 gap-6">
              {/* Recomp Stack Card */}
              <div className="bg-gray-100 rounded-2xl p-6 relative">
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Save 31%
                  </span>
                  <span className="bg-gray-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Sold Out
                  </span>
                </div>

                {/* Product Images */}
                <div className="aspect-square flex items-center justify-center mb-4">
                  <div className="flex gap-2 items-end">
                    <div className="w-20 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative shadow-lg">
                      <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-xs">肽</span>
                      </div>
                      <span className="text-yellow-500 font-bold text-xs transform -rotate-90">PEPTIVE</span>
                    </div>
                    <div className="w-20 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative shadow-lg">
                      <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-xs">肽</span>
                      </div>
                      <span className="text-yellow-500 font-bold text-xs transform -rotate-90">PEPTIVE</span>
                    </div>
                    <div className="w-20 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative shadow-lg">
                      <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-xs">肽</span>
                      </div>
                      <span className="text-yellow-500 font-bold text-xs transform -rotate-90">PEPTIVE</span>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mb-4">
                  <p className="text-gray-500 text-xs font-medium mb-1">PEPT</p>
                  <h3 className="font-semibold text-gray-900 mb-2">Recomp Stack</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold">Dhs. 1,999.00</span>
                    <span className="text-gray-400 text-sm line-through">Dhs. 2,999.00</span>
                  </div>
                </div>

                {/* Sold Out Button */}
                <button className="w-full bg-gray-600 text-white font-medium py-3 rounded-full hover:bg-gray-700 transition-colors cursor-not-allowed" disabled>
                  Sold Out
                </button>
              </div>

              {/* Rapid Fat Loss Stack Card */}
              <div className="bg-gray-100 rounded-2xl p-6 relative">
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Save 33%
                  </span>
                  <span className="bg-gray-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Sold Out
                  </span>
                </div>
                <div className="aspect-square flex items-center justify-center mb-4">
                  <div className="flex gap-2 items-end">
                    <div className="w-20 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative shadow-lg">
                      <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-xs">肽</span>
                      </div>
                      <span className="text-yellow-500 font-bold text-xs transform -rotate-90">PEPTIVE</span>
                    </div>
                    <div className="w-20 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative shadow-lg">
                      <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-xs">肽</span>
                      </div>
                      <span className="text-yellow-500 font-bold text-xs transform -rotate-90">PEPTIVE</span>
                    </div>
                    <div className="w-20 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative shadow-lg">
                      <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-xs">肽</span>
                      </div>
                      <span className="text-yellow-500 font-bold text-xs transform -rotate-90">PEPTIVE</span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-gray-500 text-xs font-medium mb-1">PEPT</p>
                  <h3 className="font-semibold text-gray-900 mb-2">Rapid Fat Loss Stack</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold">Dhs. 1,999.00</span>
                    <span className="text-gray-400 text-sm line-through">Dhs. 2,999.00</span>
                  </div>
                </div>
                <button className="w-full bg-gray-600 text-white font-medium py-3 rounded-full hover:bg-gray-700 transition-colors cursor-not-allowed" disabled>
                  Sold Out
                </button>
              </div>

              {/* Performance Stack Card */}
              <div className="bg-gray-100 rounded-2xl p-6 relative">
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Save 30%
                  </span>
                  <span className="bg-gray-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Sold Out
                  </span>
                </div>
                <div className="aspect-square flex items-center justify-center mb-4">
                  <div className="flex gap-2 items-end">
                    <div className="w-24 h-36 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative shadow-lg">
                      <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-xs">肽</span>
                      </div>
                      <span className="text-yellow-500 font-bold text-xs transform -rotate-90">PEPTIVE</span>
                    </div>
                    <div className="w-24 h-36 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative shadow-lg">
                      <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold text-xs">肽</span>
                      </div>
                      <span className="text-yellow-500 font-bold text-xs transform -rotate-90">PEPTIVE</span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-gray-500 text-xs font-medium mb-1">PEPT</p>
                  <h3 className="font-semibold text-gray-900 mb-2">Performance Stack</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold">Dhs. 1,399.00</span>
                    <span className="text-gray-400 text-sm line-through">Dhs. 1,999.00</span>
                  </div>
                </div>
                <button className="w-full bg-gray-600 text-white font-medium py-3 rounded-full hover:bg-gray-700 transition-colors cursor-not-allowed" disabled>
                  Sold Out
                </button>
              </div>
            </div>

            {/* Your Stack Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 sticky top-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Your Stack</h3>
                
                {/* Total Section */}
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                  <span className="text-gray-900 font-medium">Total</span>
                  <span className="text-gray-900 font-semibold">Dhs. 0.00 AED</span>
                </div>

                {/* Add to Cart Button */}
                <button className="w-full bg-gray-400 text-white font-medium py-4 rounded-full cursor-not-allowed" disabled>
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Peptive Peptides Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            Why Peptive Peptides?
          </h2>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Precision-Focused Card */}
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Precision-Focused</h3>
              <p className="text-gray-600 leading-relaxed">
                Small-batch synthesis with exact amino-acid sequencing.
              </p>
            </div>

            {/* No Middlemen Card */}
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Middlemen</h3>
              <p className="text-gray-600 leading-relaxed">
                Direct from Swiss facility to your fridge.
              </p>
            </div>

            {/* Boldly Disruptive Card */}
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Boldly Disruptive</h3>
              <p className="text-gray-600 leading-relaxed">
                We say what legacy pharma won&apos;t: better biology is DIY.
              </p>
            </div>
          </div>

          {/* Marquee Section */}
          <div className="relative overflow-hidden bg-white py-6 border-t border-b border-gray-200">
            <div className="flex animate-marquee whitespace-nowrap">
              <div className="flex items-center gap-16 px-8">
                <span className="text-4xl md:text-5xl font-bold text-gray-900">PEPTIVE PEPTIDES</span>
                <span className="text-4xl md:text-5xl font-light text-gray-400">Research Grade Peptides</span>
                <span className="text-4xl md:text-5xl font-bold text-gray-900">PEPTIVE PEPTIDES</span>
                <span className="text-4xl md:text-5xl font-light text-gray-400">Research Grade Peptides</span>
                <span className="text-4xl md:text-5xl font-bold text-gray-900">PEPTIVE PEPTIDES</span>
                <span className="text-4xl md:text-5xl font-light text-gray-400">Research Grade Peptides</span>
              </div>
              <div className="flex items-center gap-16 px-8">
                <span className="text-4xl md:text-5xl font-bold text-gray-900">PEPTIVE PEPTIDES</span>
                <span className="text-4xl md:text-5xl font-light text-gray-400">Research Grade Peptides</span>
                <span className="text-4xl md:text-5xl font-bold text-gray-900">PEPTIVE PEPTIDES</span>
                <span className="text-4xl md:text-5xl font-light text-gray-400">Research Grade Peptides</span>
                <span className="text-4xl md:text-5xl font-bold text-gray-900">PEPTIVE PEPTIDES</span>
                <span className="text-4xl md:text-5xl font-light text-gray-400">Research Grade Peptides</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            FAQs
          </h2>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-8">
                    {faq.question}
                  </span>
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    {openFaqIndex === index ? (
                      <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </span>
                </button>
                
                {openFaqIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/yourphonenumber"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 left-8 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-50"
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
      
    </div>
  );
}
