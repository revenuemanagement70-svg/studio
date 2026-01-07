'use client';

import { useState, useEffect } from 'react';
import { collection, doc, getDoc, Firestore } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import type { hotel as Hotel } from '@/lib/types';
import { useCollection } from './use-collection';

type FavoriteRef = {
  hotelId: string;
  id: string; // The favorite doc's ID is the hotel ID
};

async function fetchFavoriteHotels(
  firestore: Firestore,
  favoriteRefs: FavoriteRef[]
): Promise<Hotel[]> {
  if (favoriteRefs.length === 0) {
    return [];
  }

  const favoriteHotelPromises = favoriteRefs.map(async (fav) => {
    const hotelDocRef = doc(firestore, 'hotels', fav.id);
    const hotelDoc = await getDoc(hotelDocRef);
    if (hotelDoc.exists() && !hotelDoc.data().deleted) {
      return { id: hotelDoc.id, ...hotelDoc.data() } as Hotel;
    }
    return null;
  });

  const favoriteHotels = (await Promise.all(favoriteHotelPromises))
    .filter((h): h is Hotel => h !== null);
  
  return favoriteHotels;
}


export function useFavorites(userId: string | undefined) {
  const firestore = useFirestore();
  const [favorites, setFavorites] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const favoritesCollectionRef = useMemoFirebase(() => {
    if (!firestore || !userId) return null;
    return collection(firestore, 'users', userId, 'favorites');
  }, [firestore, userId]);
  
  const { data: favoriteRefs, loading: favoriteRefsLoading, error: favoriteRefsError } = useCollection<FavoriteRef>(favoritesCollectionRef);

  useEffect(() => {
    if (!firestore) return;

    if (favoriteRefsLoading) {
      setLoading(true);
      return;
    }
    
    if (favoriteRefsError) {
      console.error("Error fetching favorite refs:", favoriteRefsError);
      setError("Could not load favorite references.");
      setLoading(false);
      return;
    }

    if (!favoriteRefs) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    
    fetchFavoriteHotels(firestore, favoriteRefs)
      .then(hotels => {
        if (isMounted) {
          setFavorites(hotels);
          setError(null);
        }
      })
      .catch(err => {
        console.error("Error fetching favorite hotel details:", err);
        if (isMounted) {
          setError("Could not load favorite hotels.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
    
  }, [favoriteRefs, firestore, favoriteRefsLoading, favoriteRefsError]);

  return { favorites, loading, error };
}
