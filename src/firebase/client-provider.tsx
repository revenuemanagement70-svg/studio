'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { initializeFirebase } from '.';

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
export const FirebaseContext = createContext<{
  app: ReturnType<typeof initializeFirebase>['app'];
  auth: ReturnType<typeof initializeFirebase>['auth'];
  firestore: ReturnType<typeof initializeFirebase>['firestore'];
} | null>(null);
