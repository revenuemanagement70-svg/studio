'use client';

import { collection, addDoc, deleteDoc, doc, Firestore, writeBatch, getDocs, updateDoc, query } from 'firebase/firestore';
import type { hotel as Hotel } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage, deleteObject } from "firebase/storage";

async function uploadImages(storage: FirebaseStorage, hotelId: string, files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => {
        const imageRef = ref(storage, `hotels/${hotelId}/${file.name}`);
        return uploadBytes(imageRef, file).then(snapshot => getDownloadURL(snapshot.ref));
    });
    return Promise.all(uploadPromises);
}

export async function addHotel(
    db: Firestore, 
    storage: FirebaseStorage,
    hotel: Omit<Hotel, 'id' | 'imageUrls'>,
    imageFiles: File[]
) {
    const hotelsCollection = collection(db, 'hotels');
    
    try {
        // First, create the hotel document to get an ID
        const docRef = await addDoc(hotelsCollection, { ...hotel, imageUrls: [] });
        const hotelId = docRef.id;

        // Then, upload images using the hotel ID in the path
        const imageUrls = await uploadImages(storage, hotelId, imageFiles);

        // Finally, update the hotel document with the image URLs
        await updateDoc(docRef, { imageUrls });

        return docRef;

    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: hotelsCollection.path,
            operation: 'create',
            requestResourceData: hotel,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    }
}


export async function updateHotel(
    db: Firestore,
    storage: FirebaseStorage,
    hotelId: string,
    hotelData: Partial<Omit<Hotel, 'imageUrls'>>,
    newImageFiles: File[],
    existingImageUrls: string[]
) {
    const hotelRef = doc(db, 'hotels', hotelId);
    
    try {
        let finalImageUrls = [...existingImageUrls];
        
        // Upload new images if any
        if (newImageFiles.length > 0) {
            const newUrls = await uploadImages(storage, hotelId, newImageFiles);
            finalImageUrls.push(...newUrls);
        }

        // To-Do: Delete images from storage that were removed from existingImageUrls

        await updateDoc(hotelRef, {
            ...hotelData,
            imageUrls: finalImageUrls,
        });

    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: hotelRef.path,
            operation: 'update',
            requestResourceData: hotelData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    }
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
