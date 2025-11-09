'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { HotelCard } from '@/components/results/hotel-card';
import { HotelCardSkeleton } from '@/components/results/hotel-card-skeleton';
import { Button } from '../ui/button';
import { useHotels } from '@/firebase/firestore/use-hotels';
import type { hotel as Hotel } from '@/lib/types';

interface ResultsContentProps {
  destination: string;
  checkin: string;
  checkout: string;
  guests: string;
  budget: string;
  travelStyle: string;
}

export function ResultsContent({ destination, checkin, checkout, guests, budget, travelStyle }: ResultsContentProps) {
  const { hotels, loading, error } = useHotels();
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    if (!loading && hotels) {
      if (!destination) {
        setFilteredHotels(hotels);
        return;
      }
      const destinationLower = destination.toLowerCase();
      // Exact match on city
      const results = hotels.filter(hotel => 
        hotel.city.toLowerCase() === destinationLower
      );
      setFilteredHotels(results);
    }
  }, [loading, hotels, destination]);

  const getSubheading = () => {
    const parts = [];
    if (checkin && checkout) parts.push(`${checkin} to ${checkout}`);
    if (guests) parts.push(`${guests} Guest(s)`);
    if (budget) parts.push(`Budget: ${budget}`);
    if (travelStyle) parts.push(`Style: ${travelStyle}`);
    return parts.length > 0 ? parts.join(' • ') : 'Showing all properties';
  };
  
  const heading = destination ? `Results for "${destination}"` : "All Properties";

  return (
    <div className="container mx-auto px-5">
      <Button asChild variant="link" className="p-0 h-auto inline-flex items-center gap-2 text-primary font-bold mb-6 hover:underline">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </Button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">{heading}</h1>
        <p className="text-muted-foreground capitalize">
          {getSubheading()}
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => <HotelCardSkeleton key={i} />)}
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <p className="text-destructive font-semibold">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4">
          {filteredHotels.length > 0 ? (
             filteredHotels.map((hotel, index) => (
              <HotelCard key={hotel.id || hotel.name + index} hotel={hotel} source="results" />
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <p className="text-muted-foreground font-semibold text-lg">No hotels found.</p>
              <p className="text-muted-foreground mt-2">Try adjusting your search criteria or check back later.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
