'use client';

import { doc, setDoc, deleteDoc, Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export async function saveFavorite(db: Firestore, userId: string, hotelId: string) {
    const favoriteRef = doc(db, 'users', userId, 'favorites', hotelId);
    const favoriteData = { hotelId };
    
    setDoc(favoriteRef, favoriteData)
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: favoriteRef.path,
            operation: 'create',
            requestResourceData: favoriteData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export async function removeFavorite(db: Firestore, userId: string, hotelId: string) {
    const favoriteRef = doc(db, 'users', userId, 'favorites', hotelId);
    
    deleteDoc(favoriteRef)
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: favoriteRef.path,
            operation: 'delete'
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}
