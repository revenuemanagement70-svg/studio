'use client';

import { useState, useEffect } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
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
  const [error, setError] = useState<any>(null);

  const favoritesCollectionRef = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    return collection(firestore, 'users', userId, 'favorites');
  }, [firestore, userId]);
  
  const { data: favoriteRefs, loading: favoriteRefsLoading, error: favoriteRefsError } = useCollection<FavoriteRef>(favoritesCollectionRef);

  useEffect(() => {
    if (favoriteRefsError) {
      setError(favoriteRefsError);
      setFavorites([]);
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
        if (favoriteRefs.length === 0) {
            setFavorites([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
          const favoriteHotelPromises = favoriteRefs.map(async (fav) => {
              if (!firestore) return null;
              const hotelDocRef = doc(firestore, 'hotels', fav.id);
              const hotelDoc = await getDoc(hotelDocRef);
              if (hotelDoc.exists() && !hotelDoc.data().deleted) {
                return { id: hotelDoc.id, ...hotelDoc.data() } as Hotel;
              }
              return null;
          });

          const favoriteHotels = (await Promise.all(favoriteHotelPromises))
              .filter((h): h is Hotel => h !== null);
          
          setFavorites(favoriteHotels);
          setError(null);
        } catch (err) {
           console.error("Error fetching favorite hotel details:", err);
           setError("Could not load favorite hotels.");
           setFavorites([]);
        } finally {
            setLoading(false);
        }
    };
    
    fetchFavoriteHotels();

  }, [favoriteRefs, firestore, favoriteRefsError, favoriteRefsLoading]);

  return { favorites, loading, error };
}
