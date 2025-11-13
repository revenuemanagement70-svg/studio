'use client';

import { collection, addDoc, deleteDoc, doc, Firestore, writeBatch, getDocs, updateDoc, query } from 'firebase/firestore';
import type { hotel as Hotel } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export async function addHotel(db: Firestore, hotel: Omit<Hotel, 'id'>) {
    const hotelsCollection = collection(db, 'hotels');
    
    try {
        const docRef = await addDoc(hotelsCollection, hotel);
        return docRef;
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: hotelsCollection.path,
            operation: 'create',
            requestResourceData: hotel,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError; // Re-throw the error to be caught by the calling function
    }
}

export async function updateHotel(db: Firestore, hotelId: string, hotelData: Partial<Hotel>) {
    const hotelRef = doc(db, 'hotels', hotelId);
    
    try {
        await updateDoc(hotelRef, hotelData);
    }
    catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: hotelRef.path,
            operation: 'update',
            requestResourceData: hotelData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    };
}

export async function deleteHotel(db: Firestore, hotelId: string) {
    const hotelRef = doc(db, 'hotels', hotelId);

    // Soft delete: set a 'deleted' flag instead of permanently removing the document.
    try {
        await updateDoc(hotelRef, { deleted: true, deletedAt: new Date() });
        
        // We still need to remove it from favorites, which is a hard delete.
        const batch = writeBatch(db);
        const usersSnapshot = await getDocs(query(collection(db, "users")));
        for (const userDoc of usersSnapshot.docs) {
            const favoriteDocRef = doc(db, "users", userDoc.id, "favorites", hotelId);
            batch.delete(favoriteDocRef);
        }
        await batch.commit();

    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: hotelRef.path,
            operation: 'update' // operation is now update for soft delete
        });
        errorEmitter.emit('permission-error', permissionError);
        // Re-throw the original error to be caught by the UI
        throw serverError;
    }
}
