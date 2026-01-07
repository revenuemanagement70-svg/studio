
'use client';

import { doc, setDoc, getDoc, Firestore, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Creates a user profile document in Firestore if it doesn't already exist.
 * This is crucial for new user sign-ups to ensure their data is stored.
 * 
 * @param db The Firestore instance.
 * @param user The Firebase Auth user object.
 */
export async function createUserProfile(db: Firestore, user: User) {
  const userRef = doc(db, 'users', user.uid);
  
  try {
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      // Document doesn't exist, so create it.
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      // Use setDoc to create the document. No await needed for non-blocking UI.
      setDoc(userRef, userData)
        .catch((serverError) => {
          console.error("Failed to create user profile:", serverError);
          const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'create',
            requestResourceData: userData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
    }
  } catch (error) {
    // This catches errors from getDoc, which could be a permission issue itself.
     console.error("Failed to check for user profile:", error);
     const permissionError = new FirestorePermissionError({
        path: userRef.path,
        operation: 'get',
     });
     errorEmitter.emit('permission-error', permissionError);
  }
}
