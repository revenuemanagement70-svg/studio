'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Wifi, ParkingCircle, UtensilsCrossed, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { hotel as Hotel } from '@/lib/types';
import React, { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { useFavorites } from '@/firebase/firestore/use-favorites';
import { saveFavorite, removeFavorite } from '@/firebase/firestore/favorites';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';

interface HotelCardProps {
  hotel: Hotel;
  source?: 'results' | 'favorites';
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  'wifi': <Wifi className="size-4" />,
  'pool': <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.64 5.64a1 1 0 0 1 .02 1.6l-3.32 4.04a1 1 0 0 1-1.62-.02l-3.36-4.9a1 1 0 0 1 1.6-1.06l2.03 2.98L9 5.62a1 1 0 0 1 1.06-1.62z"/><path d="M18.14 5.64a1 1 0 0 1 .02 1.6l-3.32 4.04a1 1 0 0 1-1.62-.02l-3.36-4.9a1 1 0 0 1 1.6-1.06l2.04 2.98 1.1-1.6a1 1 0 0 1 1.62-1.06z"/><path d="M7.34 15.64a1 1 0 0 1 .02 1.6l-1.63 1.98a1 1 0 0 1-1.62-.02l-1.12-1.62a1 1 0 1 1 1.6-1.06l.34.48.37-.46a1 1 0 0 1 1.04-1.6z"/><path d="m14.84 15.64a1 1 0 0 1 .02 1.6l-1.63 1.98a1 1 0 0 1-1.62-.02l-1.12-1.62a1 1 0 1 1 1.6-1.06l.34.48.37-.46a1 1 0 0 1 1.04-1.6z"/></svg>,
  'gym': <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5 14 14"></path><path d="M14 5 5 14"></path><path d="M12 22v-5l-3-3-2.07 2.07a1 1 0 0 0 0 1.41l2.07 2.07"></path><path d="M16 12V6a2 2 0 0 0-2-2H8"></path><path d="M12 2v2"></path><path d="m6.5 6.5-1-1"></path><path d="m17.5 6.5 1-1"></path></svg>,
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

export function HotelCard({ hotel, source = 'results' }: HotelCardProps) {
  const imageUrl = hotel.imageUrls && hotel.imageUrls.length > 0 ? hotel.imageUrls[0] : `https://picsum.photos/seed/${hotel.name.replace(/\s+/g, '-')}/400/300`;
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { favorites, loading: favoritesLoading } = useFavorites(user?.uid);
  const [isFavoriteProcessing, setIsFavoriteProcessing] = useState(false);
  
  const searchParams = useSearchParams();
  
  const isFavorite = favorites?.some(fav => fav.id === hotel.id);

  const handleFavoriteToggle = async () => {
    if (!user || !firestore || !hotel.id) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to save favorites.",
      });
      return;
    }

    setIsFavoriteProcessing(true);

    try {
      if (isFavorite) {
        await removeFavorite(firestore, user.uid, hotel.id);
        toast({
          title: "Removed from Favorites",
          description: `${hotel.name} has been removed from your favorites.`,
        });
      } else {
        await saveFavorite(firestore, user.uid, hotel.id);
        toast({
          title: "Added to Favorites",
          description: `${hotel.name} has been added to your favorites.`,
        });
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error instanceof Error ? error.message : "Could not update favorites.",
      });
    } finally {
      setIsFavoriteProcessing(false);
    }
  };

  const hotelSlug = hotel.name.replace(/\s+/g, '-').toLowerCase();
  
  const detailsQuery = new URLSearchParams();
  detailsQuery.set('data', encodeURIComponent(JSON.stringify(hotel)));
  if (source === 'results') {
    detailsQuery.set('back', `/results?${searchParams.toString()}`);
  } else if (source === 'favorites') {
    detailsQuery.set('back', '/favorites');
  }


  return (
    <Card className="p-4 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-shadow duration-300 relative">
      <Image
        src={imageUrl}
        alt={`Image of ${hotel.name}`}
        data-ai-hint="hotel exterior"
        width={250}
        height={200}
        className="rounded-lg object-cover w-full md:w-64 h-48 md:h-52"
      />
      <div className="flex-grow flex flex-col">
        <div className="flex justify-between items-start gap-4">
            <h2 className="text-xl font-bold font-headline mb-1">{hotel.name}</h2>
            <div className="flex-shrink-0 flex items-center gap-1 bg-amber-400 text-amber-900 font-bold px-2 py-1 rounded">
                <Star className="size-4 fill-current" />
                <span>{hotel.rating.toFixed(1)}</span>
            </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{hotel.address}</p>
        <p className="text-sm text-foreground flex-grow mb-4">{hotel.description}</p>
        
        {hotel.amenities && hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities.slice(0, 4).map((amenity, i) => (
              <Badge key={i} variant="secondary" className="capitalize flex items-center gap-1.5">
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
          <div>
            <span className="text-2xl font-bold font-headline">₹{hotel.price.toLocaleString('en-IN')}</span>
            <span className="text-sm text-muted-foreground"> / night</span>
          </div>
          <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent font-bold">
            <Link href={`/hotel/${hotelSlug}?${detailsQuery.toString()}`}>View Details</Link>
          </Button>
        </div>
      </div>
      {!userLoading && user && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-100"
          onClick={handleFavoriteToggle}
          disabled={favoritesLoading || isFavoriteProcessing}
          aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={cn("size-6", isFavorite && "fill-current")} />
        </Button>
      )}
    </Card>
  );
}
