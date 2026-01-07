
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Hotel, BedDouble, BarChart, Check, Clock, User } from "lucide-react";
import { useHotels } from "@/firebase/firestore/use-hotels";
import { useBookings } from "@/firebase/firestore/use-bookings";
import { Skeleton } from "@/components/ui/skeleton";
import type { booking } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import Link from 'next/link';

function RecentBookings() {
  const { bookings, loading, error } = useBookings();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="size-8 rounded-full" />
            <div className="space-y-1 flex-grow">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive text-sm text-center">{error.message}</p>
  }
  
  if (bookings.length === 0) {
    return <p className="text-muted-foreground text-sm text-center">No recent activity yet.</p>
  }

  return (
    <div className="space-y-4">
      {bookings.slice(0, 5).map((booking: booking) => (
        <div key={booking.id} className="flex items-center gap-4">
          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="size-5 text-primary" />
          </div>
          <div className="flex-grow text-sm">
            <p className="font-semibold">New booking for <Link href={`/admin/bookings`} className="font-bold hover:underline">{booking.hotelName}</Link></p>
            <p className="text-muted-foreground">{booking.userName} ({booking.guests} guest{booking.guests > 1 ? 's':''})</p>
          </div>
          <div className="text-xs text-muted-foreground text-right">
            {booking.bookedAt?.toDate && formatDistanceToNow(booking.bookedAt.toDate(), { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { hotels, loading: hotelsLoading } = useHotels();
  const { bookings, loading: bookingsLoading } = useBookings();

  const totalProperties = hotels.length;
  const totalBookings = bookings.length;
  const isLoading = hotelsLoading || bookingsLoading;

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome back! Here's an overview of your properties.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalProperties}</div>}
            <p className="text-xs text-muted-foreground">Managed properties</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalBookings}</div>}
            <p className="text-xs text-muted-foreground">All-time bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-- %</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
      </div>

       <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of recent bookings and updates.</CardDescription>
            </CardHeader>
            <CardContent>
                <RecentBookings />
            </CardContent>
        </Card>
       </div>
    </div>
  );
}
