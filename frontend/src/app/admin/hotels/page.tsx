'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const loadHotels = () => {
    const token = localStorage.getItem('token');
    const params = filter ? '?status=' + filter : '';
    fetch(API_URL + '/admin/hotels' + params, { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json()).then(data => { setHotels(data.data || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { loadHotels(); }, [filter]);

  const toggleFeatured = async (id: string) => {
    const token = localStorage.getItem('token');
    await fetch(API_URL + '/admin/hotels/' + id + '/feature', { method: 'PATCH', headers: { 'Authorization': 'Bearer ' + token } });
    loadHotels();
  };

  const approveHotel = async (id: string) => {
    const token = localStorage.getItem('token');
    await fetch(API_URL + '/admin/hotels/' + id + '/approve', { method: 'PATCH', headers: { 'Authorization': 'Bearer ' + token } });
    loadHotels();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div><h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Hotel Management</h1><p style={{ color: '#64748B' }}>{hotels.length} hotels on platform</p></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['', 'ACTIVE', 'PENDING', 'INACTIVE'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 16px', borderRadius: '999px', border: 'none', fontWeight: 600, fontSize: '0.85rem', background: filter === s ? '#FF1F71' : '#F1F5F9', color: filter === s ? 'white' : '#64748B', cursor: 'pointer', fontFamily: 'inherit' }}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>
      {loading ? <div className="skeleton" style={{ height: '400px', borderRadius: '16px' }} /> : (
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'auto', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>Hotel</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>City</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>Rating</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>Status</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>Featured</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>Actions</th>
            </tr></thead>
            <tbody>
              {hotels.map(hotel => (
                <tr key={hotel.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 20px' }}><div style={{ fontWeight: 600 }}>{hotel.name}</div><div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{hotel.partner?.email}</div></td>
                  <td style={{ padding: '14px 20px', color: '#64748B' }}>{hotel.city}</td>
                  <td style={{ padding: '14px 20px' }}><span style={{ fontWeight: 700, color: '#FFB800' }}>â­ {hotel.rating}</span></td>
                  <td style={{ padding: '14px 20px' }}><span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, background: hotel.status === 'ACTIVE' ? '#ECFDF5' : hotel.status === 'PENDING' ? '#FEF3C7' : '#FEF2F2', color: hotel.status === 'ACTIVE' ? '#22C55E' : hotel.status === 'PENDING' ? '#F59E0B' : '#EF4444' }}>{hotel.status}</span></td>
                  <td style={{ padding: '14px 20px' }}><span style={{ color: hotel.isFeatured ? '#FF1F71' : '#94A3B8', fontWeight: 700 }}>{hotel.isFeatured ? 'â­ Yes' : 'No'}</span></td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {hotel.status === 'PENDING' && <button onClick={() => approveHotel(hotel.id)} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#22C55E', color: 'white', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>Approve</button>}
                      <button onClick={() => toggleFeatured(hotel.id)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', color: '#64748B' }}>
                        {hotel.isFeatured ? 'Unfeature' : 'Feature'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}