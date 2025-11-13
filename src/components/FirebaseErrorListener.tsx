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
    const handlePermissionError = (error: any) => {
      // better logging
      console.error("Firestore error:", {
        code: error.code,        // e.g. "permission-denied"
        message: error.message,
        context: error.context,  // The custom context we added
        stack: error.stack
      });

      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: error.message || "You don't have permission for this action.",
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);
  return children;
}
