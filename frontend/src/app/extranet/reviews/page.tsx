'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function ExtranetReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(API_URL + '/extranet/reviews', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json()).then(data => { setReviews(data.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Guest Reviews</h1>
      <p style={{ color: '#64748B', marginBottom: '24px' }}>{reviews.length} reviews</p>
      {loading ? <div className="skeleton" style={{ height: '300px', borderRadius: '16px' }} /> : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', background: 'white', borderRadius: '16px' }}><p style={{ color: '#94A3B8' }}>No reviews yet</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div><span style={{ fontWeight: 700 }}>{r.user?.name}</span> <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>on {r.hotel?.name}</span></div>
                <span style={{ color: '#FFB800', fontWeight: 700 }}>{'⭐'.repeat(r.rating)}</span>
              </div>
              {r.title && <div style={{ fontWeight: 600, marginBottom: '4px' }}>{r.title}</div>}
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}