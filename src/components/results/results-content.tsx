'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { HotelCard } from '@/components/results/hotel-card';
import { HotelCardSkeleton } from '@/components/results/hotel-card-skeleton';
import { getHotelRecommendations } from '@/app/lib/actions';
import type { PersonalizedHotelRecommendationsOutput } from '@/ai/flows/personalized-hotel-recommendations';
import { Button } from '../ui/button';

interface ResultsContentProps {
  destination: string;
  checkin: string;
  checkout: string;
  guests: string;
  budget: string;
  travelStyle: string;
}

export function ResultsContent({ destination, checkin, checkout, guests, budget, travelStyle }: ResultsContentProps) {
  const [recommendations, setRecommendations] = useState<PersonalizedHotelRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!destination) {
        setError('Please provide a destination to search.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const result = await getHotelRecommendations({
          destination,
          checkInDate: checkin,
          checkOutDate: checkout,
          numberOfGuests: parseInt(guests, 10) || 1,
          budget: budget,
          travelStyle: travelStyle,
        });
        setRecommendations(result);
      } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(`Sorry, we couldn't fetch recommendations. ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [destination, checkin, checkout, guests, budget, travelStyle]);

  const getSubheading = () => {
    const parts = [];
    if (checkin && checkout) parts.push(`${checkin} to ${checkout}`);
    if (guests) parts.push(`${guests} Guest(s)`);
    if (budget) parts.push(`Budget: ${budget}`);
    if (travelStyle) parts.push(`Style: ${travelStyle}`);
    return parts.length > 0 ? parts.join(' • ') : 'Any dates • Any guests';
  };

  return (
    <div className="container mx-auto px-5">
      <Button asChild variant="link" className="p-0 h-auto inline-flex items-center gap-2 text-primary font-bold mb-6 hover:underline">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </Button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Results for "{destination || '...'}"</h1>
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

      {!loading && !error && recommendations && (
        <div className="grid grid-cols-1 gap-4">
          {recommendations.hotelRecommendations.length > 0 ? (
             recommendations.hotelRecommendations.map((hotel, index) => (
              <HotelCard key={hotel.name + index} hotel={hotel} />
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
