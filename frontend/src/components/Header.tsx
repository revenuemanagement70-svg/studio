'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try { setUser(JSON.parse(userData)); } catch { setUser(null); }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Search Hotels', href: '/search' },
    { label: 'Destinations', href: '/#destinations' },
    { label: 'Offers', href: '/offers' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: scrolled ? '1px solid #FDE8ED' : '1px solid transparent',
      transition: 'all 0.3s ease', boxShadow: scrolled ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>S</div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FF1F71' }}>Staylo</span>
        </Link>

        <a href="tel:+919899308683" style={{ fontSize: '0.85rem', color: '#FF1F71', fontWeight: 600, marginLeft: '16px' }}>
          Call: +91-98993-08683
        </a>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px', flex: 1, justifyContent: 'center' }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} style={{ fontSize: '0.9rem', fontWeight: 500, color: pathname === link.href ? '#FF1F71' : '#64748B', transition: 'all 0.3s ease' }}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/extranet" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>
            🏢 List your property
          </Link>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link href={user.role === 'ADMIN' ? '/admin' : user.role === 'PARTNER' ? '/extranet' : '/my-bookings'} style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A1A2E' }}>
                Hi, {user.name.split(' ')[0]}
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline btn-sm">Log In</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}