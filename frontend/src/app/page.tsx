'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface Hotel { id: string; name: string; city: string; rating: number; starRating: number; images: string; propertyType: string; rooms: { basePrice: number }[]; }
interface City { id: string; name: string; state: string; image: string; hotelCount: number; }
interface Offer { id: string; code: string; title: string; description: string; discount: number; }

export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [guests, setGuests] = useState('2');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(API_URL + '/hotels/featured').then(r => r.json()).catch(() => ({ data: [] })),
      fetch(API_URL + '/cities/popular').then(r => r.json()).catch(() => ({ data: [] })),
      fetch(API_URL + '/offers').then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([hotelsRes, citiesRes, offersRes]) => {
      setHotels(hotelsRes.data?.hotels || hotelsRes.data || []);
      setCities(citiesRes.data || []);
      setOffers(offersRes.data || []);
      setLoading(false);
    });
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (checkin) params.set('checkin', checkin);
    if (checkout) params.set('checkout', checkout);
    if (guests) params.set('guests', guests);
    router.push('/search?' + params.toString());
  };

  const getLowestPrice = (hotel: Hotel) => {
    if (!hotel.rooms || hotel.rooms.length === 0) return 0;
    return Math.min(...hotel.rooms.map(r => r.basePrice));
  };

  const getImages = (hotel: Hotel) => {
    try { return JSON.parse(hotel.images); } catch { return []; }
  };

  const selectStyle: React.CSSProperties = { border: 'none', outline: 'none', fontSize: '0.95rem', fontWeight: 600, color: '#1A1A2E', background: 'transparent', width: '100%', cursor: 'pointer', fontFamily: 'inherit' };
  const labelStyle: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' as const, letterSpacing: '0.5px', display: 'block', marginBottom: '4px' };

  return (
    <>
      {/* ===== HERO ===== */}
      <section style={{ background: 'linear-gradient(180deg, #FFF0F3 0%, #FFFFFF 100%)', padding: '60px 0 40px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', padding: '6px 16px', borderRadius: '9999px', boxShadow: '0 2px 12px rgba(255,31,113,0.1)', marginBottom: '20px' }}>
            <span>Ã°Å¸â€Â¥</span>
            <span style={{ color: '#FF1F71', fontWeight: 600, fontSize: '0.85rem' }}>India&apos;s #1 Hotel Booking Platform</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '12px' }}>
            Find Your Perfect Stay<br />
            <span style={{ background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Across India</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: 'clamp(0.9rem, 2vw, 1.15rem)', maxWidth: '600px', margin: '0 auto 32px' }}>
            Ã¢Å“â€¦ 15,000+ Hotels Ã¢â‚¬Â¢ Best Price Guarantee Ã¢â‚¬Â¢ Instant Confirmation
          </p>

          {/* ===== SEARCH BAR ===== */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxWidth: '900px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
            <div style={{ flex: '1 1 140px', padding: '10px 16px', minWidth: '0' }}>
              <label style={labelStyle}>City</label>
              <select value={city} onChange={e => setCity(e.target.value)} style={selectStyle}>
                <option value="">All Cities</option>
                {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                {cities.length === 0 && <>
                  <option value="Mumbai">Mumbai</option><option value="Delhi">Delhi</option>
                  <option value="Goa">Goa</option><option value="Jaipur">Jaipur</option>
                  <option value="Bangalore">Bangalore</option><option value="Udaipur">Udaipur</option>
                </>}
              </select>
            </div>
            <div style={{ width: '1px', height: '40px', background: '#F1E4E8', flexShrink: 0 }} className="search-divider" />
            <div style={{ flex: '1 1 120px', padding: '10px 16px', minWidth: '0' }}>
              <label style={labelStyle}>Check-in</label>
              <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} style={{ ...selectStyle, cursor: 'text' }} />
            </div>
            <div style={{ width: '1px', height: '40px', background: '#F1E4E8', flexShrink: 0 }} className="search-divider" />
            <div style={{ flex: '1 1 120px', padding: '10px 16px', minWidth: '0' }}>
              <label style={labelStyle}>Check-out</label>
              <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} style={{ ...selectStyle, cursor: 'text' }} />
            </div>
            <div style={{ width: '1px', height: '40px', background: '#F1E4E8', flexShrink: 0 }} className="search-divider" />
            <div style={{ flex: '0 1 100px', padding: '10px 16px', minWidth: '0' }}>
              <label style={labelStyle}>Guests</label>
              <select value={guests} onChange={e => setGuests(e.target.value)} style={selectStyle}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <button onClick={handleSearch} style={{ background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', color: 'white', border: 'none', borderRadius: '12px', padding: '14px 28px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 14px rgba(255,31,113,0.35)', fontFamily: 'inherit', flex: '1 1 100%', maxWidth: '200px' }}>
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ===== TRUST STATS ===== */}
      <section style={{ padding: '32px 0', borderBottom: '1px solid #F1E4E8' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '24px', textAlign: 'center' }}>
          {[
            { icon: 'Ã°Å¸ÂÂ¨', number: '15,000+', label: 'Hotels' },
            { icon: 'Ã°Å¸Å’â€ ', number: '500+', label: 'Cities' },
            { icon: 'Ã°Å¸â€˜Â¥', number: '10M+', label: 'Happy Guests' },
            { icon: 'Ã¢Â­Â', number: '4.5/5', label: 'Avg Rating' },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{ fontSize: '1.5rem', marginBottom: '2px' }}>{stat.icon}</div>
              <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 800, color: '#1A1A2E' }}>{stat.number}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== POPULAR DESTINATIONS ===== */}
      <section id="destinations" className="section" style={{ background: '#FFF8F9' }}>
        <div className="container">
          <div className="section-header">
            <h2>Popular Destinations</h2>
            <p>Explore India&apos;s most loved cities for your next getaway</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
            {(cities.length > 0 ? cities : CITIES_FALLBACK).map((c, i) => (
              <Link key={c.name || i} href={'/search?city=' + c.name} style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', height: '200px', display: 'block', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}>
                <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 12px 12px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{c.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>{c.hotelCount || '50+'} properties</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXCLUSIVE OFFERS ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Exclusive Deals & Offers</h2>
            <p>Save big on your next booking</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {(offers.length > 0 ? offers : OFFERS_FALLBACK).map((offer, i) => (
              <div key={offer.code || i} style={{ background: `linear-gradient(135deg, ${['#FF1F71,#FF7E5F', '#6366F1,#8B5CF6', '#059669,#10B981', '#F59E0B,#EF4444'][i % 4]})`, borderRadius: '16px', padding: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '6px' }}>{offer.discount}% OFF</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>{offer.title}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '14px' }}>{offer.description}</div>
                <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', border: '1px dashed rgba(255,255,255,0.5)' }}>
                  {offer.code}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED HOTELS ===== */}
      <section className="section" style={{ background: '#FFF8F9' }}>
        <div className="container">
          <div className="section-header">
            <h2>Featured Hotels</h2>
            <p>Handpicked properties with exceptional quality</p>
          </div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', background: 'white' }}>
                  <div className="skeleton" style={{ height: '180px' }} />
                  <div style={{ padding: '14px' }}><div className="skeleton" style={{ height: '18px', marginBottom: '8px' }} /><div className="skeleton" style={{ height: '14px', width: '60%' }} /></div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {hotels.slice(0, 8).map(hotel => (
                <Link key={hotel.id} href={'/hotel/' + hotel.id} className="card" style={{ display: 'block' }}>
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <img src={getImages(hotel)[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#FFB800', color: 'white', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Ã¢Â­Â {hotel.rating}</div>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,31,113,0.9)', color: 'white', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600 }}>{hotel.propertyType}</div>
                  </div>
                  <div style={{ padding: '14px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px', color: '#1A1A2E' }}>{hotel.name}</h3>
                    <p style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: '10px' }}>Ã°Å¸â€œÂ {hotel.city}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>from</span>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FF1F71' }}>Ã¢â€šÂ¹{getLowestPrice(hotel).toLocaleString()}<span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B' }}>/night</span></div>
                      </div>
                      <span style={{ color: '#FF1F71', fontWeight: 600, fontSize: '0.8rem' }}>View Ã¢â€ â€™</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/search" className="btn btn-primary btn-lg">View All Hotels Ã¢â€ â€™</Link>
          </div>
        </div>
      </section>

      {/* ===== WHY STAYLO ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Staylo?</h2>
            <p>Simple, reliable, and affordable</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { icon: 'Ã°Å¸â€™Â°', title: 'Best Price Guarantee', desc: 'Find a lower price? We will match it + 10% off.' },
              { icon: 'Ã¢Å¡Â¡', title: 'Instant Confirmation', desc: 'Get booking confirmed instantly with real-time availability.' },
              { icon: 'Ã°Å¸â€ºÂ¡Ã¯Â¸Â', title: 'Safe & Secure', desc: 'Verified properties with quality checks and safe payments.' },
              { icon: 'Ã°Å¸â€œÅ¾', title: '24/7 Support', desc: 'Round-the-clock customer support via phone, chat, email.' },
              { icon: 'Ã°Å¸ÂÂ·Ã¯Â¸Â', title: 'No Hidden Charges', desc: 'What you see is what you pay. Transparent pricing always.' },
              { icon: 'Ã¢Â­Â', title: 'Verified Reviews', desc: 'Real reviews from verified guests to help you choose.' },
            ].map(f => (
              <div key={f.title} style={{ textAlign: 'center', padding: '28px 20px', borderRadius: '16px', background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '0.95rem' }}>{f.title}</h3>
                <p style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: '12px' }}>List Your Property on Staylo</h2>
          <p style={{ fontSize: '1rem', opacity: 0.9, maxWidth: '500px', margin: '0 auto 28px' }}>Join 15,000+ hotel partners. Grow your business effortlessly.</p>
          <Link href="/extranet" className="btn btn-white btn-lg">Get Started Free Ã¢â€ â€™</Link>
        </div>
      </section>
    </>
  );
}

const CITIES_FALLBACK = [
  { name: 'Mumbai', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800', hotelCount: 3 },
  { name: 'Delhi', state: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', hotelCount: 2 },
  { name: 'Goa', state: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', hotelCount: 2 },
  { name: 'Jaipur', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', hotelCount: 2 },
  { name: 'Bangalore', state: 'Karnataka', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800', hotelCount: 1 },
  { name: 'Udaipur', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', hotelCount: 1 },
];

const OFFERS_FALLBACK = [
  { code: 'STAYLO50', title: 'First Booking Offer', description: 'Get 50% off on your first booking!', discount: 50 },
  { code: 'WEEKEND25', title: 'Weekend Getaway', description: '25% off on weekend stays', discount: 25 },
  { code: 'SUMMER30', title: 'Summer Special', description: '30% off hill station bookings', discount: 30 },
  { code: 'GOA40', title: 'Goa Monsoon Magic', description: 'Flat 40% off Goa properties', discount: 40 },
];