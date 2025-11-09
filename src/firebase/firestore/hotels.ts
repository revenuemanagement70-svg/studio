'use client';

import { collection, addDoc, deleteDoc, doc, Firestore, writeBatch, getDocs, updateDoc, query } from 'firebase/firestore';
import type { hotel as Hotel } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export async function addHotel(db: Firestore, hotel: Omit<Hotel, 'id'>) {
    const hotelsCollection = collection(db, 'hotels');
    
    addDoc(hotelsCollection, hotel)
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: hotelsCollection.path,
            operation: 'create',
            requestResourceData: hotel,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export async function updateHotel(db: Firestore, hotelId: string, hotelData: Partial<Hotel>) {
    const hotelRef = doc(db, 'hotels', hotelId);
    
    updateDoc(hotelRef, hotelData)
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: hotelRef.path,
            operation: 'update',
            requestResourceData: hotelData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    });
}

export async function deleteHotel(db: Firestore, hotelId: string) {
    const hotelRef = doc(db, 'hotels', hotelId);

    // Also find and delete this hotel from all users' favorites
    const batch = writeBatch(db);
    batch.delete(hotelRef);
    
    const usersSnapshot = await getDocs(query(collection(db, "users")));
    for (const userDoc of usersSnapshot.docs) {
        const favoritesCollectionRef = collection(db, "users", userDoc.id, "favorites");
        const favoriteDocRef = doc(favoritesCollectionRef, hotelId);
        // We just add a delete operation to the batch. If the doc doesn't exist, this is a no-op.
        batch.delete(favoriteDocRef);
    }
    
    await batch.commit().catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: hotelRef.path,
            operation: 'delete'
        });
        errorEmitter.emit('permission-error', permissionError);
        // Re-throw the original error to be caught by the UI
        throw serverError;
    });
}