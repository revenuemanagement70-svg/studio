'use client';

import React, { createContext, useMemo } from 'react';
import { initializeFirebase } from '.';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

export const FirebaseContext = createContext<{
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} | null>(null);

// `FirebaseContext` is being provided in the root layout, so we don't
// need to provide it again here.
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebaseContext = useMemo(() => initializeFirebase(), []);
  return (
    <FirebaseContext.Provider value={firebaseContext}>
      {children}
    </FirebaseContext.Provider>
  );
}
