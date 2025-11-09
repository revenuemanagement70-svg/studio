'use client';

import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { useEffect } from 'react';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      console.error(error.toString());

      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: error.message,
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);
  return children;
}
