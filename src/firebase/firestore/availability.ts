'use client';

import { collection, writeBatch, Firestore, query, getDocs, where, doc, getDoc, runTransaction, DocumentReference, Transaction } from 'firebase/firestore';
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
    const q = query(availabilityCollectionRef);

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
 * Retrieves availability for a specific hotel and date range.
 */
export async function getAvailabilityForDateRange(
    db: Firestore,
    hotelId: string,
    startDate: Date,
    endDate: Date
): Promise<RoomAvailability[]> {
    const availabilityCollectionRef = collection(db, 'hotels', hotelId, 'availability');
    const startString = format(startDate, 'yyyy-MM-dd');
    const endString = format(endDate, 'yyyy-MM-dd');
    
    const q = query(availabilityCollectionRef, where('date', '>=', startString), where('date', '<=', endString));

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
 * Transactionally checks availability and decrements room counts for a date range.
 * Throws an error if any date is unavailable or rooms are sold out.
 */
export async function checkAndDecrementAvailability(
    transaction: Transaction,
    db: Firestore,
    hotelId: string,
    startDate: Date,
    endDate: Date
): Promise<number> {
    const dates = eachDayOfInterval({ start: startDate, end: endDate });
    let totalPrice = 0;
    
    const availabilityDocsRefs = dates.map(date => {
        const dateString = format(date, 'yyyy-MM-dd');
        return doc(db, 'hotels', hotelId, 'availability', dateString);
    });

    const availabilityDocs = await transaction.getAll(...availabilityDocsRefs);

    for (let i = 0; i < availabilityDocs.length; i++) {
        const docSnap = availabilityDocs[i];
        if (!docSnap.exists()) {
            throw new Error(`No availability configured for ${dates[i]}`);
        }
        
        const data = docSnap.data() as RoomAvailability;
        if (data.roomsAvailable < 1) {
            throw new Error(`Sold out on ${data.date}.`);
        }
        
        totalPrice += data.price;
        transaction.update(docSnap.ref, { roomsAvailable: data.roomsAvailable - 1 });
    }

    return totalPrice;
}