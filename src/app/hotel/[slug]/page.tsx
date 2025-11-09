'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, Wifi, ParkingCircle, UtensilsCrossed, User, Mail } from 'lucide-react';
import type { hotel as Hotel } from '@/lib/types';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

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

function BookingDialog({ hotelName }: { hotelName: string }) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setOpen(false);
        toast({
            title: "Booking Request Sent!",
            description: `Your request to book ${hotelName} has been received.`,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full bg-gradient-to-r from-primary to-accent font-bold text-lg h-12">
                    Book Now
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Book: {hotelName}</DialogTitle>
                    <DialogDescription>
                        Fill in your details below to send a booking request. This is a demo and will not create a real booking.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                <User className="inline-block mr-1 size-4" /> Name
                            </Label>
                            <Input id="name" defaultValue="John Doe" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                               <Mail className="inline-block mr-1 size-4" /> Email
                            </Label>
                            <Input id="email" type="email" defaultValue="john@example.com" className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Send Request</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function HotelDetailsContent() {
  const searchParams = useSearchParams();
  const hotelDataString = searchParams.get('data');
  const backLink = searchParams.get('back') || '/';

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
  const mainImageUrl = hotel.imageUrls && hotel.imageUrls.length > 0 ? hotel.imageUrls[0] : `https://picsum.photos/seed/${hotel.name.replace(/\s+/g, '-')}/1200/800`;
  const galleryImageUrls = hotel.imageUrls?.slice(1) || [];

  return (
    <div className="container mx-auto px-5">
      <Button asChild variant="link" className="p-0 h-auto inline-flex items-center gap-2 text-primary font-bold mb-6 hover:underline">
        <Link href={backLink}>
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <Image
                src={mainImageUrl}
                alt={`Image of ${hotel.name}`}
                data-ai-hint="hotel exterior large"
                width={1200}
                height={800}
                className="rounded-xl object-cover w-full aspect-[3/2] shadow-lg"
            />
            {galleryImageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryImageUrls.map((url, index) => (
                        <div key={index} className="aspect-w-1 aspect-h-1">
                             <Image
                                src={url}
                                alt={`Gallery image ${index + 1} of ${hotel.name}`}
                                data-ai-hint="hotel interior"
                                width={300}
                                height={200}
                                className="rounded-lg object-cover w-full h-full shadow-md"
                            />
                        </div>
                    ))}
                </div>
            )}
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
                        <BookingDialog hotelName={hotel.name} />
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
      <div className="flex flex-col min-h-screen bg-secondary/30">
        <Header />
        <main className="flex-grow pt-24 pb-12">
          <Suspense fallback={<p>Loading...</p>}>
            <HotelDetailsContent />
          </Suspense>
        </main>
        <Footer />
      </div>
    );
}
