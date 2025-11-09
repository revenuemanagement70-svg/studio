'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { PersonalizedHotelRecommendationsOutput } from '@/ai/flows/personalized-hotel-recommendations';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type FavoriteHotel = PersonalizedHotelRecommendationsOutput['hotelRecommendations'][0];

export function useFavorites(userId: string | undefined) {
  const firestore = useFirestore();
  const [favorites, setFavorites] = useState<FavoriteHotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !firestore) {
      setLoading(false);
      return;
    }

    const favoritesCollection = collection(firestore, 'users', userId, 'favorites');
    
    const unsubscribe = onSnapshot(
        favoritesCollection, 
        (snapshot: QuerySnapshot<DocumentData>) => {
            const favs = snapshot.docs.map(doc => doc.data() as FavoriteHotel);
            setFavorites(favs);
            setLoading(false);
        },
        (error) => {
            console.error("Error fetching favorites:", error);
            const permissionError = new FirestorePermissionError({
              path: favoritesCollection.path,
              operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
            setLoading(false);
        }
    );

    return () => unsubscribe();
  }, [userId, firestore]);

  return { favorites, loading };
}
