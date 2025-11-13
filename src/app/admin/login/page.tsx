
'use client';

import { AuthForm } from '@/components/auth/auth-form';
import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <main>
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-8 px-5">
        <Link href="/" className="text-3xl font-black gradient-text font-headline">
          Staylo
        </Link>
        <AuthForm mode="login" isAdminLogin={true} />
      </div>
    </main>
  );
}
