'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, getDoc, doc, Firestore } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { booking } from '@/lib/types';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useBookings() {
  const firestore = useFirestore();
  const [bookings, setBookings] = useState<booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firestore) {
      setLoading(false);
      setError("Firestore is not available.");
      return;
    }

    const bookingsCollection = collection(firestore, 'bookings');
    const q = query(bookingsCollection, orderBy('bookedAt', 'desc'));
    
    const unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
            const bookingList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as booking));
            setBookings(bookingList);
            setLoading(false);
        },
        (err) => {
            console.error("Error fetching bookings:", err);
            setError("Failed to fetch bookings. Check permissions or network.");
            const permissionError = new FirestorePermissionError({
              path: bookingsCollection.path,
              operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
            setLoading(false);
        }
    );

    return () => unsubscribe();
  }, [firestore]);

  return { bookings, loading, error };
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
