'use client';

import { useMemo } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { hotel as Hotel } from '@/lib/types';
import { useCollection } from './use-collection';

export function useHotels() {
  const firestore = useFirestore();

  const hotelsQuery = useMemo(() => {
    if (!firestore) return null;
    // Query for hotels that are NOT soft-deleted.
    return query(collection(firestore, 'hotels'), where('deleted', '!=', true));
  }, [firestore]);

  const { data: hotels, loading, error } = useCollection<Hotel>(hotelsQuery);

  return { hotels, loading, error };
}
