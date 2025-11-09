'use client';

import { useUser } from '@/firebase';
import { useFavorites } from '@/firebase/firestore/use-favorites';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HotelCard } from '@/components/results/hotel-card';
import { HotelCardSkeleton } from '@/components/results/hotel-card-skeleton';
import { FirebaseProvider } from '@/firebase/provider';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

function FavoritesContent() {
  const { user, loading: userLoading } = useUser();
  const { favorites, loading: favoritesLoading } = useFavorites(user?.uid);

  const isLoading = userLoading || favoritesLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-5 py-12">
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <HotelCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-5 py-12 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <Heart className="mx-auto size-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold font-headline mb-2">Login to see your favorites</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your saved hotels.</p>
          <Button asChild size="lg">
            <Link href="/login">Log In or Sign Up</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 py-12">
       <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">My Favorite Hotels</h1>
        <p className="text-muted-foreground">All your saved hotels in one place.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <Heart className="mx-auto size-12 text-primary mb-4" />
          <p className="text-muted-foreground font-semibold text-lg">No favorite hotels yet.</p>
          <p className="text-muted-foreground mt-2">Start exploring and save hotels you like!</p>
           <Button asChild variant="link" className="mt-4">
            <Link href="/">Explore Hotels</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {favorites.map((hotel, index) => (
            <HotelCard key={hotel.name + index} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}


export default function FavoritesPage() {
    return (
        <FirebaseProvider>
            <div className="flex flex-col min-h-screen bg-secondary/30">
                <Header />
                <main className="flex-grow pt-24 pb-12">
                    <FavoritesContent />
                </main>
                <Footer />
            </div>
        </FirebaseProvider>
    );
}
