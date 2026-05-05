'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function ExtranetBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(API_URL + '/extranet/bookings', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json()).then(data => { setBookings(data.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Bookings</h1>
      <p style={{ color: '#64748B', marginBottom: '24px' }}>{bookings.length} total bookings</p>
      {loading ? <div className="skeleton" style={{ height: '400px', borderRadius: '16px' }} /> : bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', background: 'white', borderRadius: '16px' }}><p style={{ color: '#94A3B8' }}>No bookings yet</p></div>
      ) : (
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'auto', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#FFF8F9', borderBottom: '1px solid #F1E4E8' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>Booking</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>Guest</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>Dates</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>Amount</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>Status</th>
            </tr></thead>
            <tbody>{bookings.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 20px' }}><div style={{ fontWeight: 600 }}>{b.bookingRef}</div><div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{b.room?.hotel?.name}</div></td>
                <td style={{ padding: '14px 20px' }}><div style={{ fontWeight: 500 }}>{b.user?.name}</div><div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{b.user?.email}</div></td>
                <td style={{ padding: '14px 20px', color: '#64748B', fontSize: '0.85rem' }}>{new Date(b.checkin).toLocaleDateString()} â†’ {new Date(b.checkout).toLocaleDateString()}</td>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#FF1F71' }}>â‚¹{b.totalPrice?.toLocaleString()}</td>
                <td style={{ padding: '14px 20px' }}><span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, background: b.status === 'CONFIRMED' ? '#ECFDF5' : '#FEF3C7', color: b.status === 'CONFIRMED' ? '#22C55E' : '#F59E0B' }}>{b.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}