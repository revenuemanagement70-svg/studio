
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { GoogleSignInButton } from './google-signin-button';
import { Separator } from '../ui/separator';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  isAdminLogin?: boolean;
}

export function AuthForm({ mode, isAdminLogin = false }: AuthFormProps) {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [anonymousLoading, setAnonymousLoading] = useState(false);

  const title = isAdminLogin ? 'Admin Sign In' : (mode === 'login' ? 'Welcome Back!' : 'Create an Account');
  const description = isAdminLogin ? 'Enter your credentials to access the dashboard.' : (mode === 'login' ? 'Sign in to continue to your account.' : 'Enter your details to get started.');
  const buttonText = mode === 'login' ? 'Log In' : 'Sign Up';

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!auth) {
      setError('Authentication service is not available.');
      setLoading(false);
      return;
    }
    
    if (!email || !password) {
        setError('Email and password are required.');
        setLoading(false);
        return;
    }

    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      if (isAdminLogin) {
          router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      const friendlyError = err.code?.replace('auth/', '').replace(/-/g, ' ') || 'An error occurred.';
      setError(friendlyError.charAt(0).toUpperCase() + friendlyError.slice(1));
    } finally {
      setLoading(false);
    }
  };
  
  const handleAnonymousSignIn = async () => {
    setError(null);
    setAnonymousLoading(true);

    if (!auth) {
      setError('Authentication service is not available.');
      setAnonymousLoading(false);
      return;
    }

    try {
        await signInAnonymously(auth);
        router.push('/');
    } catch (err: any) {
        const friendlyError = err.code?.replace('auth/', '').replace(/-/g, ' ') || 'An error occurred.';
        setError(friendlyError.charAt(0).toUpperCase() + friendlyError.slice(1));
    } finally {
        setAnonymousLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || anonymousLoading}
              />
          </div>
          <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading || anonymousLoading}
              />
          </div>
          {error && <p className="text-destructive text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading || anonymousLoading}>
            {loading && <Loader2 className="animate-spin" />}
            {loading ? 'Please wait...' : buttonText}
          </Button>
        </form>

        {isAdminLogin && (
          <>
            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">OR</span>
            </div>

            <div className='flex flex-col gap-4'>
                <GoogleSignInButton setLoading={setLoading} setError={setError} />

                {mode === 'login' && (
                    <Button onClick={handleAnonymousSignIn} variant="secondary" className="w-full" disabled={loading || anonymousLoading}>
                        {anonymousLoading && <Loader2 className="animate-spin" />}
                        {anonymousLoading ? 'Signing in...' : 'Log In as Anonymous User'}
                    </Button>
                )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
