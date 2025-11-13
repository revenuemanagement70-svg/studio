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
      try {
        // 1) Print full object with console.dir (devtools friendly)
        console.group("Firestore error (full)");
        console.dir(error); // shows full object in devtools
        // 2) Also list own property names (including non-enumerable)
        console.log("Own property names:", Object.getOwnPropertyNames(error));
        for (const k of Object.getOwnPropertyNames(error)) {
          try { console.log(k, error[k]); } catch (e) { console.log(k, "<cannot read>"); }
        }
        // 3) JSON-safe dump of enumerable props
        try {
          console.log("JSON dump:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        } catch (_) {
          console.log("JSON dump failed (circular or non-serializable).");
        }
        console.groupEnd();
      } catch (e) {
        console.error("Error while logging Firestore error:", e);
      }

      // user-visible toast
      toast({
        title: "Firestore error",
        description: error?.message || "Permission error or unknown Firestore error. Check console.",
        variant: "destructive"
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);
  
  return children;
}
