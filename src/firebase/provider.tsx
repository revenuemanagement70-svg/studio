"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth, User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

// Look at using react-firebase-hooks for this
// https://github.com/CSFrequency/react-firebase-hooks

export const FirebaseContext = createContext<{
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
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

export function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <FirebaseErrorListener>
      {children}
    </FirebaseErrorListener>
  );
}
