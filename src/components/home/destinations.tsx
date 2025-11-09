'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Building2, Tag } from 'lucide-react';

const destinations = [
    {
        name: 'Delhi',
        hotels: 120,
        price: 2500,
        path: '/results?destination=Delhi',
        image: PlaceHolderImages.find(img => img.id === 'delhi'),
    },
    {
        name: 'Mumbai',
        hotels: 95,
        price: 3500,
        path: '/results?destination=Mumbai',
        image: PlaceHolderImages.find(img => img.id === 'mumbai'),
    },
    {
        name: 'Goa',
        hotels: 250,
        price: 4500,
        path: '/results?destination=Goa',
        image: PlaceHolderImages.find(img => img.id === 'goa'),
    },
    {
        name: 'Jaipur',
        hotels: 80,
        price: 2000,
        path: '/results?destination=Jaipur',
        image: PlaceHolderImages.find(img => img.id === 'jaipur'),
    },
];

export function Destinations() {
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {destinations.map((dest) => (
                        <Link href={dest.path} key={dest.name} className="group relative rounded-xl overflow-hidden shadow-lg" aria-label={`Book a hotel in ${dest.name}`}>
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
                            <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
                                <h3 className="font-headline text-2xl font-bold">{dest.name}</h3>
                                <div className="flex items-center gap-4 text-sm opacity-90 mt-1">
                                    <span className="flex items-center gap-1.5"><Building2 className="size-4" /> {dest.hotels} Hotels</span>
                                    <span className="flex items-center gap-1.5"><Tag className="size-4" /> From ₹{dest.price}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
