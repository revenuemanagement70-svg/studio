'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Hotel, User, Hash, AlertCircle } from "lucide-react";
import { useBookings, getBookingById } from '@/firebase/firestore/use-bookings';
import type { booking } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore } from '@/firebase';
import { format } from 'date-fns';

function BookingCard({ booking }: { booking: booking }) {
    const checkinDate = booking.checkin ? format(new Date(booking.checkin), 'PPP') : 'N/A';
    const checkoutDate = booking.checkout ? format(new Date(booking.checkout), 'PPP') : 'N/A';
    const bookedAtDate = booking.bookedAt?.toDate ? format(booking.bookedAt.toDate(), 'PPP, p') : 'N/A';

    return (
        <Card className="mb-4">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                    <CardTitle className="font-bold text-primary font-headline">{booking.bookingId}</CardTitle>
                    <CardDescription>Booked on: {bookedAtDate}</CardDescription>
                </div>
                <div className="font-bold text-lg">₹{booking.totalPrice.toLocaleString('en-IN')}</div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <h4 className="font-semibold flex items-center gap-2"><Hotel className="size-4 text-muted-foreground"/>Hotel Details</h4>
                        <p>{booking.hotelName}</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-semibold flex items-center gap-2"><User className="size-4 text-muted-foreground"/>Guest Details</h4>
                        <p>{booking.userName}</p>
                        <p className="text-muted-foreground">{booking.userEmail}</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-semibold flex items-center gap-2"><Calendar className="size-4 text-muted-foreground"/>Booking Dates</h4>
                        <p>Check-in: {checkinDate}</p>
                        <p>Check-out: {checkoutDate}</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-semibold flex items-center gap-2"><Hash className="size-4 text-muted-foreground"/>Details</h4>
                        <p>{booking.guests} Guest(s)</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function BookingsList() {
    const { bookings, loading, error } = useBookings();
    
    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        )
    }

    if (error) {
        return <p className="text-destructive text-center py-8">{error.message}</p>;
    }

    if (bookings.length === 0) {
        return <p className="text-muted-foreground text-center py-8">No recent bookings found.</p>
    }

    return (
        <div className="space-y-4">
            {bookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
            ))}
        </div>
    )
}


export default function BookingsPage() {
    const firestore = useFirestore();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<booking | null | undefined>(undefined); // undefined: not searched, null: not found
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!firestore || !searchQuery) {
            setSearchResult(undefined);
            return;
        };

        setIsSearching(true);
        setSearchResult(undefined);
        try {
            const booking = await getBookingById(firestore, searchQuery);
            setSearchResult(booking);
        } catch (error) {
            console.error("Search failed:", error);
            setSearchResult(null);
        } finally {
            setIsSearching(false);
        }
    }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Bookings</h1>
            <p className="text-muted-foreground">Search and manage hotel bookings.</p>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Bookings</CardTitle>
          <CardDescription>Enter a booking ID to find booking details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center gap-4">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-primary" />
                <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter Booking ID (e.g., StyABCD)"
                    className="pl-10 h-12 text-base"
                />
            </div>
            <Button type="submit" className="h-12 text-base font-bold" disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </form>
           {searchResult !== undefined && (
                <div className="mt-6">
                    {isSearching ? (
                        <Skeleton className="h-40 w-full" />
                    ) : searchResult ? (
                        <BookingCard booking={searchResult} />
                    ) : (
                        <div className="text-center text-muted-foreground py-8 border-dashed border-2 rounded-lg flex items-center justify-center gap-2">
                           <AlertCircle className="size-5" />
                           <p>No booking found with ID "{searchQuery}".</p>
                        </div>
                    )}
                </div>
            )}
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>A list of the most recent bookings on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
           <BookingsList />
        </CardContent>
      </Card>
    </div>
  );
}
