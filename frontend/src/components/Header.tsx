'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setMenuOpen(false);
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
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid #FDE8ED' : '1px solid transparent',
        transition: 'all 0.3s ease', boxShadow: scrolled ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>S</div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FF1F71' }}>Staylo</span>
          </Link>

          <a href="tel:+919899308683" className="desktop-phone">Call: +91-98993-08683</a>

          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{ fontSize: '0.9rem', fontWeight: 500, color: pathname === link.href ? '#FF1F71' : '#64748B', transition: 'all 0.3s ease' }}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="desktop-actions">
            <Link href="/extranet" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>
              List your property
            </Link>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link href='/profile' style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A1A2E' }}>
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

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div className={`mobile-overlay ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(false)} />

      {/* Mobile Slide-in Nav */}
      <nav className={`mobile-nav ${menuOpen ? 'active' : ''}`}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className={pathname === link.href ? 'active' : ''}>
            {link.label}
          </Link>
        ))}
        <div style={{ borderTop: '1px solid #F1E4E8', margin: '12px 0', paddingTop: '12px' }}>
          <Link href="/extranet">🏢 List your property</Link>
          <a href="tel:+919899308683" style={{ display: 'block', padding: '14px 16px', color: '#FF1F71', fontWeight: 600 }}>📞 +91-98993-08683</a>
        </div>
        <div style={{ borderTop: '1px solid #F1E4E8', margin: '12px 0', paddingTop: '12px' }}>
          {user ? (
            <>
              <Link href='/profile'>
                👤 My Profile
              </Link>
              <Link href="/saved">💝 Saved Hotels</Link>
              <button onClick={handleLogout} style={{ width: '100%', marginTop: '8px' }} className="btn btn-outline">Logout</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '12px', padding: '0 16px' }}>
              <Link href="/login" className="btn btn-outline" style={{ flex: 1 }}>Log In</Link>
              <Link href="/register" className="btn btn-primary" style={{ flex: 1 }}>Sign Up</Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}