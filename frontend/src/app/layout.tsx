import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "Staylo.in - India's #1 Hotel Booking Platform",
  description: 'Find your perfect stay across India. 15,000+ hotels in 500+ cities. Best price guarantee, instant confirmation, and 24/7 support.',
  keywords: 'hotels, booking, India, accommodation, OYO, Treebo, budget hotels, luxury hotels',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main style={{ paddingTop: '72px', minHeight: '100vh' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}