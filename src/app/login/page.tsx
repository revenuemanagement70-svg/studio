'use client';

import { AuthForm } from '@/components/auth/auth-form';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const params = useSearchParams();
    const mode = params.get('mode') === 'signup' ? 'signup' : 'login';

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary/30">
            <AuthForm mode={mode} />
        </div>
    )
}
