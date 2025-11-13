'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { initializeFirebase } from '.';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

const FirebaseContext = createContext<{
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
} | null>(null);

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function useFirebaseApp() {
  const context = useFirebase();
  return context?.app ?? null;
}

export function useFirestore() {
  const context = useFirebase();
  return context?.firestore ?? null;
}

export function useAuth() {
  const context = useFirebase();
  return context?.auth ?? null;
}

export function useStorage() {
  const context = useFirebase();
  return context?.storage ?? null;
}

export function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebaseContext = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseContext.Provider value={firebaseContext}>
        <FirebaseErrorListener>
            {children}
        </FirebaseErrorListener>
    </FirebaseContext.Provider>
  );
}
