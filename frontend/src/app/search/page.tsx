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
      })
      .catch(() => { setHotels([]); setLoading(false); });
  }, [city, sort, starFilter, maxPrice]);

  const getLowestPrice = (hotel: Hotel) => {
    if (!hotel.rooms || hotel.rooms.length === 0) return 0;
    return Math.min(...hotel.rooms.map(r => r.basePrice));
  };

  const getImages = (hotel: Hotel) => {
    if (Array.isArray(hotel.images)) return hotel.images;
    try { return JSON.parse(hotel.images as any); } catch { return []; }
  };

  const getAmenities = (hotel: Hotel) => {
    if (Array.isArray(hotel.amenities)) return hotel.amenities;
    try { return JSON.parse(hotel.amenities as any); } catch { return []; }
  };

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/" style={{ color: '#FF1F71', fontSize: '0.9rem', fontWeight: 600 }}>← Back to Home</Link>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {city ? `Hotels in ${city}` : 'All Properties'}
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>{total} properties found</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select value={city} onChange={e => setCity(e.target.value)} style={{ padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #F1E4E8', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', background: 'white' }}>
            <option value="">All Cities</option>
            {['Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Bangalore', 'Udaipur', 'Manali'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #F1E4E8', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', background: 'white' }}>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        {/* Filter Sidebar */}
        <aside style={{ width: '280px', flexShrink: 0 }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', position: 'sticky', top: '96px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>Filter Results</h3>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Max Price</span>
                <span style={{ color: '#FF1F71', fontWeight: 700 }}>₹{maxPrice.toLocaleString()}</span>
              </div>
              <input type="range" min="500" max="15000" step="500" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%', accentColor: '#FF1F71' }} />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '12px' }}>Star Rating</span>
              {[5,4,3,2,1].map(star => (
                <label key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="radio" name="star" checked={starFilter === star} onChange={() => setStarFilter(starFilter === star ? null : star)} style={{ accentColor: '#FF1F71' }} />
                  {'⭐'.repeat(star)} {star === 5 ? '' : '& up'}
                </label>
              ))}
              {starFilter && <button onClick={() => setStarFilter(null)} style={{ color: '#FF1F71', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear filter</button>}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="card" style={{ overflow: 'hidden' }}>
                  <div className="skeleton" style={{ height: '200px' }} />
                  <div style={{ padding: '16px' }}>
                    <div className="skeleton" style={{ height: '20px', marginBottom: '8px' }} />
                    <div className="skeleton" style={{ height: '16px', width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : hotels.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏨</div>
              <h3 style={{ fontWeight: 700, color: '#FF1F71', marginBottom: '8px' }}>No hotels found.</h3>
              <p style={{ color: '#64748B' }}>Try adjusting your search criteria or check back later.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {hotels.map(hotel => (
                <Link key={hotel.id} href={'/hotel/' + hotel.id} className="card" style={{ display: 'block' }}>
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <img src={getImages(hotel)[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#FFB800', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ⭐ {hotel.rating}
                    </div>
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {getAmenities(hotel).slice(0, 3).map((a: string) => (
                        <span key={a} style={{ background: 'rgba(255,255,255,0.95)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, color: '#1A1A2E' }}>{a}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>{hotel.name}</h3>
                    <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '12px' }}>
                      📍 {hotel.city} • {hotel.rooms?.length || 0} room types • {'⭐'.repeat(hotel.starRating)}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Starting from</span>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FF1F71' }}>₹{getLowestPrice(hotel).toLocaleString()}<span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748B' }}>/night</span></div>
                      </div>
                      <button className="btn btn-primary btn-sm">View Details</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '100px 0', textAlign: 'center' }}><div className="skeleton" style={{ width: '200px', height: '30px', margin: '0 auto' }} /></div>}>
      <SearchContent />
    </Suspense>
  );
}