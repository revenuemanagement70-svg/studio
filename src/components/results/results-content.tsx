'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { HotelCard } from '@/components/results/hotel-card';
import { HotelCardSkeleton } from '@/components/results/hotel-card-skeleton';
import { Button } from '../ui/button';
import { useHotels } from '@/firebase/firestore/use-hotels';
import type { hotel as Hotel } from '@/lib/types';
import { ResultsFilterSidebar } from './results-filter-sidebar';

interface ResultsContentProps {
  destination: string;
  checkin: string;
  checkout: string;
  guests: string;
}

export function ResultsContent({ destination, checkin, checkout, guests }: ResultsContentProps) {
  const { hotels, loading, error } = useHotels();

  const [priceFilter, setPriceFilter] = useState<number>(15000);
  const [ratingFilter, setRatingFilter] = useState<number[]>([]);
  const [amenitiesFilter, setAmenitiesFilter] = useState<string[]>([]);


  const filteredHotels = useMemo(() => {
    let results = hotels;

    if (destination) {
      const destinationLower = destination.toLowerCase();
      results = results.filter(hotel => hotel.city.toLowerCase() === destinationLower);
    }
    
    // Apply price filter
    results = results.filter(hotel => hotel.price <= priceFilter);

    // Apply rating filter
    if (ratingFilter.length > 0) {
      results = results.filter(hotel => ratingFilter.some(r => hotel.rating >= r && hotel.rating < r + 1));
    }
    
    // Apply amenities filter
    if (amenitiesFilter.length > 0) {
      results = results.filter(hotel => amenitiesFilter.every(amenity => hotel.amenities.includes(amenity)));
    }

    return results;
  }, [hotels, destination, priceFilter, ratingFilter, amenitiesFilter]);

  const getSubheading = () => {
    const parts = [];
    if (checkin && checkout) parts.push(`${checkin} to ${checkout}`);
    if (guests) parts.push(`${guests} Guest(s)`);
    return parts.length > 0 ? parts.join(' • ') : 'Showing all available properties';
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
           <ResultsFilterSidebar 
            price={priceFilter}
            onPriceChange={setPriceFilter}
            ratings={ratingFilter}
            onRatingChange={setRatingFilter}
            amenities={amenitiesFilter}
            onAmenitiesChange={setAmenitiesFilter}
           />
        </aside>

        <main className="lg:col-span-3">
           {loading && (
            <div className="grid grid-cols-1 gap-4">
              {[...Array(3)].map((_, i) => <HotelCardSkeleton key={i} />)}
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <p className="text-destructive font-semibold">{error instanceof Error ? error.message : "An unknown error occurred"}</p>
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
        </main>
      </div>
    </div>
  );
}
