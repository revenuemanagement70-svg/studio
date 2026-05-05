'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) { router.push('/login'); return; }
    try {
      const u = JSON.parse(userData);
      if (u.role !== 'ADMIN') { router.push('/'); return; }
      setUser(u);
    } catch { router.push('/login'); }
  }, [router]);

  if (!user) return null;

  const links = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/hotels', label: 'Hotels', icon: '🏨' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/finance', label: 'Finance', icon: '💰' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
      <aside style={{ width: '260px', background: '#0F172A', padding: '24px 16px', position: 'sticky', top: '72px', height: 'calc(100vh - 72px)', overflowY: 'auto' }}>
        <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: '14px', color: 'white', marginBottom: '24px' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>⚙️ Super Admin</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Platform Control</div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {links.map(link => (
            <Link key={link.href} href={link.href} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px',
              fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
              background: pathname === link.href ? 'rgba(255,31,113,0.15)' : 'transparent',
              color: pathname === link.href ? '#FF5C8D' : '#94A3B8',
            }}>
              <span>{link.icon}</span> {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '32px', background: '#F8FAFC' }}>
        {children}
      </main>
    </div>
  );
}