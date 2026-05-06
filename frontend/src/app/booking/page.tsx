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
  const [payMode, setPayMode] = useState<'online'|'hotel'>('hotel');

  useEffect(() => {
    if (!hotelId) return;
    fetch(API_URL + '/hotels/' + hotelId)
      .then(r => r.json())
      .then(data => {
        const h = data.data?.hotel || data.data || data;
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon, amount: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDiscount(data.data?.discountAmount || 0);
    } catch (err: any) { setError(err.message); }
  };

  const handlePayAtHotel = async () => {
    if (!guestName || !guestEmail || !checkin || !checkout) { setError('Please fill all required fields'); return; }
    setBooking(true); setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }
      const res = await fetch(API_URL + '/payments/pay-at-hotel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ roomId: room.id, checkin, checkout, guests: guestsParam, guestName, guestEmail, guestPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed');
      setConfirmed(data.data);
    } catch (err: any) { setError(err.message); }
    finally { setBooking(false); }
  };

  const handlePayOnline = async () => {
    if (!guestName || !guestEmail || !checkin || !checkout) { setError('Please fill all required fields'); return; }
    setBooking(true); setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }
      const res = await fetch(API_URL + '/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ roomId: room.id, checkin, checkout, guests: guestsParam, guestName, guestEmail, guestPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order creation failed');

      const orderData = data.data;

      // Load Razorpay
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay({
          key: orderData.key,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Staylo.in',
          description: orderData.description,
          order_id: orderData.orderId,
          prefill: orderData.prefill,
          theme: { color: '#FF1F71' },
          handler: async (response: any) => {
            const verifyRes = await fetch(API_URL + '/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
              body: JSON.stringify({ bookingId: orderData.bookingId, ...response }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok) setConfirmed(verifyData.data);
            else setError('Payment verification failed');
            setBooking(false);
          },
          modal: { ondismiss: () => setBooking(false) },
        });
        rzp.open();
      } else {
        // Fallback: confirm directly if Razorpay not loaded
        const verifyRes = await fetch(API_URL + '/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify({ bookingId: orderData.bookingId, razorpay_payment_id: 'pay_demo_' + Date.now() }),
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.ok) setConfirmed(verifyData.data);
        else setError('Payment failed');
        setBooking(false);
      }
    } catch (err: any) { setError(err.message); setBooking(false); }
  };

  if (loading) return <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}><div className="skeleton" style={{ width: '300px', height: '30px', margin: '0 auto' }} /></div>;

  if (confirmed) return (
    <div className="container" style={{ padding: '60px 16px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '40px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px' }}>OK</div>
        <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', fontWeight: 900, marginBottom: '8px' }}>Booking Confirmed!</h1>
        <p style={{ color: '#64748B', marginBottom: '24px' }}>Your reservation has been confirmed.</p>
        <div style={{ background: '#FFF8F9', borderRadius: '16px', padding: '20px', textAlign: 'left', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
            <div><span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Booking Ref</span><div style={{ fontWeight: 700, color: '#FF1F71' }}>{confirmed.bookingRef}</div></div>
            <div><span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Hotel</span><div style={{ fontWeight: 600 }}>{confirmed.hotelName || hotel?.name}</div></div>
            <div><span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Check-in</span><div style={{ fontWeight: 600 }}>{new Date(confirmed.checkin).toLocaleDateString()}</div></div>
            <div><span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Check-out</span><div style={{ fontWeight: 600 }}>{new Date(confirmed.checkout).toLocaleDateString()}</div></div>
            <div><span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Total</span><div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#FF1F71' }}>Rs.{confirmed.totalPrice?.toLocaleString()}</div></div>
            <div><span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Status</span><div className="badge badge-success">Confirmed</div></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/profile" className="btn btn-primary">My Bookings</Link>
          <Link href="/" className="btn btn-outline">Home</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '32px 16px', maxWidth: '1000px', margin: '0 auto' }}>
      <Link href={hotel ? '/hotel/' + hotel.id : '/search'} style={{ color: '#FF1F71', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px', display: 'inline-block' }}>Back</Link>
      <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', fontWeight: 900, marginBottom: '28px' }}>Complete Your Booking</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        <div>
          <div style={{ background: 'white', borderRadius: '18px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Guest Details</h2>
            {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', color: '#EF4444', fontSize: '0.85rem' }}>{error}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              <div className="input-group"><label>Full Name *</label><input value={guestName} onChange={e => setGuestName(e.target.value)} required /></div>
              <div className="input-group"><label>Email *</label><input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} required /></div>
              <div className="input-group"><label>Phone</label><input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} /></div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '18px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Stay Dates</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="input-group"><label>Check-in *</label><input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} required /></div>
              <div className="input-group"><label>Check-out *</label><input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} required /></div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '18px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Coupon Code</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="Enter code" style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #F1E4E8', borderRadius: '10px', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px' }} />
              <button onClick={applyCoupon} className="btn btn-outline btn-sm">Apply</button>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '18px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Payment Method</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {(['hotel', 'online'] as const).map(mode => (
                <button key={mode} onClick={() => setPayMode(mode)} style={{
                  flex: '1 1 140px', padding: '14px', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
                  border: payMode === mode ? '2px solid #FF1F71' : '2px solid #F1E4E8',
                  background: payMode === mode ? '#FFF0F3' : 'white',
                  color: payMode === mode ? '#FF1F71' : '#64748B',
                }}>
                  {mode === 'hotel' ? 'Pay at Hotel' : 'Pay Online (Razorpay)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={{ position: 'sticky', top: '80px', background: 'white', borderRadius: '18px', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '1.5px solid #FDE8ED' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '14px', fontSize: '1rem' }}>Price Summary</h3>
            <div style={{ padding: '14px', background: '#FFF8F9', borderRadius: '12px', marginBottom: '16px' }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{hotel?.name}</div>
              <div style={{ color: '#64748B', fontSize: '0.8rem' }}>{room?.type} - {nights} night{nights > 1 ? 's' : ''}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748B' }}>Room ({nights} night{nights > 1 ? 's' : ''})</span>
                <span style={{ fontWeight: 600 }}>Rs.{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748B' }}>Taxes (18%)</span>
                <span style={{ fontWeight: 600 }}>Rs.{taxes.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#22C55E' }}>
                  <span>Discount</span><span style={{ fontWeight: 600 }}>-Rs.{discount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ borderTop: '1.5px solid #F1E4E8', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#FF1F71' }}>Rs.{total.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={payMode === 'online' ? handlePayOnline : handlePayAtHotel} className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={booking}>
              {booking ? 'Processing...' : payMode === 'online' ? 'Pay Rs.' + total.toLocaleString() : 'Confirm Booking'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.75rem', color: '#94A3B8' }}>
              {payMode === 'hotel' ? 'Pay directly at hotel check-in' : 'Secure payment via Razorpay'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>}>
        <BookingContent />
      </Suspense>
    </>
  );
}