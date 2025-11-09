'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Building2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHotels } from '@/firebase/firestore/use-hotels';
import type { hotel as Hotel } from '@/lib/types';
import { useMemo } from 'react';
import { Skeleton } from '../ui/skeleton';

type Destination = {
    name: string;
    hotels: number;
    price: number;
    path: string;
    image: (typeof PlaceHolderImages)[0] | undefined;
};

function DestinationGrid({ destinations }: { destinations: Destination[] }) {
     return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest) => (
                <Link href={dest.path} key={dest.name} className="group relative rounded-xl overflow-hidden shadow-lg block" aria-label={`Book a hotel in ${dest.name}`}>
                    {dest.image && (
                        <Image
                            src={dest.image.imageUrl}
                            alt={dest.image.description}
                            data-ai-hint={dest.image.imageHint}
                            width={400}
                            height={350}
                            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10 flex justify-between items-end">
                      <div>
                        <h3 className="font-headline text-2xl font-bold">{dest.name}</h3>
                        <div className="flex items-center gap-4 text-sm opacity-90 mt-1">
                            <span className="flex items-center gap-1.5"><Building2 className="size-4" /> {dest.hotels} Hotel{dest.hotels > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm opacity-90 mt-1">
                            <span className="flex items-center gap-1.5"><Tag className="size-4" /> From ₹{dest.price}</span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-white text-primary hover:bg-white/90 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Book
                      </Button>
                    </div>
                </Link>
            ))}
        </div>
    );
}

function DestinationSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden shadow-lg">
                    <Skeleton className="w-full h-80" />
                </div>
            ))}
        </div>
    )
}

export function Destinations() {
    const { hotels, loading, error } = useHotels();

    const destinationsData: Destination[] = useMemo(() => {
        if (!hotels || hotels.length === 0) return [];
        
        const cityMap = new Map<string, { hotelCount: number, minPrice: number }>();

        hotels.forEach(hotel => {
            if (!cityMap.has(hotel.city)) {
                cityMap.set(hotel.city, { hotelCount: 0, minPrice: Infinity });
            }
            const cityData = cityMap.get(hotel.city)!;
            cityData.hotelCount += 1;
            if (hotel.price < cityData.minPrice) {
                cityData.minPrice = hotel.price;
            }
        });

        return Array.from(cityMap.entries()).map(([city, data]) => {
            const image = PlaceHolderImages.find(img => img.id.toLowerCase() === city.toLowerCase());
            return {
                name: city,
                hotels: data.hotelCount,
                price: data.minPrice,
                path: `/results?destination=${city}`,
                image: image
            };
        });

    }, [hotels]);
    

    return (
        <section id="destinations" className="py-12 lg:py-24 bg-secondary/30" aria-labelledby="dest-heading">
            <div className="container mx-auto px-5">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 text-primary py-1 px-4 rounded-full font-bold text-sm mb-4">
                        EXPLORE INDIA
                    </div>
                    <h2 id="dest-heading" className="font-headline text-3xl lg:text-4xl font-bold mb-4">Popular Destinations</h2>
                    <p className="text-muted-foreground lg:text-lg">Discover amazing places to stay across India's most iconic cities.</p>
                </div>
                
                {loading && <DestinationSkeleton />}
                {error && <p className="text-center text-destructive">{error}</p>}
                {!loading && !error && destinationsData.length > 0 && <DestinationGrid destinations={destinationsData} />}
                {!loading && !error && destinationsData.length === 0 && <p className="text-center text-muted-foreground">No destinations with listed properties yet.</p>}

            </div>
        </section>
    );
}
