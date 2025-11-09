'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { hotel as Hotel } from '@/lib/types';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type FavoriteRef = {
  hotelId: string;
};

export function useFavorites(userId: string | undefined) {
  const firestore = useFirestore();
  const [favorites, setFavorites] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  const favoritesCollection = useMemo(() => {
    if (!firestore || !userId) return null;
    return collection(firestore, 'users', userId, 'favorites');
  }, [firestore, userId]);


  useEffect(() => {
    if (!favoritesCollection || !firestore) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      favoritesCollection,
      async (snapshot) => {
        const favoriteRefs = snapshot.docs.map(doc => doc.data() as FavoriteRef);
        
        try {
          const favoriteHotels = await Promise.all(
            favoriteRefs.map(async (fav) => {
              if (!firestore) return null;
              const hotelDocRef = doc(firestore, 'hotels', fav.hotelId);
              const hotelDoc = await getDoc(hotelDocRef);
              if (hotelDoc.exists()) {
                return { id: hotelDoc.id, ...hotelDoc.data() } as Hotel;
              }
              return null;
            })
          );
          
          setFavorites(favoriteHotels.filter((h): h is Hotel => h !== null));
        } catch (error) {
           console.error("Error fetching favorite hotel details:", error);
        } finally {
            setLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching favorite references:", error);
        const permissionError = new FirestorePermissionError({
          path: favoritesCollection.path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [favoritesCollection, firestore]);

  return { favorites, loading };
}
