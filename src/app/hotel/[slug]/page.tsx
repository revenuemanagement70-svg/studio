'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, Wifi, ParkingCircle, UtensilsCrossed } from 'lucide-react';
import type { PersonalizedHotelRecommendationsOutput } from '@/ai/flows/personalized-hotel-recommendations';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FirebaseProvider } from '@/firebase/provider';
import React from 'react';

type Hotel = PersonalizedHotelRecommendationsOutput['hotelRecommendations'][0];

const amenityIcons: { [key: string]: React.ReactNode } = {
  'wifi': <Wifi className="size-4" />,
  'pool': <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.64 5.64a1 1 0 0 1 .02 1.6l-3.32 4.04a1 1 0 0 1-1.62-.02l-3.36-4.9a1 1 0 0 1 1.6-1.06l2.03 2.98L9 5.62a1 1 0 0 1 1.06-1.62z"/><path d="M18.14 5.64a1 1 0 0 1 .02 1.6l-3.32 4.04a1 1 0 0 1-1.62-.02l-3.36-4.9a1 1 0 0 1 1.6-1.06l2.04 2.98 1.1-1.6a1 1 0 0 1 1.62-1.06z"/><path d="M7.34 15.64a1 1 0 0 1 .02 1.6l-1.63 1.98a1 1 0 0 1-1.62-.02l-1.12-1.62a1 1 0 1 1 1.6-1.06l.34.48.37-.46a1 1 0 0 1 1.04-1.6z"/><path d="m14.84 15.64a1 1 0 0 1 .02 1.6l-1.63 1.98a1 1 0 0 1-1.62-.02l-1.12-1.62a1 1 0 1 1 1.6-1.06l.34.48.37-.46a1 1 0 0 1 1.04-1.6z"/></svg>,
  'gym': <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 5 14 14"/><path d="m14 5-9 9"/><path d="M9.5 2.5 12 5l-2.5 2.5"/><path d="m14.5 19.5-2.5-2.5 2.5-2.5"/></svg>,
  'parking': <ParkingCircle className="size-4" />,
  'restaurant': <UtensilsCrossed className="size-4" />,
};

function getAmenityIcon(amenity: string): React.ReactNode {
    const lowerAmenity = amenity.toLowerCase();
    for (const key in amenityIcons) {
        if (lowerAmenity.includes(key)) {
            return amenityIcons[key];
        }
    }
    return null;
}

function HotelDetailsContent() {
  const searchParams = useSearchParams();
  const hotelDataString = searchParams.get('data');

  const destination = searchParams.get('destination') || '';
  const checkin = searchParams.get('checkin') || '';
  const checkout = searchParams.get('checkout') || '';
  const guests = searchParams.get('guests') || '';
  const budget = searchParams.get('budget') || '';
  const travelStyle = searchParams.get('travelStyle') || '';

  const resultsQuery = new URLSearchParams({
    destination,
    checkin,
    checkout,
    guests,
    budget,
    travelStyle
  }).toString();

  const backLink = `/results?${resultsQuery}`;

  if (!hotelDataString) {
    return (
      <div className="container mx-auto px-5 text-center">
        <h1 className="text-2xl font-bold font-headline my-8">Hotel not found</h1>
        <p className="text-muted-foreground mb-8">The hotel details could not be loaded.</p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const hotel: Hotel = JSON.parse(decodeURIComponent(hotelDataString));
  const imageUrl = `https://picsum.photos/seed/${hotel.name.replace(/\s+/g, '-')}/1200/800`;


  return (
    <div className="container mx-auto px-5">
      <Button asChild variant="link" className="p-0 h-auto inline-flex items-center gap-2 text-primary font-bold mb-6 hover:underline">
        <Link href={backLink}>
          <ArrowLeft className="size-4" />
          Back to Results
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Image
                src={imageUrl}
                alt={`Image of ${hotel.name}`}
                data-ai-hint="hotel exterior large"
                width={1200}
                height={800}
                className="rounded-xl object-cover w-full aspect-[3/2] shadow-lg"
            />
        </div>
        <div className="lg:col-span-1">
            <Card>
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-3xl font-bold font-headline">{hotel.name}</h1>
                        <div className="flex-shrink-0 flex items-center gap-1.5 bg-amber-400 text-amber-900 font-bold px-3 py-1.5 rounded-md text-lg">
                            <Star className="size-5 fill-current" />
                            <span>{hotel.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <p className="text-md text-muted-foreground mb-6">{hotel.address}</p>
                    
                    <p className="text-foreground mb-6">{hotel.description}</p>
                    
                    {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-bold text-lg mb-3 font-headline">Amenities</h3>
                        <div className="flex flex-wrap gap-3">
                            {hotel.amenities.map((amenity, i) => (
                            <Badge key={i} variant="secondary" className="capitalize flex items-center gap-2 py-1 px-3 text-sm">
                                {getAmenityIcon(amenity)}
                                <span>{amenity}</span>
                            </Badge>
                            ))}
                        </div>
                    </div>
                    )}

                    <div className="mt-auto flex flex-col justify-between items-center gap-4 pt-6 border-t">
                        <div className="text-left w-full">
                            <span className="text-3xl font-bold font-headline">₹{hotel.price.toLocaleString('en-IN')}</span>
                            <span className="text-md text-muted-foreground"> / night</span>
                        </div>
                        <Button size="lg" className="w-full bg-gradient-to-r from-primary to-accent font-bold text-lg h-12" asChild>
                          <a href="https://example.com/booking" target="_blank" rel="noopener noreferrer">Book Now</a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

export default function HotelDetailsPage() {
    return (
      <FirebaseProvider>
        <div className="flex flex-col min-h-screen bg-secondary/30">
          <Header />
          <main className="flex-grow pt-24 pb-12">
            <Suspense fallback={<p>Loading...</p>}>
              <HotelDetailsContent />
            </Suspense>
          </main>
          <Footer />
        </div>
      </FirebaseProvider>
    );
}
