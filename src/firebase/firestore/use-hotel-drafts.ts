'use client';

import { useMemo } from 'react';
import { collection, query, doc, writeBatch, Firestore } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { hotel as Hotel } from '@/lib/types';
import { useCollection } from './use-collection';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useHotelDrafts() {
  const firestore = useFirestore();

  // Pointing directly to the 'hotels' collection now.
  const draftsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'hotels'));
  }, [firestore]);

  const { data: drafts, loading, error } = useCollection<Hotel>(draftsQuery);

  return { drafts, loading, error };
}

// This function is no longer complex. It simply resolves a promise
// as the concept of "publishing" is removed from this simplified flow.
export async function publishHotelDraft(db: Firestore, draft: Hotel): Promise<void> {
    console.log("Publishing is no longer required in this simplified flow for:", draft.id);
    return Promise.resolve();
}
