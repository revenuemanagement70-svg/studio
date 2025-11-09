import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseProvider } from '@/firebase';

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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
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
