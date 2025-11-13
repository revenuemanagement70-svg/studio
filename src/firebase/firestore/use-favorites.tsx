'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { hotel as Hotel } from '@/lib/types';
import { useCollection } from './use-collection';

type FavoriteRef = {
  hotelId: string;
  id: string; // The favorite doc's ID is the hotel ID
};

export function useFavorites(userId: string | undefined) {
  const firestore = useFirestore();
  const [favorites, setFavorites] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const favoritesCollectionRef = useMemo(() => {
    if (!firestore || !userId) return null;
    return collection(firestore, 'users', userId, 'favorites');
  }, [firestore, userId]);
  
  const { data: favoriteRefs, loading: favoriteRefsLoading, error: favoriteRefsError } = useCollection<FavoriteRef>(favoritesCollectionRef);

  useEffect(() => {
    if (favoriteRefsError) {
      setError(favoriteRefsError);
      setLoading(false);
      return;
    }

    if (favoriteRefsLoading) {
      setLoading(true);
      return;
    }
    
    if (!firestore || !favoriteRefs) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const fetchFavoriteHotels = async () => {
        setLoading(true);
        try {
          const favoriteHotels = await Promise.all(
            favoriteRefs.map(async (fav) => {
              if (!firestore) return null;
              // The document ID of the favorite is the hotelId
              const hotelDocRef = doc(firestore, 'hotels', fav.id);
              const hotelDoc = await getDoc(hotelDocRef);
              if (hotelDoc.exists()) {
                return { id: hotelDoc.id, ...hotelDoc.data() } as Hotel;
              }
              return null;
            })
          );
          
          setFavorites(favoriteHotels.filter((h): h is Hotel => h !== null && !h.deleted));
          setError(null);
        } catch (err) {
           console.error("Error fetching favorite hotel details:", err);
           setError("Could not load favorite hotels.");
        } finally {
            setLoading(false);
        }
    };
    
    fetchFavoriteHotels();

  }, [favoriteRefs, favoriteRefsLoading, favoriteRefsError, firestore]);

  return { favorites, loading, error };
}
