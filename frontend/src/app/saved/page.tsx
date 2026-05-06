'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function parseJSON(val: any): any[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { return JSON.parse(val); } catch { return []; } }
  return [];
}

export default function SavedHotelsPage() {
  const router = useRouter();
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetch(API_URL + '/saved', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then(data => { setSaved(data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  const handleUnsave = async (hotelId: string) => {
    const token = localStorage.getItem('token');
    await fetch(API_URL + '/saved/' + hotelId, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } });
    setSaved(saved.filter(s => s.hotel?.id !== hotelId && s.hotelId !== hotelId));
  };

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, marginBottom: '8px' }}>Saved Hotels</h1>
      <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '28px' }}>Your wishlist of favorite stays</p>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {[1,2,3].map(i => (<div key={i} className="card"><div className="skeleton" style={{ height: '180px' }} /><div style={{ padding: '16px' }}><div className="skeleton" style={{ height: '18px', marginBottom: '8px' }} /><div className="skeleton" style={{ height: '14px', width: '60%' }} /></div></div>))}
        </div>
      ) : saved.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>💝</div>
          <h3 style={{ fontWeight: 700, marginBottom: '6px' }}>No saved hotels yet</h3>
          <p style={{ color: '#64748B', marginBottom: '16px' }}>Tap the heart icon on any hotel to save it here.</p>
          <Link href="/search" className="btn btn-primary">Browse Hotels</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {saved.map((item: any) => {
            const hotel = item.hotel || item;
            const images = parseJSON(hotel.images);
            return (
              <div key={hotel.id} className="card" style={{ position: 'relative' }}>
                <button onClick={() => handleUnsave(hotel.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 2, fontSize: '1.1rem' }} title="Remove">
                  ❤️
                </button>
                <Link href={'/hotel/' + hotel.id}>
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img src={images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '14px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{hotel.name}</h3>
                    <p style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: '8px' }}>{hotel.city}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ background: '#FFB800', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>{hotel.rating}</span>
                      <span className="btn btn-primary btn-sm">View</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}