"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ResultsContent } from '@/components/results/results-content';
import { HotelCardSkeleton } from '@/components/results/hotel-card-skeleton';

function ResultsPage() {
  const searchParams = useSearchParams();
  const destination = searchParams.get('destination') || '';
  const checkin = searchParams.get('checkin') || '';
  const checkout = searchParams.get('checkout') || '';
  const guests = searchParams.get('guests') || '1';

  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <ResultsContent 
            destination={destination} 
            checkin={checkin} 
            checkout={checkout} 
            guests={guests} 
        />
      </main>
      <Footer />
    </div>
  );
}

// A wrapper component to allow `useSearchParams` to be used within a Suspense boundary.
export default function ResultsPageWithSuspense() {
    return (
        <Suspense fallback={<LoadingState />}>
            <ResultsPage />
        </Suspense>
    )
}

// A full-page loading skeleton to prevent layout shifts and provide immediate feedback.
function LoadingState() {
    return (
        <div className="flex flex-col min-h-screen bg-secondary/30">
            <Header />
            <main className="flex-grow pt-24 pb-12">
                <div className="container mx-auto px-5">
                     <div className="animate-pulse">
                        <div className="h-5 w-40 bg-gray-300 rounded mb-6"></div>
                        <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/3 mb-8"></div>
                        <div className="grid grid-cols-1 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <HotelCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
