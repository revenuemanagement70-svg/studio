'use client';

import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useMemoFirebase, useUser } from '@/firebase';
import type { booking } from '@/lib/types';
import { useCollection } from './use-collection';

export function useMyBookings(userId?: string) {
  const firestore = useFirestore();

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    
    // Query for bookings that belong to the current user.
    return query(collection(firestore, 'bookings'), where('userId', '==', userId));
  }, [firestore, userId]);

  const { data: bookings, isLoading, error } = useCollection<booking>(bookingsQuery);

  return { bookings, isLoading, error };
}
