'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { hotel as Hotel } from '@/lib/types';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';


export function useHotels() {
  const firestore = useFirestore();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firestore) {
      setLoading(false);
      setError("Firestore is not available.");
      return;
    }

    const hotelsCollection = collection(firestore, 'hotels');
    
    const unsubscribe = onSnapshot(
        hotelsCollection, 
        (snapshot: QuerySnapshot<DocumentData>) => {
            const hotelList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hotel));
            setHotels(hotelList);
            setLoading(false);
        },
        (err) => {
            console.error("Error fetching hotels:", err);
            setError("Failed to fetch properties. Check permissions or network.");
            const permissionError = new FirestorePermissionError({
              path: hotelsCollection.path,
              operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
            setLoading(false);
        }
    );

    return () => unsubscribe();
  }, [firestore]);

  return { hotels, loading, error };
}
