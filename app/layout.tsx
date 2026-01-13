import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartSidebar from '@/components/cart/CartSidebar';
import CountrySelector from '@/components/CountrySelector';
import LanguageSelector from '@/components/LanguageSelector';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Peptive - Precision Crafted Research Peptides',
  description: 'High-purity compounds. Independent lab verification. Trusted by researchers seeking uncompromised quality.',
  keywords: 'research peptides, high purity peptides, lab verified compounds, scientific research',
  icons: {
    icon: '/logo.avif',
    shortcut: '/logo.avif',
    apple: '/logo.avif',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable}`}>
        <div className="flex flex-col min-h-screen">
          {/* Announcement Bar */}
          <div className="bg-[#1f1f1f] text-white py-2 px-6 sm:px-8 lg:px-12 relative z-50">
            <div className="flex items-center justify-between">
              {/* Country Selector - Left */}
              <div className="flex-shrink-0 flex items-center gap-2">
                <CountrySelector />
                <LanguageSelector />
              </div>
              
              {/* Announcement Message - Center */}
              <div className="flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2">
                
                <p className="text-xs font-medium tracking-wider uppercase px-4">GET 10% OFF Code: "PEP10"</p>
                
              </div>
            </div>
          </div>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartSidebar />
        </div>
      </body>
    </html>
  );
}
