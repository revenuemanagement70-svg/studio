'use client';

import { Suspense, useState, useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, Wifi, ParkingCircle, UtensilsCrossed, User, Mail, Calendar, Users, Loader2 } from 'lucide-react';
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
import { useUser, useFirestore } from '@/firebase';
import { createBooking } from '@/firebase/firestore/bookings';
import { format, differenceInDays } from 'date-fns';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

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

function BookingDialog({ hotel, checkin, checkout, guests }: { hotel: Hotel; checkin?: string, checkout?: string, guests?: string }) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !firestore) {
            toast({ variant: "destructive", title: "Please log in", description: "You need to be logged in to make a booking." });
            return;
        }

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;

        const checkinDate = checkin ? new Date(checkin) : new Date();
        const checkoutDate = checkout ? new Date(checkout) : new Date(new Date().setDate(new Date().getDate() + 1));
        const numGuests = guests ? parseInt(guests, 10) : 1;
        const nights = differenceInDays(checkoutDate, checkinDate) || 1;
        const totalPrice = hotel.price * nights;

        startTransition(async () => {
            try {
                const bookingId = await createBooking(firestore, {
                    hotelId: hotel.id,
                    hotelName: hotel.name,
                    userId: user.uid,
                    userName: name,
                    userEmail: email,
                    checkin: format(checkinDate, 'yyyy-MM-dd'),
                    checkout: format(checkoutDate, 'yyyy-MM-dd'),
                    guests: numGuests,
                    totalPrice: totalPrice
                });

                toast({
                    title: "Booking Successful!",
                    description: `Your booking at ${hotel.name} is confirmed. Booking ID: ${bookingId}`,
                });
                setOpen(false);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Booking Failed",
                    description: error instanceof Error ? error.message : "An unknown error occurred.",
                });
            }
        });
    };
    
    const nights = (checkin && checkout) ? (differenceInDays(new Date(checkout), new Date(checkin)) || 1) : 1;
    const totalPrice = hotel.price * nights;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full bg-gradient-to-r from-primary to-accent font-bold text-lg h-12">
                    Book Now
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Confirm Booking: {hotel.name}</DialogTitle>
                    <DialogDescription>
                        Review your details and confirm your booking.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <Card className="bg-secondary/50">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold flex items-center gap-2"><Calendar className="size-4" /> Check-in</span>
                                    <span>{checkin ? format(new Date(checkin), 'PPP') : 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold flex items-center gap-2"><Calendar className="size-4" /> Check-out</span>
                                    <span>{checkout ? format(new Date(checkout), 'PPP') : 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold flex items-center gap-2"><Users className="size-4" /> Guests</span>
                                    <span>{guests || 1}</span>
                                </div>
                                <div className="flex justify-between items-center font-bold text-md pt-2 border-t">
                                    <span>Total Price ({nights} night{nights > 1 ? 's' : ''})</span>
                                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                            </CardContent>
                        </Card>
                         <div className="space-y-2">
                            <Label htmlFor="name" className="text-left">
                                <User className="inline-block mr-1 size-4" /> Your Name
                            </Label>
                            <Input id="name" name="name" defaultValue={user?.displayName || ""} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-left">
                               <Mail className="inline-block mr-1 size-4" /> Your Email
                            </Label>
                            <Input id="email" name="email" type="email" defaultValue={user?.email || ""} required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending && <Loader2 className="animate-spin" />}
                            {isPending ? "Confirming..." : "Confirm & Book"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function ImageGallery({ hotel }: { hotel: Hotel }) {
  const [api, setApi] = useState<CarouselApi>()
  const [mainApi, setMainApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const allImages = hotel.imageUrls && hotel.imageUrls.length > 0
    ? hotel.imageUrls
    : [`https://picsum.photos/seed/${hotel.name.replace(/\s+/g, '-')}/1200/800`];


  useEffect(() => {
    if (!api || !mainApi) return;

    const syncApis = (primary: CarouselApi, secondary: CarouselApi) => {
        return () => {
            if (primary.selectedScrollSnap() !== secondary.selectedScrollSnap()) {
                secondary.scrollTo(primary.selectedScrollSnap())
            }
        }
    }

    const onSelect = () => {
      setCurrent(mainApi.selectedScrollSnap())
      api.scrollTo(mainApi.selectedScrollSnap())
    }

    mainApi.on("select", onSelect)
    
    const syncToMain = syncApis(api, mainApi)
    const syncFromMain = syncApis(mainApi, api)

    api.on("select", syncFromMain)
    mainApi.on("select", syncToMain)


    return () => {
      mainApi.off("select", onSelect)
      api.off("select", syncFromMain)
      mainApi.off("select", syncToMain)
    }
  }, [api, mainApi])

  const handleThumbClick = (index: number) => {
    mainApi?.scrollTo(index);
  }

  return (
    <div className="space-y-4">
      <Carousel setApi={setMainApi}>
        <CarouselContent>
          {allImages.map((url, index) => (
            <CarouselItem key={index}>
              <Image
                src={url}
                alt={`Image ${index + 1} of ${hotel.name}`}
                data-ai-hint="hotel exterior large"
                width={1200}
                height={800}
                className="rounded-xl object-cover w-full aspect-[3/2] shadow-lg"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      {allImages.length > 1 && (
        <Carousel setApi={setApi} opts={{ align: "start", slidesToScroll: 1, containScroll: "trimSnaps" }}>
          <CarouselContent className="-ml-2">
            {allImages.map((url, index) => (
              <CarouselItem key={index} className="basis-1/4 md:basis-1/5 lg:basis-1/6 pl-2">
                <div 
                  className={`aspect-square rounded-md overflow-hidden cursor-pointer transition-opacity ${index === current ? 'opacity-100 ring-2 ring-primary ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                  onClick={() => handleThumbClick(index)}
                >
                  <Image
                    src={url}
                    alt={`Thumbnail ${index + 1} of ${hotel.name}`}
                    data-ai-hint="hotel interior"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  )
}

function HotelDetailsContent() {
  const searchParams = useSearchParams();
  const hotelDataString = searchParams.get('data');
  const backLink = searchParams.get('back') || '/';
  const checkin = searchParams.get('checkin');
  const checkout = searchParams.get('checkout');
  const guests = searchParams.get('guests');

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
            <ImageGallery hotel={hotel} />
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
                        <BookingDialog 
                          hotel={hotel} 
                          checkin={checkin || undefined} 
                          checkout={checkout || undefined}
                          guests={guests || undefined}
                        />
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
