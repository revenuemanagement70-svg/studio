'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetch(API_URL + '/bookings/my', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json())
      .then(data => { setBookings(data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter.toUpperCase());

  const statusColor = (s: string) => {
    if (s === 'CONFIRMED') return { bg: '#ECFDF5', color: '#22C55E' };
    if (s === 'PENDING') return { bg: '#FEF3C7', color: '#F59E0B' };
    if (s === 'CANCELLED') return { bg: '#FEF2F2', color: '#EF4444' };
    return { bg: '#F0F9FF', color: '#3B82F6' };
  };

  return (
    <div className="container" style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 900, marginBottom: '8px' }}>My Bookings</h1>
      <p style={{ color: '#64748B', marginBottom: '32px' }}>Manage your upcoming and past reservations</p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'confirmed', 'pending', 'cancelled', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 20px', borderRadius: '999px', border: 'none', fontWeight: 600, fontSize: '0.85rem',
            background: filter === f ? 'linear-gradient(135deg, #FF1F71, #FF7E5F)' : '#FFF8F9',
            color: filter === f ? 'white' : '#64748B', cursor: 'pointer', transition: 'all 0.3s', fontFamily: 'inherit',
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div>{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '16px', marginBottom: '16px' }} />)}</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>ðŸ“‹</div>
          <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>No bookings found</h3>
          <p style={{ color: '#64748B', marginBottom: '24px' }}>Start your journey by booking your first stay!</p>
          <Link href="/search" className="btn btn-primary">Search Hotels</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(booking => {
            const sc = statusColor(booking.status);
            return (
              <div key={booking.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #F1E4E8' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{booking.hotelName}</h3>
                    <span style={{ background: sc.bg, color: sc.color, padding: '3px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>{booking.status}</span>
                  </div>
                  <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
                    Ref: {booking.bookingRef} â€¢ {new Date(booking.checkin).toLocaleDateString()} â†’ {new Date(booking.checkout).toLocaleDateString()} â€¢ {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FF1F71' }}>â‚¹{booking.totalPrice?.toLocaleString()}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>incl. taxes</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}