'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface Hotel {
  id: string; name: string; city: string; rating: number; starRating: number;
  images: string[]; amenities: string[]; propertyType: string;
  rooms: { basePrice: number; type: string; capacity: number; amenities: string[] }[];
  _count?: { reviews: number };
}

function SearchContent() {
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [sort, setSort] = useState('rating');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (sort) params.set('sort', sort);
    params.set('limit', '20');
    fetch(API_URL + '/hotels?' + params.toString())
      .then(r => r.json())
      .then(data => {
        let results = data.data?.hotels || data.data || [];
        if (starFilter) results = results.filter((h: Hotel) => h.starRating >= starFilter);
        if (maxPrice < 15000) results = results.filter((h: Hotel) => {
          const min = Math.min(...(h.rooms || []).map(r => r.basePrice));
          return min <= maxPrice;
        });
        setHotels(results);
        setTotal(data.data?.pagination?.total || results.length);
        setLoading(false);
      }).catch(() => { setHotels([]); setLoading(false); });
  }, [city, sort, starFilter, maxPrice]);

  const getLowestPrice = (hotel: Hotel) => !hotel.rooms?.length ? 0 : Math.min(...hotel.rooms.map(r => r.basePrice));
  const getImages = (hotel: Hotel) => { if (Array.isArray(hotel.images)) return hotel.images; try { return JSON.parse(hotel.images as any); } catch { return []; } };
  const getAmenities = (hotel: Hotel) => { if (Array.isArray(hotel.amenities)) return hotel.amenities; try { return JSON.parse(hotel.amenities as any); } catch { return []; } };

  const selectStyle: React.CSSProperties = { padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #F1E4E8', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', background: 'white' };

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <Link href="/" style={{ color: '#FF1F71', fontSize: '0.85rem', fontWeight: 600 }}>← Back to Home</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800 }}>{city ? `Hotels in ${city}` : 'All Properties'}</h1>
          <p style={{ color: '#64748B', fontSize: '0.85rem' }}>{total} properties found</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select value={city} onChange={e => setCity(e.target.value)} style={selectStyle}>
            <option value="">All Cities</option>
            {['Mumbai','Delhi','Goa','Jaipur','Bangalore','Udaipur','Manali'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={selectStyle}>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low→High</option>
            <option value="price_desc">Price: High→Low</option>
            <option value="name">Name A-Z</option>
          </select>
          <button onClick={() => setShowFilters(!showFilters)} style={{ ...selectStyle, border: '1.5px solid #FF1F71', color: '#FF1F71', display: 'none' }} className="mobile-filter-btn">
            {showFilters ? '✕ Close' : '⚙ Filters'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Sidebar */}
        <aside style={{ width: '260px', flexShrink: 0 }} className="search-sidebar">
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', position: 'sticky', top: '88px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem' }}>Filters</h3>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Max Price</span>
                <span style={{ color: '#FF1F71', fontWeight: 700, fontSize: '0.85rem' }}>₹{maxPrice.toLocaleString()}</span>
              </div>
              <input type="range" min="500" max="15000" step="500" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%', accentColor: '#FF1F71' }} />
            </div>
            <div>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '10px' }}>Star Rating</span>
              {[5,4,3,2,1].map(star => (
                <label key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="radio" name="star" checked={starFilter === star} onChange={() => setStarFilter(starFilter === star ? null : star)} style={{ accentColor: '#FF1F71' }} />
                  {'⭐'.repeat(star)} {star < 5 && '& up'}
                </label>
              ))}
              {starFilter && <button onClick={() => setStarFilter(null)} style={{ color: '#FF1F71', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, marginTop: '4px' }}>Clear</button>}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {[1,2,3,4,5,6].map(i => (<div key={i} className="card"><div className="skeleton" style={{ height: '180px' }} /><div style={{ padding: '14px' }}><div className="skeleton" style={{ height: '18px', marginBottom: '8px' }} /><div className="skeleton" style={{ height: '14px', width: '60%' }} /></div></div>))}
            </div>
          ) : hotels.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏨</div>
              <h3 style={{ fontWeight: 700, color: '#FF1F71', marginBottom: '6px' }}>No hotels found</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {hotels.map(hotel => (
                <Link key={hotel.id} href={'/hotel/' + hotel.id} className="card" style={{ display: 'block' }}>
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    <img src={getImages(hotel)[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#FFB800', color: 'white', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>⭐ {hotel.rating}</div>
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {getAmenities(hotel).slice(0, 2).map((a: string) => (
                        <span key={a} style={{ background: 'rgba(255,255,255,0.95)', padding: '3px 8px', borderRadius: '5px', fontSize: '0.65rem', fontWeight: 600 }}>{a}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: '14px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{hotel.name}</h3>
                    <p style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: '10px' }}>📍 {hotel.city} • {hotel.rooms?.length || 0} room types</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>from</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FF1F71' }}>₹{getLowestPrice(hotel).toLocaleString()}<span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B' }}>/night</span></div>
                      </div>
                      <span className="btn btn-primary btn-sm">View</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .search-sidebar { display: none; }
          .mobile-filter-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '80px 0', textAlign: 'center' }}><div className="skeleton" style={{ width: '200px', height: '24px', margin: '0 auto' }} /></div>}>
      <SearchContent />
    </Suspense>
  );
}