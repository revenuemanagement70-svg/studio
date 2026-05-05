'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = roleFilter ? '?role=' + roleFilter : '';
    fetch(API_URL + '/admin/users' + params, { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json()).then(data => { setUsers(data.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, [roleFilter]);

  const changeRole = async (id: string, role: string) => {
    const token = localStorage.getItem('token');
    await fetch(API_URL + '/admin/users/' + id + '/role', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ role }) });
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div><h1 style={{ fontSize: '1.8rem', fontWeight: 900 }}>User Management</h1><p style={{ color: '#64748B' }}>{users.length} users</p></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['', 'GUEST', 'PARTNER', 'ADMIN'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} style={{ padding: '8px 16px', borderRadius: '999px', border: 'none', fontWeight: 600, fontSize: '0.85rem', background: roleFilter === r ? '#FF1F71' : '#F1F5F9', color: roleFilter === r ? 'white' : '#64748B', cursor: 'pointer', fontFamily: 'inherit' }}>{r || 'All'}</button>
          ))}
        </div>
      </div>
      {loading ? <div className="skeleton" style={{ height: '400px', borderRadius: '16px' }} /> : (
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>User</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>Role</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>Bookings</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>Hotels</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>Joined</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.85rem', color: '#64748B' }}>Actions</th>
            </tr></thead>
            <tbody>{users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 20px' }}><div style={{ fontWeight: 600 }}>{user.name}</div><div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{user.email}</div></td>
                <td style={{ padding: '14px 20px' }}><span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, background: user.role === 'ADMIN' ? '#EDE9FE' : user.role === 'PARTNER' ? '#FFF0F3' : '#F0F9FF', color: user.role === 'ADMIN' ? '#7C3AED' : user.role === 'PARTNER' ? '#FF1F71' : '#3B82F6' }}>{user.role}</span></td>
                <td style={{ padding: '14px 20px', fontWeight: 600 }}>{user._count?.bookings || 0}</td>
                <td style={{ padding: '14px 20px', fontWeight: 600 }}>{user._count?.hotels || 0}</td>
                <td style={{ padding: '14px 20px', color: '#64748B', fontSize: '0.85rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '14px 20px' }}>
                  <select value={user.role} onChange={e => changeRole(user.id, e.target.value)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    <option value="GUEST">Guest</option>
                    <option value="PARTNER">Partner</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}