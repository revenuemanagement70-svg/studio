'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hotelId = searchParams.get('hotelId');
  const roomId = searchParams.get('roomId');
  const checkinParam = searchParams.get('checkin') || '';
  const checkoutParam = searchParams.get('checkout') || '';
  const guestsParam = parseInt(searchParams.get('guests') || '2');

  const [hotel, setHotel] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [confirmed, setConfirmed] = useState<any>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [checkin, setCheckin] = useState(checkinParam);
  const [checkout, setCheckout] = useState(checkoutParam);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hotelId) return;
    fetch(API_URL + '/hotels/' + hotelId)
      .then(r => r.json())
      .then(data => {
        const h = data.data || data;
        setHotel(h);
        if (roomId && h.rooms) {
          const r = h.rooms.find((rm: any) => rm.id === roomId);
          setRoom(r || h.rooms[0]);
        } else if (h.rooms?.[0]) {
          setRoom(h.rooms[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const u = JSON.parse(userData);
        setGuestName(u.name || '');
        setGuestEmail(u.email || '');
      } catch {}
    }
  }, [hotelId, roomId]);

  const nights = checkin && checkout ? Math.max(1, Math.ceil((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000)) : 1;
  const roomPrice = room?.basePrice || 0;
  const subtotal = roomPrice * nights;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + taxes - discount;

  const applyCoupon = async () => {
    try {
      const res = await fetch(API_URL + '/offers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon, amount: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDiscount(data.data.discountAmount);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBooking = async () => {
    if (!guestName || !guestEmail || !checkin || !checkout) {
      setError('Please fill all required fields');
      return;
    }
    setBooking(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }
      const res = await fetch(API_URL + '/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ roomId: room.id, checkin, checkout, guests: guestsParam, guestName, guestEmail, guestPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed');
      setConfirmed(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}><div className="skeleton" style={{ width: '300px', height: '30px', margin: '0 auto' }} /></div>;

  if (confirmed) return (
    <div className="container" style={{ padding: '80px 24px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '48px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 24px' }}>âœ…</div>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 900, marginBottom: '8px' }}>Booking Confirmed!</h1>
        <p style={{ color: '#64748B', marginBottom: '24px' }}>Your reservation has been confirmed.</p>
        <div style={{ background: '#FFF8F9', borderRadius: '16px', padding: '24px', textAlign: 'left', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div><span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Booking Ref</span><div style={{ fontWeight: 700, color: '#FF1F71' }}>{confirmed.bookingRef}</div></div>
            <div><span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Hotel</span><div style={{ fontWeight: 600 }}>{confirmed.hotelName || hotel?.name}</div></div>
            <div><span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Check-in</span><div style={{ fontWeight: 600 }}>{new Date(confirmed.checkin).toLocaleDateString()}</div></div>
            <div><span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Check-out</span><div style={{ fontWeight: 600 }}>{new Date(confirmed.checkout).toLocaleDateString()}</div></div>
            <div><span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Total</span><div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#FF1F71' }}>â‚¹{confirmed.totalPrice?.toLocaleString()}</div></div>
            <div><span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Status</span><div className="badge badge-success">Confirmed</div></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/my-bookings" className="btn btn-primary">View My Bookings</Link>
          <Link href="/" className="btn btn-outline">Back to Home</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '32px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Link href={hotel ? '/hotel/' + hotel.id : '/search'} style={{ color: '#FF1F71', fontSize: '0.9rem', fontWeight: 600, marginBottom: '24px', display: 'inline-block' }}>â† Back</Link>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '32px' }}>Complete Your Booking</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        <div>
          {/* Guest Details */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '20px' }}>Guest Details</h2>
            {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '12px', marginBottom: '16px', color: '#EF4444', fontSize: '0.9rem' }}>{error}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="input-group"><label>Full Name *</label><input type="text" value={guestName} onChange={e => setGuestName(e.target.value)} required /></div>
              <div className="input-group"><label>Email *</label><input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} required /></div>
              <div className="input-group"><label>Phone</label><input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} /></div>
              <div className="input-group"><label>Guests</label><input type="number" value={guestsParam} readOnly /></div>
            </div>
          </div>

          {/* Dates */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '20px' }}>Stay Dates</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="input-group"><label>Check-in *</label><input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} required /></div>
              <div className="input-group"><label>Check-out *</label><input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} required /></div>
            </div>
          </div>

          {/* Coupon */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '20px' }}>Have a Coupon?</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input type="text" value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="Enter coupon code" style={{ flex: 1, padding: '12px 16px', border: '1.5px solid #F1E4E8', borderRadius: '10px', fontFamily: 'inherit', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '1px' }} />
              <button onClick={applyCoupon} className="btn btn-outline">Apply</button>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div>
          <div style={{ position: 'sticky', top: '96px', background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '1.5px solid #FDE8ED' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>Price Summary</h3>
            <div style={{ padding: '16px', background: '#FFF8F9', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{hotel?.name}</div>
              <div style={{ color: '#64748B', fontSize: '0.85rem' }}>{room?.type} â€¢ {nights} night{nights > 1 ? 's' : ''}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748B' }}>Room ({nights} night{nights > 1 ? 's' : ''})</span>
                <span style={{ fontWeight: 600 }}>â‚¹{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748B' }}>Taxes & Fees (18%)</span>
                <span style={{ fontWeight: 600 }}>â‚¹{taxes.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#22C55E' }}>
                  <span>Coupon Discount</span>
                  <span style={{ fontWeight: 600 }}>-â‚¹{discount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ borderTop: '1.5px solid #F1E4E8', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: '1.3rem', color: '#FF1F71' }}>â‚¹{total.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={handleBooking} className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={booking}>
              {booking ? 'Processing...' : 'Confirm Booking'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8rem', color: '#94A3B8' }}>
              âœ“ Pay at hotel â€¢ âœ“ Free cancellation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}