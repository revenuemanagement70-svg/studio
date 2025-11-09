'use client';

import { collection, writeBatch, Firestore, query, getDocs, where } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { format, eachDayOfInterval } from 'date-fns';
import type { RoomAvailability } from '@/lib/types';

/**
 * Sets the price and number of available rooms for a given date range for a specific hotel.
 * This function overwrites any existing availability data for the specified dates.
 */
export async function setAvailabilityForDateRange(
    db: Firestore,
    hotelId: string,
    startDate: Date,
    endDate: Date,
    price: number,
    roomsAvailable: number
) {
    const batch = writeBatch(db);
    const availabilityCollectionRef = collection(db, 'hotels', hotelId, 'availability');
    
    const dates = eachDayOfInterval({ start: startDate, end: endDate });

    dates.forEach(date => {
        const dateString = format(date, 'yyyy-MM-dd');
        const availabilityDocRef = doc(availabilityCollectionRef, dateString);
        
        const availabilityData = {
            date: dateString,
            price: price,
            roomsAvailable: roomsAvailable
        };

        batch.set(availabilityDocRef, availabilityData);
    });

    try {
        await batch.commit();
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: availabilityCollectionRef.path,
            operation: 'write',
            requestResourceData: { hotelId, startDate, endDate, price, roomsAvailable },
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    }
}


/**
 * Retrieves all availability records for a specific hotel.
 */
export async function getAvailabilityForHotel(
    db: Firestore,
    hotelId: string
): Promise<RoomAvailability[]> {
    const availabilityCollectionRef = collection(db, 'hotels', hotelId, 'availability');
    const q = query(availabilityCollectionRef, orderBy('date'));

    try {
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RoomAvailability));
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: availabilityCollectionRef.path,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    }
}

/**
 * Retrieves availability for a specific hotel and date.
 */
export async function getAvailabilityForDate(
    db: Firestore,
    hotelId: string,
    date: Date
): Promise<RoomAvailability | null> {
    const dateString = format(date, 'yyyy-MM-dd');
    const availabilityDocRef = doc(db, 'hotels', hotelId, 'availability', dateString);

    try {
        const docSnap = await getDoc(availabilityDocRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as RoomAvailability;
        }
        return null;
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: availabilityDocRef.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    }
}