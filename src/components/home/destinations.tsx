import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Building2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const destinationsData = [
    { id: 'delhi', name: 'Delhi', hotels: '1,200+', price: '999', path: '/results?destination=Delhi' },
    { id: 'mumbai', name: 'Mumbai', hotels: '1,500+', price: '1,199', path: '/results?destination=Mumbai' },
    { id: 'goa', name: 'Goa', hotels: '2,000+', price: '1,499', path: '/results?destination=Goa' },
    { id: 'jaipur', name: 'Jaipur', hotels: '800+', price: '899', path: '/results?destination=Jaipur' },
];

export function Destinations() {
    const images = PlaceHolderImages.filter(img => destinationsData.some(d => d.id === img.id));

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
                    {destinationsData.map((dest) => {
                        const image = images.find(img => img.id === dest.id);
                        return (
                            <Link href={dest.path} key={dest.id} className="group relative rounded-xl overflow-hidden shadow-lg block" aria-label={`Book a hotel in ${dest.name}`}>
                                {image && (
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.description}
                                        data-ai-hint={image.imageHint}
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
                                        <span className="flex items-center gap-1.5"><Building2 className="size-4" /> {dest.hotels} Hotels</span>
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
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
