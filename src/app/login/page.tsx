'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthForm } from '@/components/auth/auth-form';
import { Skeleton } from '@/components/ui/skeleton';

function LoginContent() {
    const params = useSearchParams();
    const mode = params.get('mode') === 'signup' ? 'signup' : 'login';

    return <AuthForm mode={mode} />;
}

function LoginSkeleton() {
    return (
        <div className="w-full max-w-md space-y-6">
            <Skeleton className="h-10 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="space-y-4 pt-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary/30 p-4">
            <Suspense fallback={<LoginSkeleton />}>
                <LoginContent />
            </Suspense>
        </div>
    )
}
