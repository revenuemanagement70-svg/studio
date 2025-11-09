import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseProvider } from '@/firebase';
import { PT_Sans, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';

const ptSans = PT_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pt-sans',
  weight: ['400', '700'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});


export const metadata: Metadata = {
  title: "Staylo - India's Most Loved Hotel Booking Platform",
  description: "Staylo — find and book hotels across India. Best price guarantee, instant confirmation and 24/7 support.",
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Staylo",
    "url": "https://staylo.example.com",
    "telephone": "+91-9899308683",
    "sameAs": ["https://www.facebook.com/yourpage","https://www.instagram.com/yourpage"],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    }
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("scroll-smooth", ptSans.variable, spaceGrotesk.variable)}>
      <head>
         <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
