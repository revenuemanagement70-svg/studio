"use client";

import {
  useContext,
} from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { FirebaseContext } from './client-provider';


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
