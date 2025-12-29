import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartSidebar from '@/components/cart/CartSidebar';

const inter = Inter({ subsets: ['latin'] });
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta'
});

export const metadata: Metadata = {
  title: 'Peptive - Precision Crafted Research Peptides',
  description: 'High-purity compounds. Independent lab verification. Trusted by researchers seeking uncompromised quality.',
  keywords: 'research peptides, high purity peptides, lab verified compounds, scientific research',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.className} ${jakarta.variable}`}>
        <div className="flex flex-col min-h-screen">
          {/* Announcement Bar */}
          <div className="bg-black text-white text-center py-3 px-4 ">
            <div className="flex items-center justify-center gap-4">
              <button className="text-white hover:text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <p className="text-xs font-medium tracking-wider uppercase px-12">WELCOME TO THE FUTURE OF BIOLOGY</p>
              <button className="text-white hover:text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
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
