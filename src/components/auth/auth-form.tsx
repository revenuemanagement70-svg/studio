'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
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
}

export function AuthForm({ mode }: AuthFormProps) {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const title = mode === 'login' ? 'Welcome Back!' : 'Create an Account';
  const description = mode === 'login' ? 'Sign in to continue to your account.' : 'Enter your details to get started.';
  const buttonText = mode === 'login' ? 'Log In (Anonymous)' : 'Sign Up';
  const alternativeText = mode === 'login' ? "Don't have an account?" : 'Already have an account?';
  const alternativeLink = mode === 'login' ? '/signup' : '/login';
  const alternativeLinkText = mode === 'login' ? 'Sign Up' : 'Log In';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!auth) {
      setError('Authentication service is not available.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Bypass email/password for login and use anonymous sign-in
        await signInAnonymously(auth);
      }
      router.push('/');
    } catch (err: any) {
      const friendlyError = err.code?.replace('auth/', '').replace(/-/g, ' ') || 'An error occurred.';
      setError(friendlyError.charAt(0).toUpperCase() + friendlyError.slice(1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' ? (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
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
                        disabled={loading}
                        />
                    </div>
                </>
            ) : (
                <p className="text-sm text-center text-muted-foreground p-4 bg-secondary rounded-md">
                    Click the button below to sign in as an anonymous user for development.
                </p>
            )}

          {error && <p className="text-destructive text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            {loading ? 'Please wait...' : buttonText}
          </Button>
        </form>
        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-muted-foreground">OR</span>
        </div>
        <GoogleSignInButton setLoading={setLoading} setError={setError} />
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          {alternativeText}{' '}
          <Link href={alternativeLink} className="font-semibold text-primary hover:underline">
            {alternativeLinkText}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
