'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function AdminFinancePage() {
  const [finance, setFinance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(API_URL + '/admin/finance', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json()).then(data => { setFinance(data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="skeleton" style={{ height: '300px', borderRadius: '16px' }} />;

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Finance Overview</h1>
      <p style={{ color: '#64748B', marginBottom: '32px' }}>Platform financial overview and commission tracking</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', borderRadius: '20px', padding: '32px', color: 'white' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '12px' }}>Total Revenue</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>₹{(finance?.totalRevenue || 0).toLocaleString()}</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '8px' }}>{finance?.totalBookings || 0} bookings</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #059669, #10B981)', borderRadius: '20px', padding: '32px', color: 'white' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '12px' }}>Commission Earned</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>₹{(finance?.totalCommission || 0).toLocaleString()}</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '8px' }}>20% commission rate</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', borderRadius: '20px', padding: '32px', color: 'white' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '12px' }}>Partner Payouts</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>₹{((finance?.totalRevenue || 0) - (finance?.totalCommission || 0)).toLocaleString()}</div>
          <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '8px' }}>80% to partners</div>
        </div>
      </div>
    </div>
  );
}