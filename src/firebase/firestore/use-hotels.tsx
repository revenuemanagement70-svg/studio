'use client';

import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { hotel as Hotel } from '@/lib/types';
import { useCollection } from './use-collection';

export function useHotels() {
  const firestore = useFirestore();

  const hotelsCollection = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'hotels');
  }, [firestore]);

  const { data: hotels, loading, error } = useCollection<Hotel>(hotelsCollection);

  return { hotels, loading, error };
}
