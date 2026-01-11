
'use client';

import {
    collection,
    doc,
    addDoc,
    updateDoc,
    serverTimestamp,
    Firestore,
    query,
    where,
    getDocs
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { ApiKey } from '@/lib/types';
import { Buffer } from 'buffer';

async function sha256(message: string) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function generateSecureApiKey() {
    const key = crypto.randomUUID().replace(/-/g, '');
    return `sty_${key}`;
}

export async function generateApiKey(db: Firestore, userId: string) {
    const plaintextKey = generateSecureApiKey();
    const keyHash = await sha256(plaintextKey);
    const keyPrefix = plaintextKey.substring(0, 7);

    const keysCollection = collection(db, 'users', userId, 'apiKeys');
    
    const apiKeyData = {
        userId,
        keyPrefix,
        keyHash,
        createdAt: serverTimestamp(),
        status: 'active'
    };

    try {
        await addDoc(keysCollection, apiKeyData);
        return { plaintextKey };
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: keysCollection.path,
            operation: 'create',
            requestResourceData: { userId, keyPrefix }, // Don't log hash or key
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    }
}

export async function listApiKeys(db: Firestore, userId: string): Promise<ApiKey[]> {
    const keysCollection = collection(db, 'users', userId, 'apiKeys');
    const q = query(keysCollection, where('status', '==', 'active'));
    
    try {
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ApiKey));
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: keysCollection.path,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    }
}

export async function revokeApiKey(db: Firestore, userId: string, keyId: string) {
    const keyRef = doc(db, 'users', userId, 'apiKeys', keyId);
    
    try {
        await updateDoc(keyRef, { status: 'revoked' });
    } catch (serverError) {
        const permissionError = new FirestorePermissionError({
            path: keyRef.path,
            operation: 'update',
            requestResourceData: { status: 'revoked' },
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    }
}

export async function validateApiKey(db: Firestore, apiKey: string): Promise<boolean> {
    if (!apiKey || !apiKey.startsWith('sty_')) {
        return false;
    }

    const keyHash = await sha256(apiKey);
    const keysQuery = query(
        collection(db, 'users'),
        // This is a simplified query. In a real scenario, you'd query a dedicated top-level collection of key hashes.
        // Querying all users is not scalable.
        where('apiKeyHashes', 'array-contains', keyHash) 
    );
    // This is a placeholder for a more complex validation logic which would likely involve a backend function
    // for security and scalability reasons.
    
    return false;
}
