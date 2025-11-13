'use client';

import { doc, serverTimestamp, Firestore, runTransaction } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { generateBookingId } from '@/lib/utils';
import type { booking } from '@/lib/types';
import { checkAndDecrementAvailability } from './availability';
import { parseISO } from 'date-fns';

export async function createBooking(db: Firestore, bookingData: Omit<booking, 'id' | 'bookingId' | 'bookedAt' | 'totalPrice'>) {
    const bookingId = generateBookingId();
    const bookingRef = doc(db, 'bookings', bookingId);
    
    try {
        await runTransaction(db, async (transaction) => {
            const checkinDate = parseISO(bookingData.checkin);
            const checkoutDate = parseISO(bookingData.checkout);
            
            // This function will throw an error if not available, which will abort the transaction
            const totalPrice = await checkAndDecrementAvailability(transaction, db, bookingData.hotelId, checkinDate, checkoutDate);

            const newBooking = {
                ...bookingData,
                bookingId: bookingId,
                bookedAt: serverTimestamp(),
                totalPrice: totalPrice,
            };

            transaction.set(bookingRef, newBooking);
        });

        return bookingId;
    } catch (serverError) {
        // Create a detailed error for any failure within the transaction.
        const permissionError = new FirestorePermissionError({
            path: bookingRef.path,
            operation: 'create',
            requestResourceData: bookingData,
        });
        errorEmitter.emit('permission-error', permissionError);
       
        // Re-throw the original error to be caught by the calling function's UI logic
        throw serverError;
    }
}
