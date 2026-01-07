'use client';

import {
    collection,
    doc,
    runTransaction,
    serverTimestamp,
    Firestore,
    collectionGroup,
    getDocs,
    query,
    where,
    limit,
    writeBatch
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Review } from '@/lib/types';

// Omit 'id' and 'createdAt' as they will be handled by the backend.
type ReviewInput = Omit<Review, 'id' | 'createdAt'>;

/**
 * Adds a review for a hotel and transactionally updates the hotel's average rating.
 * @param db The Firestore instance.
 * @param reviewData The review data to be added.
 */
export async function addReview(db: Firestore, reviewData: ReviewInput) {
    const hotelRef = doc(db, 'hotels', reviewData.hotelId);
    const reviewsRef = collection(hotelRef, 'reviews');
    const newReviewRef = doc(reviewsRef); // Create a new doc with a generated ID

    try {
        await runTransaction(db, async (transaction) => {
            // 1. Check if user has already reviewed this hotel
            const userReviewQuery = query(
                reviewsRef,
                where('userId', '==', reviewData.userId),
                limit(1)
            );
            const userReviewSnap = await getDocs(userReviewQuery);
            if (!userReviewSnap.empty) {
                throw new Error("You have already reviewed this hotel.");
            }

            // 2. Get the hotel document
            const hotelDoc = await transaction.get(hotelRef);
            if (!hotelDoc.exists()) {
                throw new Error("Hotel not found!");
            }

            const hotelData = hotelDoc.data();
            const currentRating = hotelData.rating || 0;
            
            // 3. Fetch all reviews to calculate the new average
            const allReviewsSnap = await getDocs(query(collection(db, `hotels/${reviewData.hotelId}/reviews`)));
            const totalReviews = allReviewsSnap.size;

            // Calculate the new average rating
            const newAverageRating = ((currentRating * totalReviews) + reviewData.rating) / (totalReviews + 1);

            // 4. Set the new review document
            transaction.set(newReviewRef, {
                ...reviewData,
                createdAt: serverTimestamp(),
            });

            // 5. Update the hotel's average rating
            transaction.update(hotelRef, { rating: newAverageRating });
        });
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: newReviewRef.path,
            operation: 'create',
            requestResourceData: reviewData,
        });
        errorEmitter.emit('permission-error', permissionError);

        // Re-throw the original error to be caught by the UI
        throw serverError;
    }
}
