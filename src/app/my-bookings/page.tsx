'use client';

import { useUser } from '@/firebase';
import { useMyBookings } from '@/firebase/firestore/use-my-bookings';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BedDouble, Calendar, Hotel, Loader2, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { booking } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

function BookingCard({ booking }: { booking: booking }) {
    const checkinDate = booking.checkin ? format(new Date(booking.checkin), 'PPP') : 'N/A';
    const checkoutDate = booking.checkout ? format(new Date(booking.checkout), 'PPP') : 'N/A';
    const bookedAtDate = booking.bookedAt?.toDate ? format(booking.bookedAt.toDate(), 'PPP, p') : 'N/A';

    return (
        <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                    <CardTitle className="font-bold text-primary font-headline">{booking.hotelName}</CardTitle>
                    <CardDescription>Booking ID: {booking.bookingId}</CardDescription>
                </div>
                <div className="font-bold text-lg">₹{booking.totalPrice.toLocaleString('en-IN')}</div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                 <div className="grid sm:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <h4 className="font-semibold flex items-center gap-2"><Calendar className="size-4 text-muted-foreground"/>Booking Dates</h4>
                        <p>Check-in: {checkinDate}</p>
                        <p>Check-out: {checkoutDate}</p>
                    </div>
                     <div className="space-y-1">
                        <h4 className="font-semibold flex items-center gap-2"><User className="size-4 text-muted-foreground"/>Guest Details</h4>
                        <p>{booking.guests} Guest(s)</p>
                    </div>
                </div>
                 <div className="text-xs text-muted-foreground pt-2 border-t">
                    Booked on: {bookedAtDate}
                </div>
            </CardContent>
        </Card>
    )
}

function MyBookingsContent() {
  const { user, isUserLoading } = useUser();
  const { bookings, isLoading: bookingsLoading } = useMyBookings(user?.uid);

  const isLoading = isUserLoading || bookingsLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-5 py-12">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-5 py-12 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <BedDouble className="mx-auto size-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold font-headline mb-2">Login to see your bookings</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your booking history.</p>
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
        <h1 className="text-3xl font-bold font-headline">My Bookings</h1>
        <p className="text-muted-foreground">A history of all your past and upcoming stays.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <Hotel className="mx-auto size-12 text-primary mb-4" />
          <p className="text-muted-foreground font-semibold text-lg">No bookings yet.</p>
          <p className="text-muted-foreground mt-2">Ready for your next adventure? Find the perfect hotel!</p>
           <Button asChild variant="link" className="mt-4">
            <Link href="/">Explore Hotels</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}


export default function MyBookingsPage() {
    return (
      <div className="flex flex-col min-h-screen bg-secondary/30">
          <Header />
          <main className="flex-grow pt-24 pb-12">
              <MyBookingsContent />
          </main>
          <Footer />
      </div>
    );
}