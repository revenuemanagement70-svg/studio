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

  const draftsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'hotels_draft'));
  }, [firestore]);

  const { data: drafts, loading, error } = useCollection<Hotel>(draftsQuery);

  return { drafts, loading, error };
}

export async function publishHotelDraft(db: Firestore, draft: Hotel) {
    const draftRef = doc(db, 'hotels_draft', draft.id);
    const hotelRef = doc(db, 'hotels', draft.id);

    const batch = writeBatch(db);

    // Copy the draft data to the live hotels collection
    batch.set(hotelRef, { ...draft, id: undefined }); // Remove id from data payload
    
    // Delete the draft document
    batch.delete(draftRef);

    try {
        await batch.commit();
    } catch(serverError) {
        const permissionError = new FirestorePermissionError({
            path: `/hotels_draft/${draft.id} -> /hotels/${draft.id}`,
            operation: 'write',
            requestResourceData: draft
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    }
}
