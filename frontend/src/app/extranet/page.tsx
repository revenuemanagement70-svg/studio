'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function ExtranetDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(API_URL + '/extranet/dashboard', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json())
      .then(data => { setStats(data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '16px', marginBottom: '16px' }} />)}</div>;

  const cards = [
    { label: 'Total Hotels', value: stats?.totalHotels || 0, icon: 'ðŸ¨', color: '#FF1F71' },
    { label: 'Total Rooms', value: stats?.totalRooms || 0, icon: 'ðŸ›ï¸', color: '#6366F1' },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: 'ðŸ“‹', color: '#059669' },
    { label: 'Avg Rating', value: stats?.avgRating || 0, icon: 'â­', color: '#F59E0B' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 900, marginBottom: '8px' }}>Partner Dashboard</h1>
      <p style={{ color: '#64748B', marginBottom: '32px' }}>Welcome back! Here is your property overview.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {cards.map(card => (
          <div key={card.label} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
              <span style={{ fontSize: '0.8rem', color: card.color, fontWeight: 600, padding: '4px 12px', background: `${card.color}15`, borderRadius: '999px' }}>Live</span>
            </div>
            <div style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: 900, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', borderRadius: '16px', padding: '28px', color: 'white' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '8px' }}>Total Revenue</div>
          <div style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: 900 }}>â‚¹{(stats?.totalRevenue || 0).toLocaleString()}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', borderRadius: '16px', padding: '28px', color: 'white' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '8px' }}>Platform Commission (20%)</div>
          <div style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: 900 }}>â‚¹{(stats?.commission || 0).toLocaleString()}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #059669, #10B981)', borderRadius: '16px', padding: '28px', color: 'white' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '8px' }}>Your Earnings</div>
          <div style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: 900 }}>â‚¹{(stats?.partnerEarnings || 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '16px' }}>Recent Bookings</h2>
        {stats?.recentBookings?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stats.recentBookings.map((b: any) => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#FFF8F9', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.bookingRef} - {b.hotelName}</div>
                  <div style={{ color: '#64748B', fontSize: '0.8rem' }}>{new Date(b.checkin).toLocaleDateString()} â†’ {new Date(b.checkout).toLocaleDateString()}</div>
                </div>
                <div style={{ fontWeight: 700, color: '#FF1F71' }}>â‚¹{b.totalPrice?.toLocaleString()}</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#94A3B8', textAlign: 'center', padding: '40px 0' }}>No bookings yet</p>
        )}
      </div>
    </div>
  );
}