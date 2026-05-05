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
      fetch(API_URL + '/hotels?featured=true').then(r => r.json()).catch(() => ({ data: [] })),
      fetch(API_URL + '/cities/popular').then(r => r.json()).catch(() => ({ data: [] })),
      fetch(API_URL + '/offers').then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([hotelsRes, citiesRes, offersRes]) => {
      setHotels(hotelsRes.data || []);
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

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section style={{ background: 'linear-gradient(180deg, #FFF0F3 0%, #FFFFFF 100%)', padding: '80px 0 60px', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', padding: '8px 20px', borderRadius: '9999px', boxShadow: '0 2px 12px rgba(255,31,113,0.1)', marginBottom: '24px', animation: 'fadeIn 0.5s ease' }}>
            <span style={{ fontSize: '1.1rem' }}>ðŸ”¥</span>
            <span style={{ color: '#FF1F71', fontWeight: 600, fontSize: '0.9rem' }}>India&apos;s #1 Hotel Booking Platform</span>
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '16px', animation: 'fadeIn 0.6s ease' }}>
            Find Your Perfect Stay<br />
            <span style={{ background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Across India</span>
          </h1>

          {/* Subtitle */}
          <p style={{ color: '#64748B', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 40px', animation: 'fadeIn 0.7s ease' }}>
            âœ… 15,000+ Hotels â€¢ Best Price Guarantee â€¢ Instant Confirmation
          </p>

          {/* ===== SEARCH BAR ===== */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '4px', animation: 'slideUp 0.8s ease' }}>
            <div style={{ flex: 1, padding: '12px 20px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>City</label>
              <select value={city} onChange={e => setCity(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '0.95rem', fontWeight: 600, color: '#1A1A2E', background: 'transparent', width: '100%', cursor: 'pointer', fontFamily: 'inherit' }}>
                <option value="">All Cities</option>
                {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                {cities.length === 0 && <>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Goa">Goa</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Udaipur">Udaipur</option>
                  <option value="Manali">Manali</option>
                </>}
              </select>
            </div>
            <div style={{ width: '1px', height: '40px', background: '#F1E4E8' }} />
            <div style={{ flex: 1, padding: '12px 20px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Check-in</label>
              <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '0.95rem', fontWeight: 600, color: '#1A1A2E', background: 'transparent', width: '100%', fontFamily: 'inherit' }} />
            </div>
            <div style={{ width: '1px', height: '40px', background: '#F1E4E8' }} />
            <div style={{ flex: 1, padding: '12px 20px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Check-out</label>
              <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '0.95rem', fontWeight: 600, color: '#1A1A2E', background: 'transparent', width: '100%', fontFamily: 'inherit' }} />
            </div>
            <div style={{ width: '1px', height: '40px', background: '#F1E4E8' }} />
            <div style={{ padding: '12px 20px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>Guests</label>
              <select value={guests} onChange={e => setGuests(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: '0.95rem', fontWeight: 600, color: '#1A1A2E', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <button onClick={handleSearch} style={{ background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', color: 'white', border: 'none', borderRadius: '14px', padding: '16px 32px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 14px rgba(255,31,113,0.35)', fontFamily: 'inherit' }}>
              Search
            </button>
          </div>
        </div>
      </section>

      {/* ===== TRUST STATS ===== */}
      <section style={{ padding: '40px 0', borderBottom: '1px solid #F1E4E8' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '64px', flexWrap: 'wrap' }}>
          {[
            { icon: 'ðŸ¨', number: '15,000+', label: 'Hotels' },
            { icon: 'ðŸŒ†', number: '500+', label: 'Cities' },
            { icon: 'ðŸ‘¥', number: '10M+', label: 'Happy Guests' },
            { icon: 'â­', number: '4.5/5', label: 'Avg Rating' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '4px' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1A1A2E' }}>{stat.number}</div>
              <div style={{ fontSize: '0.9rem', color: '#64748B' }}>{stat.label}</div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
            {(cities.length > 0 ? cities : CITIES_FALLBACK).map((c, i) => (
              <Link key={c.name || i} href={'/search?city=' + (c.name)} style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '220px', display: 'block', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}>
                <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 16px 16px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>{c.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>{c.hotelCount || '50+'} properties</div>
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
            <p>Save big on your next booking with these amazing offers</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {(offers.length > 0 ? offers : OFFERS_FALLBACK).map((offer, i) => (
              <div key={offer.code || i} style={{ background: `linear-gradient(135deg, ${['#FF1F71,#FF7E5F', '#6366F1,#8B5CF6', '#059669,#10B981', '#F59E0B,#EF4444'][i % 4]})`, borderRadius: '16px', padding: '28px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '8px' }}>{offer.discount}% OFF</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>{offer.title}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '16px' }}>{offer.description}</div>
                <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px', border: '1px dashed rgba(255,255,255,0.5)' }}>
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
            <p>Handpicked properties with exceptional quality and service</p>
          </div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', background: 'white' }}>
                  <div className="skeleton" style={{ height: '200px' }} />
                  <div style={{ padding: '16px' }}>
                    <div className="skeleton" style={{ height: '20px', marginBottom: '8px' }} />
                    <div className="skeleton" style={{ height: '16px', width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {hotels.slice(0, 8).map(hotel => (
                <Link key={hotel.id} href={'/hotel/' + hotel.id} className="card" style={{ display: 'block' }}>
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    <img src={getImages(hotel)[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#FFB800', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      â­ {hotel.rating}
                    </div>
                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(255,31,113,0.9)', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                      {hotel.propertyType}
                    </div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px', color: '#1A1A2E' }}>{hotel.name}</h3>
                    <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '12px' }}>ðŸ“ {hotel.city} â€¢ {'â­'.repeat(hotel.starRating)}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Starting from</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FF1F71' }}>â‚¹{getLowestPrice(hotel).toLocaleString()}<span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748B' }}>/night</span></div>
                      </div>
                      <span style={{ color: '#FF1F71', fontWeight: 600, fontSize: '0.85rem' }}>View Details â†’</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/search" className="btn btn-primary btn-lg">View All Hotels â†’</Link>
          </div>
        </div>
      </section>

      {/* ===== WHY STAYLO ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Staylo?</h2>
            <p>We make hotel booking simple, reliable, and affordable</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
            {[
              { icon: 'ðŸ’°', title: 'Best Price Guarantee', desc: 'Find a lower price? We will match it and give you an extra 10% off.' },
              { icon: 'âš¡', title: 'Instant Confirmation', desc: 'Get your booking confirmed instantly with real-time availability.' },
              { icon: 'ðŸ›¡ï¸', title: 'Safe & Secure', desc: 'Verified properties with standardized quality checks and safe payments.' },
              { icon: 'ðŸ“ž', title: '24/7 Support', desc: 'Round-the-clock customer support via phone, chat, and email.' },
              { icon: 'ðŸ·ï¸', title: 'No Hidden Charges', desc: 'What you see is what you pay. Transparent pricing always.' },
              { icon: 'â­', title: 'Verified Reviews', desc: 'Real reviews from verified guests to help you make the best choice.' },
            ].map(feature => (
              <div key={feature.title} style={{ textAlign: 'center', padding: '32px 24px', borderRadius: '16px', background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'all 0.3s' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{feature.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '8px', color: '#1A1A2E' }}>{feature.title}</h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section style={{ background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px' }}>List Your Property on Staylo</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 32px' }}>
            Join 15,000+ hotel partners. Increase your bookings, manage your property effortlessly, and grow your business.
          </p>
          <Link href="/extranet" className="btn btn-white btn-lg">Get Started Free â†’</Link>
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
  { name: 'Manali', state: 'Himachal Pradesh', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', hotelCount: 1 },
];

const OFFERS_FALLBACK = [
  { code: 'STAYLO50', title: 'First Booking Offer', description: 'Get 50% off on your first booking!', discount: 50 },
  { code: 'WEEKEND25', title: 'Weekend Getaway', description: '25% off on weekend stays', discount: 25 },
  { code: 'SUMMER30', title: 'Summer Special', description: '30% off hill station bookings', discount: 30 },
  { code: 'GOA40', title: 'Goa Monsoon Magic', description: 'Flat 40% off Goa properties', discount: 40 },
];