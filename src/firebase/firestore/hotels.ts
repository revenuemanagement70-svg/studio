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

export function addHotel(
    db: Firestore, 
    storage: FirebaseStorage,
    hotel: Omit<Hotel, 'id' | 'imageUrls'>,
    imageFiles: File[]
) {
    const hotelsCollection = collection(db, 'hotels');
    
    // Return the promise chain
    return addDoc(hotelsCollection, { ...hotel, imageUrls: [] })
        .then(docRef => {
            // This .then() block only executes if addDoc is successful.
            // Now, handle image uploads and the final update.
            return uploadImages(storage, docRef.id, imageFiles)
                .then(imageUrls => {
                    // This is the second Firestore operation: update the doc.
                    return updateDoc(docRef, { imageUrls })
                        .catch(serverError => {
                            // Catch errors specifically for the updateDoc operation.
                            console.error("🔴 ORIGINAL ERROR (update):", serverError);
                            console.error("🔴 ERROR CODE (update):", serverError.code);
                            console.error("🔴 ERROR MESSAGE (update):", serverError.message);
                            const permissionError = new FirestorePermissionError({
                                path: docRef.path,
                                operation: 'update',
                                requestResourceData: { imageUrls },
                            });
                            errorEmitter.emit('permission-error', permissionError);
                            // Propagate the error to fail the entire chain.
                            throw serverError;
                        });
                });
        })
        .catch(serverError => {
            // This is the crucial part for catching the initial 'create' permission error.
            console.error("🔴 ORIGINAL ERROR (create):", serverError); 
            console.error("🔴 ERROR CODE (create):", serverError.code);
            console.error("🔴 ERROR MESSAGE (create):", serverError.message);
            const permissionError = new FirestorePermissionError({
                path: hotelsCollection.path,
                operation: 'create',
                requestResourceData: hotel,
            });
            errorEmitter.emit('permission-error', permissionError);
            // Re-throw the original error to ensure the calling code knows about the failure.
            throw serverError;
        });
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
    const usersCollectionRef = collection(db, "users");

    try {
        // Soft delete the hotel document
        await updateDoc(hotelRef, { deleted: true, deletedAt: new Date() });

        // Batch delete the hotel from all users' favorites subcollections
        const batch = writeBatch(db);
        const usersSnapshot = await getDocs(query(usersCollectionRef));
        
        for (const userDoc of usersSnapshot.docs) {
            const favoriteDocRef = doc(db, "users", userDoc.id, "favorites", hotelId);
            batch.delete(favoriteDocRef);
        }
        
        await batch.commit();

    } catch (serverError) {
        // This will catch errors from either updateDoc or batch.commit
        const permissionError = new FirestorePermissionError({
            path: hotelRef.path, // The primary resource being operated on
            operation: 'write', // A generic write since it involves updates and deletes
            requestResourceData: { hotelId, action: "delete and clean up favorites" }
        });
        errorEmitter.emit('permission-error', permissionError);
        // Re-throw the original error to be caught by the UI
        throw serverError;
    }
}
