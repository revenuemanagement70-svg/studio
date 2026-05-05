'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(API_URL + '/admin/dashboard', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json())
      .then(data => { setStats(data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '16px', marginBottom: '16px' }} />)}</div>;

  const cards = [
    { label: 'Total Hotels', value: stats?.totalHotels || 0, icon: 'ðŸ¨', color: '#FF1F71' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: 'ðŸ‘¥', color: '#6366F1' },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: 'ðŸ“‹', color: '#059669' },
    { label: 'Pending Approvals', value: stats?.pendingHotels || 0, icon: 'â³', color: '#F59E0B' },
    { label: 'Partners', value: stats?.partnersCount || 0, icon: 'ðŸ¢', color: '#8B5CF6' },
    { label: 'Guests', value: stats?.guestsCount || 0, icon: 'ðŸŽ«', color: '#3B82F6' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 900, marginBottom: '8px' }}>Super Admin Dashboard</h1>
      <p style={{ color: '#64748B', marginBottom: '32px' }}>Platform-wide overview and control center</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {cards.map(card => (
          <div key={card.label} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div style={{ background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', borderRadius: '16px', padding: '32px', color: 'white' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '8px' }}>Total Platform Revenue</div>
          <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900 }}>â‚¹{(stats?.totalRevenue || 0).toLocaleString()}</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #059669, #10B981)', borderRadius: '16px', padding: '32px', color: 'white' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '8px' }}>Commission Earned (20%)</div>
          <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900 }}>â‚¹{(stats?.platformCommission || 0).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}