'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(API_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      const role = data.data.user.role;
      if (role === 'ADMIN') router.push('/admin');
      else if (role === 'PARTNER') router.push('/extranet');
      else router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #FFF0F3 0%, #FFFFFF 100%)', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '440px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.5rem', margin: '0 auto 16px' }}>S</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>Welcome Back</h1>
          <p style={{ color: '#64748B' }}>Sign in to your Staylo account</p>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', color: '#EF4444', fontSize: '0.9rem', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="input-group" style={{ marginBottom: '24px' }}>
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" style={{ color: '#FF1F71', fontWeight: 600 }}>Sign Up</Link>
            </p>
          </div>

          {/* Test Accounts */}
          <div style={{ marginTop: '24px', padding: '16px', background: '#F8FAFC', borderRadius: '12px' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>Test Accounts:</p>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.8 }}>
              <div>Ã°Å¸â€˜Â¤ Guest: guest@staylo.in / guest123</div>
              <div>Ã°Å¸ÂÂ¢ Partner: partner@staylo.in / partner123</div>
              <div>Ã¢Å¡â„¢Ã¯Â¸Â Admin: admin@staylo.in / admin123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}