import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './config';
import { useAuth, useFirebase, useFirebaseApp, useFirestore, useStorage } from './provider';
import { useUser } from './auth/use-user';
import { FirebaseProvider } from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useCollection } from './firestore/use-collection';

export function initializeFirebase() {
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);
  return { app, auth, firestore, storage };
}

export {
  useAuth,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useStorage,
  useUser,
  useCollection,
  FirebaseProvider,
  FirebaseClientProvider,
};
