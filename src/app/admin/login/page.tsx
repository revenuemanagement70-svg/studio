'use client';

import { AuthForm } from '@/components/auth/auth-form';

export default function AdminLoginPage() {
    return (
        <AuthForm mode="login" isAdminLogin={true} />
    )
}
