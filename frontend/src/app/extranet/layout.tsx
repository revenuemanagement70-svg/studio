'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function ExtranetLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) { router.push('/login'); return; }
    try {
      const u = JSON.parse(userData);
      if (u.role !== 'PARTNER' && u.role !== 'ADMIN') { router.push('/'); return; }
      setUser(u);
    } catch { router.push('/login'); }
  }, [router]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (!user) return null;

  const links = [
    { href: '/extranet', label: 'Dashboard', icon: '📊' },
    { href: '/extranet/properties', label: 'Properties', icon: '🏨' },
    { href: '/extranet/bookings', label: 'Bookings', icon: '📋' },
    { href: '/extranet/reviews', label: 'Reviews', icon: '⭐' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Mobile Toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
        display: 'none', position: 'fixed', bottom: '20px', right: '20px', zIndex: 99,
        width: '52px', height: '52px', borderRadius: '50%', border: 'none',
        background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', color: 'white',
        fontSize: '1.3rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,31,113,0.4)',
      }} className="sidebar-toggle">☰</button>

      {/* Overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 97 }} className="sidebar-overlay" />}

      {/* Sidebar */}
      <aside className={`panel-sidebar ${sidebarOpen ? 'open' : ''}`} style={{
        width: '240px', background: 'white', borderRight: '1px solid #F1E4E8',
        padding: '20px 12px', position: 'sticky', top: '64px', height: 'calc(100vh - 64px)',
        overflowY: 'auto', flexShrink: 0, zIndex: 98, transition: 'transform 0.3s',
      }}>
        <div style={{ padding: '10px 14px', background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', borderRadius: '12px', color: 'white', marginBottom: '20px' }}>
          <div style={{ fontWeight: 800, fontSize: '1rem' }}>Extranet</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Partner Portal</div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {links.map(link => (
            <Link key={link.href} href={link.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px',
              fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s',
              background: pathname === link.href ? '#FFF0F3' : 'transparent',
              color: pathname === link.href ? '#FF1F71' : '#64748B',
            }}><span>{link.icon}</span> {link.label}</Link>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '24px', background: '#FFF8F9', minWidth: 0 }}>{children}</main>

      <style jsx>{`
        @media (max-width: 768px) {
          .sidebar-toggle { display: flex !important; align-items: center; justify-content: center; }
          .panel-sidebar { position: fixed !important; left: 0; top: 64px; bottom: 0; transform: translateX(-100%); box-shadow: 4px 0 20px rgba(0,0,0,0.15); }
          .panel-sidebar.open { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}