'use client';

import { doc, setDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { generateBookingId } from '@/lib/utils';
import type { booking } from '@/lib/types';

export async function createBooking(db: Firestore, bookingData: Omit<booking, 'id' | 'bookingId' | 'bookedAt'>) {
    const bookingId = generateBookingId();
    const bookingRef = doc(db, 'bookings', bookingId);
    
    const newBooking = {
        ...bookingData,
        bookingId: bookingId,
        bookedAt: serverTimestamp(),
    };

    try {
        await setDoc(bookingRef, newBooking);
        return bookingId;
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: bookingRef.path,
            operation: 'create',
            requestResourceData: newBooking,
        });
        errorEmitter.emit('permission-error', permissionError);
        // Re-throw the error to be caught by the calling function's try-catch block
        throw serverError;
    }
}
