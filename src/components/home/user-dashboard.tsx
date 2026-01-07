'use client';

import { User } from "firebase/auth";
import Link from "next/link";
import { SearchSection } from "./search-section";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BedDouble, Heart, Star } from "lucide-react";
import { useFavorites } from "@/firebase/firestore/use-favorites";
import { HotelCardSkeleton } from "../results/hotel-card-skeleton";
import Image from "next/image";
import { Button } from "../ui/button";

function FavoriteHotelCard({ hotel }: { hotel: import('@/lib/types').hotel }) {
  const imageUrl = hotel.imageUrls && hotel.imageUrls.length > 0 ? hotel.imageUrls[0] : `https://picsum.photos/seed/${hotel.id}/200/150`;
  const hotelSlug = hotel.name.replace(/\s+/g, '-').toLowerCase();
  
  const detailsQuery = new URLSearchParams();
  detailsQuery.set('data', encodeURIComponent(JSON.stringify(hotel)));
  detailsQuery.set('back', '/');

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/hotel/${hotelSlug}?${detailsQuery.toString()}`}>
        <Image 
            src={imageUrl}
            alt={`Image of ${hotel.name}`}
            width={300}
            height={200}
            className="w-full h-32 object-cover"
        />
        <CardHeader>
            <CardTitle className="text-base font-bold line-clamp-1">{hotel.name}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
                <Star className="size-4 fill-amber-400 text-amber-500 mr-1" /> {hotel.rating}
                <span className="mx-2">•</span>
                <span>{hotel.city}</span>
            </div>
        </CardHeader>
      </Link>
    </Card>
  )
}

function RecentFavorites({ userId }: { userId: string }) {
    const { favorites, loading, error } = useFavorites(userId);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               <Card><CardHeader><Skeleton className="h-32 w-full" /><Skeleton className="h-5 w-3/4 mt-4" /><Skeleton className="h-4 w-1/2 mt-2" /></CardHeader></Card>
               <Card><CardHeader><Skeleton className="h-32 w-full" /><Skeleton className="h-5 w-3/4 mt-4" /><Skeleton className="h-4 w-1/2 mt-2" /></CardHeader></Card>
               <Card><CardHeader><Skeleton className="h-32 w-full" /><Skeleton className="h-5 w-3/4 mt-4" /><Skeleton className="h-4 w-1/2 mt-2" /></CardHeader></Card>
            </div>
        )
    }

    if (error) {
        return <p className="text-destructive">{error}</p>
    }

    if (!favorites || favorites.length === 0) {
        return null; // Don't show the section if there are no favorites
    }

    return (
         <div className="mt-12">
            <h3 className="text-xl font-bold font-headline mb-4">Your Favorite Stays</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.slice(0, 3).map(hotel => (
                    <FavoriteHotelCard key={hotel.id} hotel={hotel} />
                ))}
            </div>
        </div>
    )
}

export function UserDashboard({ user }: { user: User }) {
  const displayName = user.displayName?.split(' ')[0] || user.email;

  return (
    <div>
      <div className="max-w-5xl mx-auto text-center">
        <h1 id="hero-heading" className="font-headline text-4xl md:text-5xl font-extrabold mb-4">
          Welcome back, <span className="gradient-text">{displayName}!</span>
        </h1>
        <p className="text-muted-foreground text-base lg:text-lg mb-8">
          Ready for your next adventure? Search for hotels or manage your trips below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          <Link href="/my-bookings">
            <Card className="hover:bg-primary/10 hover:border-primary transition-colors p-6 flex items-center gap-6">
                <div className="bg-primary/10 text-primary p-3 rounded-lg">
                    <BedDouble className="size-8" />
                </div>
                <div>
                    <h3 className="font-bold font-headline text-lg">My Bookings</h3>
                    <p className="text-muted-foreground text-sm">View your past and upcoming trips.</p>
                </div>
            </Card>
          </Link>
          <Link href="/favorites">
            <Card className="hover:bg-accent/10 hover:border-accent transition-colors p-6 flex items-center gap-6">
                 <div className="bg-accent/10 text-accent p-3 rounded-lg">
                    <Heart className="size-8" />
                </div>
                <div>
                    <h3 className="font-bold font-headline text-lg">My Favorites</h3>
                    <p className="text-muted-foreground text-sm">See the hotels you've saved.</p>
                </div>
            </Card>
          </Link>
      </div>
      
      <SearchSection />

      <RecentFavorites userId={user.uid} />
    </div>
  )
}
