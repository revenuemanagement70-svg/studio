'use client';

import { useState, useEffect } from 'react';
import type { CollectionReference, Query } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T>(ref: CollectionReference | Query | null) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ref) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const dataList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as T));
        setData(dataList);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`Error fetching collection at ref path:`, err);
        setError(`Failed to fetch data. Check permissions or network.`);
        if (ref && 'path' in ref) {
            const permissionError = new FirestorePermissionError({
            path: ref.path,
            operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.path]);

  return { data, loading, error };
}
