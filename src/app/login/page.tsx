import { AuthForm } from '@/components/auth/auth-form';
import { Header } from '@/components/layout/header';

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <div className="container mx-auto flex min-h-[calc(100vh-6rem)] items-center justify-center px-5">
          <AuthForm mode="login" />
        </div>
      </main>
    </>
  );
}
