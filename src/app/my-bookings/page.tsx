'use client';

import { useUser } from '@/firebase';
import { useMyBookings } from '@/firebase/firestore/use-my-bookings';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BedDouble, Calendar, Hotel, Loader2, MessageSquare, Star, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { booking } from '@/lib/types';
import { format, isPast } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { addReview } from '@/firebase/firestore/reviews';
import { cn } from '@/lib/utils';


function ReviewDialog({ booking, user }: { booking: booking; user: import('firebase/auth').User }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSubmit = async () => {
        if (!firestore) return;
        if (rating === 0) {
            toast({ variant: 'destructive', title: 'Please select a rating.' });
            return;
        }
        setIsSubmitting(true);
        try {
            await addReview(firestore, {
                hotelId: booking.hotelId,
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                userPhotoUrl: user.photoURL || '',
                rating,
                comment,
            });
            toast({ title: 'Review Submitted!', description: 'Thank you for your feedback.' });
            setOpen(false);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not submit your review.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <MessageSquare className="size-4 mr-2" />
                    Leave a Review
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Leave a review for {booking.hotelName}</DialogTitle>
                    <DialogDescription>Share your experience to help other travelers.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Your Rating</Label>
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn('size-8 cursor-pointer transition-colors', i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 hover:text-amber-300')}
                                    onClick={() => setRating(i + 1)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="comment">Your Comment</Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us about your stay..."
                            rows={4}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="animate-spin mr-2" />}
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function BookingCard({ booking, user }: { booking: booking; user: import('firebase/auth').User | null }) {
    const checkinDate = booking.checkin ? format(new Date(booking.checkin), 'PPP') : 'N/A';
    const checkoutDate = booking.checkout ? format(new Date(booking.checkout), 'PPP') : 'N/A';
    const bookedAtDate = booking.bookedAt?.toDate ? format(booking.bookedAt.toDate(), 'PPP, p') : 'N/A';

    const canReview = user && isPast(new Date(booking.checkout));

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
            {canReview && (
                <CardFooter>
                    <ReviewDialog booking={booking} user={user} />
                </CardFooter>
            )}
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
            <BookingCard key={booking.id} booking={booking} user={user} />
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
