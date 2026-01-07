
'use client';

import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { createUserProfile } from '@/firebase/firestore/users';
import { Loader2 } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="size-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <title>Google</title>
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.86 2.25-4.82 2.25-3.44 0-6.5-2.33-6.5-5.65s3.06-5.65 6.5-5.65c1.96 0 3.3.81 4.15 1.6l2.3-2.3C18.16 3.82 15.61 2.5 12.48 2.5c-5.49 0-9.92 4.02-9.92 9s4.43 9 9.92 9c5.22 0 9.55-3.32 9.55-9.25 0-.81-.07-1.35-.16-1.83z"
    />
  </svg>
);

interface GoogleSignInButtonProps {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    disabled?: boolean;
    loading?: boolean;
}

export function GoogleSignInButton({ setLoading, setError, disabled, loading }: GoogleSignInButtonProps) {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  
  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) {
        setError("Authentication service is not available.");
        return;
    }

    setLoading(true);
    setError(null);
    
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      // Create user profile document in Firestore if it doesn't exist
      await createUserProfile(firestore, userCredential.user);
      router.push('/admin');
    } catch (err: any) {
      const friendlyError = err.code?.replace('auth/', '').replace(/-/g, ' ') || 'An error occurred.';
      setError(friendlyError.charAt(0).toUpperCase() + friendlyError.slice(1));
    } finally {
        setLoading(false);
    }
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={disabled}>
      {loading && <Loader2 className="animate-spin" />}
      {!loading && <GoogleIcon />}
      <span className="ml-2">{loading ? "Connecting..." : "Sign in with Google"}</span>
    </Button>
  );
}
