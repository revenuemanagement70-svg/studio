'use client';
import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    fetch(API_URL + '/offers').then(r => r.json()).then(data => setOffers(data.data || [])).catch(() => {});
  }, []);

  const copyCode = (code: string) => { navigator.clipboard.writeText(code); setCopied(code); setTimeout(() => setCopied(''), 2000); };

  return (
    <>
      <section style={{ background: 'linear-gradient(180deg, #FFF0F3 0%, #FFFFFF 100%)', padding: '80px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '16px' }}>
            Exclusive <span style={{ background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Offers</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>Save more with these handpicked deals and coupon codes</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {offers.map((offer, i) => (
              <div key={offer.id} style={{ background: `linear-gradient(135deg, ${['#FF1F71,#FF7E5F', '#6366F1,#8B5CF6', '#059669,#10B981', '#F59E0B,#EF4444'][i % 4]})`, borderRadius: '20px', padding: '32px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px' }}>{offer.discount}% OFF</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>{offer.title}</h3>
                <p style={{ opacity: 0.9, marginBottom: '8px', lineHeight: 1.5 }}>{offer.description}</p>
                {offer.minBooking && <p style={{ opacity: 0.7, fontSize: '0.85rem', marginBottom: '4px' }}>Min. booking: ₹{offer.minBooking}</p>}
                {offer.maxDiscount && <p style={{ opacity: 0.7, fontSize: '0.85rem', marginBottom: '16px' }}>Max. discount: ₹{offer.maxDiscount}</p>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', letterSpacing: '2px', border: '1px dashed rgba(255,255,255,0.5)', flex: 1, textAlign: 'center' }}>{offer.code}</div>
                  <button onClick={() => copyCode(offer.code)} style={{ background: 'white', color: '#1A1A2E', border: 'none', borderRadius: '10px', padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                    {copied === offer.code ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <p style={{ opacity: 0.6, fontSize: '0.75rem', marginTop: '12px' }}>
                  Valid till: {new Date(offer.validTill).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          {offers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎁</div>
              <p style={{ color: '#64748B' }}>No offers available right now. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}