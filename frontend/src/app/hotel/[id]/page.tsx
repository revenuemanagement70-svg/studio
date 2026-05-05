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
    <div className="container" style={{ padding: '40px 24px' }}>
      <div className="skeleton" style={{ height: '400px', borderRadius: '20px', marginBottom: '32px' }} />
      <div className="skeleton" style={{ height: '30px', width: '300px', marginBottom: '16px' }} />
      <div className="skeleton" style={{ height: '20px', width: '200px' }} />
    </div>
  );

  if (!hotel) return (
    <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
      <h2>Hotel not found</h2>
      <Link href="/search" style={{ color: '#FF1F71', fontWeight: 600 }}>← Back to Search</Link>
    </div>
  );

  const images = Array.isArray(hotel.images) ? hotel.images : [];
  const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];

  const handleBook = (roomId: string) => {
    const bookingParams = new URLSearchParams();
    bookingParams.set('hotelId', hotelId);
    bookingParams.set('roomId', roomId);
    if (checkin) bookingParams.set('checkin', checkin);
    if (checkout) bookingParams.set('checkout', checkout);
    bookingParams.set('guests', guests.toString());
    router.push('/booking?' + bookingParams.toString());
  };

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <Link href="/search" style={{ color: '#FF1F71', fontSize: '0.9rem', fontWeight: 600, marginBottom: '20px', display: 'inline-block' }}>← Back to Search</Link>

      {/* Image Gallery */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px', borderRadius: '20px', overflow: 'hidden', marginBottom: '32px', height: '420px' }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={images[selectedImage] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '8px' }}>
          {images.slice(1, 3).map((img: string, i: number) => (
            <div key={i} style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => setSelectedImage(i + 1)}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }}>
        {/* Left Column - Hotel Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ background: '#FFB800', color: 'white', padding: '4px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem' }}>⭐ {hotel.rating}</span>
            <span style={{ background: 'rgba(255,31,113,0.1)', color: '#FF1F71', padding: '4px 12px', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' }}>{hotel.propertyType}</span>
            <span style={{ color: '#64748B', fontSize: '0.85rem' }}>{'⭐'.repeat(hotel.starRating || 3)}</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px' }}>{hotel.name}</h1>
          <p style={{ color: '#64748B', fontSize: '1rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            📍 {hotel.address || hotel.city}
          </p>
          <p style={{ color: '#64748B', lineHeight: 1.8, marginBottom: '32px' }}>{hotel.description}</p>

          {/* Amenities */}
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>Amenities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '40px' }}>
            {amenities.map((a: string) => (
              <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#FFF8F9', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 500 }}>
                <span>✓</span> {a}
              </div>
            ))}
          </div>

          {/* Rooms */}
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>Available Rooms</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            {(hotel.rooms || []).map((room: any) => {
              const roomAmenities = Array.isArray(room.amenities) ? room.amenities : [];
              return (
                <div key={room.id} style={{ border: '1.5px solid #F1E4E8', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{room.type}</h3>
                    <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '8px' }}>👥 Max {room.capacity} guests • {room.totalRooms} rooms available</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {roomAmenities.slice(0, 4).map((a: string) => (
                        <span key={a} style={{ background: '#F0F9FF', color: '#3B82F6', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 500 }}>{a}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FF1F71' }}>₹{room.basePrice?.toLocaleString()}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '12px' }}>per night + taxes</div>
                    <button onClick={() => handleBook(room.id)} className="btn btn-primary">Book Now</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reviews */}
          {hotel.reviews && hotel.reviews.length > 0 && (
            <>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>Guest Reviews ({hotel.reviews.length})</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {hotel.reviews.map((review: any) => (
                  <div key={review.id} style={{ padding: '20px', background: '#FFF8F9', borderRadius: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontWeight: 700 }}>{review.user?.name || 'Guest'}</div>
                      <div style={{ color: '#FFB800', fontWeight: 700 }}>{'⭐'.repeat(review.rating)}</div>
                    </div>
                    {review.title && <div style={{ fontWeight: 600, marginBottom: '4px' }}>{review.title}</div>}
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>{review.comment}</p>
                    {review.reply && (
                      <div style={{ marginTop: '12px', padding: '12px', background: 'white', borderRadius: '10px', borderLeft: '3px solid #FF1F71' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FF1F71', marginBottom: '4px' }}>Hotel Response</div>
                        <p style={{ color: '#64748B', fontSize: '0.85rem' }}>{review.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar - Booking Card */}
        <div>
          <div style={{ position: 'sticky', top: '96px', background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '1.5px solid #FDE8ED' }}>
            <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '4px' }}>Starting from</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FF1F71', marginBottom: '20px' }}>
              ₹{Math.min(...(hotel.rooms || []).map((r: any) => r.basePrice || 999)).toLocaleString()}
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748B' }}>/night</span>
            </div>

            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label>Check-in</label>
              <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} />
            </div>
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label>Check-out</label>
              <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} />
            </div>
            <div className="input-group" style={{ marginBottom: '24px' }}>
              <label>Guests</label>
              <select value={guests} onChange={e => setGuests(Number(e.target.value))}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <button onClick={() => hotel.rooms?.[0] && handleBook(hotel.rooms[0].id)} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Book Now
            </button>
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8rem', color: '#94A3B8' }}>
              ✓ Free cancellation • ✓ No prepayment needed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}