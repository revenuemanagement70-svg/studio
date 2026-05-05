'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.id as string;
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    fetch(API_URL + '/hotels/' + hotelId)
      .then(r => r.json())
      .then(data => { setHotel(data.data || data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [hotelId]);

  if (loading) return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <div className="skeleton" style={{ height: '280px', borderRadius: '16px', marginBottom: '24px' }} />
      <div className="skeleton" style={{ height: '24px', width: '250px', marginBottom: '12px' }} />
      <div className="skeleton" style={{ height: '16px', width: '180px' }} />
    </div>
  );

  if (!hotel) return (
    <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}>
      <h2>Hotel not found</h2>
      <Link href="/search" style={{ color: '#FF1F71', fontWeight: 600 }}>← Back to Search</Link>
    </div>
  );

  const images = Array.isArray(hotel.images) ? hotel.images : [];
  const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];

  const handleBook = (roomId: string) => {
    const bp = new URLSearchParams();
    bp.set('hotelId', hotelId); bp.set('roomId', roomId);
    if (checkin) bp.set('checkin', checkin);
    if (checkout) bp.set('checkout', checkout);
    bp.set('guests', guests.toString());
    router.push('/booking?' + bp.toString());
  };

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <Link href="/search" style={{ color: '#FF1F71', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px', display: 'inline-block' }}>← Back to Search</Link>

      {/* Image Gallery */}
      <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
        {/* Main Image */}
        <div style={{ position: 'relative', height: 'clamp(220px, 40vw, 400px)', overflow: 'hidden' }}>
          <img src={images[selectedImage] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        {/* Thumbnails */}
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: '4px', marginTop: '4px', overflow: 'auto' }}>
            {images.slice(0, 5).map((img: string, i: number) => (
              <div key={i} onClick={() => setSelectedImage(i)} style={{ width: '80px', height: '60px', flexShrink: 0, cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', border: selectedImage === i ? '2px solid #FF1F71' : '2px solid transparent' }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
        {/* Left Column - Info */}
        <div style={{ flex: '1 1 500px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ background: '#FFB800', color: 'white', padding: '3px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>⭐ {hotel.rating}</span>
            <span style={{ background: 'rgba(255,31,113,0.1)', color: '#FF1F71', padding: '3px 10px', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem' }}>{hotel.propertyType}</span>
            <span style={{ color: '#64748B', fontSize: '0.8rem' }}>{'⭐'.repeat(hotel.starRating || 3)}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', fontWeight: 900, marginBottom: '6px' }}>{hotel.name}</h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '20px' }}>📍 {hotel.address || hotel.city}</p>
          <p style={{ color: '#64748B', lineHeight: 1.7, marginBottom: '28px', fontSize: '0.9rem' }}>{hotel.description}</p>

          {/* Amenities */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>Amenities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px', marginBottom: '32px' }}>
            {amenities.map((a: string) => (
              <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: '#FFF8F9', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500 }}>
                <span style={{ color: '#22C55E' }}>✓</span> {a}
              </div>
            ))}
          </div>

          {/* Rooms */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>Available Rooms</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {(hotel.rooms || []).map((room: any) => {
              const roomAmenities = Array.isArray(room.amenities) ? room.amenities : [];
              return (
                <div key={room.id} style={{ border: '1.5px solid #F1E4E8', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ flex: '1 1 200px' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>{room.type}</h3>
                      <p style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: '8px' }}>👥 Max {room.capacity} guests • {room.totalRooms} rooms</p>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {roomAmenities.slice(0, 4).map((a: string) => (
                          <span key={a} style={{ background: '#F0F9FF', color: '#3B82F6', padding: '2px 8px', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 500 }}>{a}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FF1F71' }}>₹{room.basePrice?.toLocaleString()}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '10px' }}>per night + taxes</div>
                      <button onClick={() => handleBook(room.id)} className="btn btn-primary btn-sm">Book Now</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reviews */}
          {hotel.reviews?.length > 0 && (
            <>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>Guest Reviews ({hotel.reviews.length})</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {hotel.reviews.map((review: any) => (
                  <div key={review.id} style={{ padding: '16px', background: '#FFF8F9', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{review.user?.name || 'Guest'}</span>
                      <span style={{ color: '#FFB800', fontWeight: 700, fontSize: '0.85rem' }}>{'⭐'.repeat(review.rating)}</span>
                    </div>
                    {review.title && <div style={{ fontWeight: 600, marginBottom: '4px', fontSize: '0.9rem' }}>{review.title}</div>}
                    <p style={{ color: '#64748B', fontSize: '0.85rem' }}>{review.comment}</p>
                    {review.reply && (
                      <div style={{ marginTop: '10px', padding: '10px', background: 'white', borderRadius: '8px', borderLeft: '3px solid #FF1F71' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#FF1F71', marginBottom: '2px' }}>Hotel Response</div>
                        <p style={{ color: '#64748B', fontSize: '0.8rem' }}>{review.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Booking Sidebar */}
        <div style={{ flex: '0 0 340px', width: '100%', maxWidth: '340px' }} className="booking-sidebar">
          <div style={{ position: 'sticky', top: '88px', background: 'white', borderRadius: '18px', padding: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '1.5px solid #FDE8ED' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '2px' }}>Starting from</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FF1F71', marginBottom: '16px' }}>
              ₹{Math.min(...(hotel.rooms || []).map((r: any) => r.basePrice || 999)).toLocaleString()}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748B' }}>/night</span>
            </div>
            <div className="input-group" style={{ marginBottom: '12px' }}>
              <label>Check-in</label>
              <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} />
            </div>
            <div className="input-group" style={{ marginBottom: '12px' }}>
              <label>Check-out</label>
              <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} />
            </div>
            <div className="input-group" style={{ marginBottom: '20px' }}>
              <label>Guests</label>
              <select value={guests} onChange={e => setGuests(Number(e.target.value))}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <button onClick={() => hotel.rooms?.[0] && handleBook(hotel.rooms[0].id)} className="btn btn-primary btn-lg" style={{ width: '100%' }}>Book Now</button>
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.75rem', color: '#94A3B8' }}>✓ Free cancellation • ✓ No prepayment</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .booking-sidebar { flex: 1 1 100% !important; max-width: 100% !important; order: -1; }
          .booking-sidebar > div { position: static !important; }
        }
      `}</style>
    </div>
  );
}