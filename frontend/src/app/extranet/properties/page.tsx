'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function ExtranetPropertiesPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(API_URL + '/extranet/properties', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json()).then(data => { setHotels(data.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div><h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>My Properties</h1><p style={{ color: '#64748B' }}>{hotels.length} properties listed</p></div>
      </div>
      {loading ? <div className="skeleton" style={{ height: '300px', borderRadius: '16px' }} /> : hotels.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', background: 'white', borderRadius: '16px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏨</div>
          <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>No properties yet</h3>
          <p style={{ color: '#64748B' }}>Contact admin to list your first property.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {hotels.map(hotel => {
            const images = (() => { try { return JSON.parse(hotel.images); } catch { return []; } })();
            return (
              <div key={hotel.id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <img src={images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ fontWeight: 700 }}>{hotel.name}</h3>
                    <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, background: hotel.status === 'ACTIVE' ? '#ECFDF5' : '#FEF3C7', color: hotel.status === 'ACTIVE' ? '#22C55E' : '#F59E0B' }}>{hotel.status}</span>
                  </div>
                  <p style={{ color: '#64748B', fontSize: '0.85rem' }}>📍 {hotel.city} • ⭐ {hotel.rating} • {hotel.rooms?.length || 0} room types</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}