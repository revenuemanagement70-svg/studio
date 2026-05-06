'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [tab, setTab] = useState<'profile'|'password'|'bookings'>('profile');
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) { router.push('/login'); return; }
    try {
      const u = JSON.parse(userData);
      setUser(u);
      setName(u.name || '');
      setPhone(u.phone || '');
    } catch { router.push('/login'); }

    fetch(API_URL + '/bookings/my', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then(data => setBookings(data.data || []))
      .catch(() => {});
  }, [router]);

  const handleSaveProfile = async () => {
    setSaving(true); setMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL + '/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      localStorage.setItem('user', JSON.stringify({ ...user, name, phone }));
      setUser({ ...user, name, phone });
      setMsg('Profile updated successfully!');
    } catch (err: any) { setMsg(err.message); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    setPwMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL + '/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ oldPassword: oldPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setPwMsg('Password changed successfully!');
      setOldPw(''); setNewPw('');
    } catch (err: any) { setPwMsg(err.message); }
  };

  if (!user) return null;

  const tabs = [
    { key: 'profile', label: 'My Profile', icon: '👤' },
    { key: 'bookings', label: 'My Bookings', icon: '📋' },
    { key: 'password', label: 'Change Password', icon: '🔒' },
  ];

  return (
    <div className="container" style={{ padding: '32px 16px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, marginBottom: '24px' }}>My Account</h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)} style={{
            padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit',
            background: tab === t.key ? 'linear-gradient(135deg, #FF1F71, #FF7E5F)' : '#F1F5F9',
            color: tab === t.key ? 'white' : '#64748B',
            transition: 'all 0.3s',
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'profile' && (
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user.name}</div>
              <div style={{ color: '#64748B', fontSize: '0.85rem' }}>{user.email}</div>
              <span style={{ background: 'rgba(255,31,113,0.1)', color: '#FF1F71', padding: '2px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600 }}>{user.role}</span>
            </div>
          </div>
          {msg && <div style={{ padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem', fontWeight: 500, background: msg.includes('success') ? '#F0FDF4' : '#FEF2F2', color: msg.includes('success') ? '#22C55E' : '#EF4444' }}>{msg}</div>}
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label>Email (cannot change)</label>
            <input value={user.email} disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label>Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91-98765-43210" />
          </div>
          <button onClick={handleSaveProfile} className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {tab === 'password' && (
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Change Password</h2>
          {pwMsg && <div style={{ padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem', fontWeight: 500, background: pwMsg.includes('success') ? '#F0FDF4' : '#FEF2F2', color: pwMsg.includes('success') ? '#22C55E' : '#EF4444' }}>{pwMsg}</div>}
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label>Current Password</label>
            <input type="password" value={oldPw} onChange={e => setOldPw(e.target.value)} />
          </div>
          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label>New Password</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min 6 characters" />
          </div>
          <button onClick={handleChangePassword} className="btn btn-primary" disabled={!oldPw || !newPw}>Change Password</button>
        </div>
      )}

      {tab === 'bookings' && (
        <div>
          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📋</div>
              <h3 style={{ fontWeight: 700, marginBottom: '6px' }}>No bookings yet</h3>
              <p style={{ color: '#64748B', marginBottom: '16px' }}>Start exploring hotels and make your first booking!</p>
              <Link href="/search" className="btn btn-primary">Browse Hotels</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {bookings.map((b: any) => (
                <div key={b.id} style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{b.hotelName}</div>
                      <div style={{ color: '#64748B', fontSize: '0.8rem' }}>Ref: {b.bookingRef}</div>
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                      background: b.status === 'CONFIRMED' ? 'rgba(34,197,94,0.1)' : b.status === 'CANCELLED' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                      color: b.status === 'CONFIRMED' ? '#22C55E' : b.status === 'CANCELLED' ? '#EF4444' : '#F59E0B',
                    }}>{b.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.8rem', color: '#64748B', flexWrap: 'wrap' }}>
                    <span>Check-in: {new Date(b.checkin).toLocaleDateString()}</span>
                    <span>Check-out: {new Date(b.checkout).toLocaleDateString()}</span>
                    <span style={{ color: '#FF1F71', fontWeight: 700 }}>Rs.{b.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}