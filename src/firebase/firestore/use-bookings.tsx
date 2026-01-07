'use client';

import { collection, query, orderBy, getDoc, doc, Firestore } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import type { booking } from '@/lib/types';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';
import { useCollection } from './use-collection';

export function useBookings() {
  const firestore = useFirestore();

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'bookings'), orderBy('bookedAt', 'desc'));
  }, [firestore]);

  const { data: bookings, loading, error } = useCollection<booking>(bookingsQuery);

  return { bookings: bookings ?? [], loading, error };
}

export async function getBookingById(db: Firestore, bookingId: string): Promise<booking | null> {
    const bookingRef = doc(db, 'bookings', bookingId);

    try {
        const docSnap = await getDoc(bookingRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as booking;
        } else {
            return null;
        }
    } catch(err) {
        console.error("Error fetching booking by ID:", err);
        const permissionError = new FirestorePermissionError({
            path: bookingRef.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw err;
    }
}
