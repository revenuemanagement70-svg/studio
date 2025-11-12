import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { useAuth, useFirebase, useFirebaseApp, useFirestore } from './provider';
import { useUser } from './auth/use-user';
import { FirebaseProvider } from './provider';
import { FirebaseClientProvider } from './client-provider';

export function initializeFirebase() {
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { app, auth, firestore };
}

export {
  useAuth,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useUser,
  FirebaseProvider,
  FirebaseClientProvider,
};
