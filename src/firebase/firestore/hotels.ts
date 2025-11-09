'use client';

import { collection, addDoc, Firestore } from 'firebase/firestore';
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
