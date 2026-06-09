'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Store {
  id: string;
  name: string;
  city: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  timings: string;
  lat: number;
  lng: number;
  amenities: string[];
}

const STORES: Store[] = [
  {
    id: 'staylo-001',
    name: 'Staylo Alaknanda Palace',
    city: 'Ayodhya',
    type: 'Hotel',
    address: 'Ram Ghat Road, Ayodhya, Uttar Pradesh 224123',
    phone: '+91 98993 08683',
    email: 'ayodhya@staylo.in',
    timings: 'Open 24 Hours (Everyday)',
    lat: 26.79155896,
    lng: 82.20235283,
    amenities: ['24/7 Room Service', 'Free WiFi', 'Air Conditioning', 'Instant Check-in']
  },
  {
    id: 'staylo-002',
    name: 'Staylo Anupam Palace',
    city: 'Delhi',
    type: 'Hotel',
    address: 'Neb Sarai, Delhi 110030',
    phone: '+91 98993 08683',
    email: 'delhi@staylo.in',
    timings: 'Open 24 Hours (Everyday)',
    lat: 28.51475857,
    lng: 77.20238012,
    amenities: ['24/7 Room Service', 'Free WiFi', 'Clean Linen', 'Housekeeping']
  },
  {
    id: 'staylo-003',
    name: 'Staylo The Studio Anupam Garden',
    city: 'Delhi',
    type: 'Hotel',
    address: 'Neb Sarai, Delhi 110030',
    phone: '+91 98993 08683',
    email: 'studio.delhi@staylo.in',
    timings: 'Open 24 Hours (Everyday)',
    lat: 28.5127607,
    lng: 77.2022835,
    amenities: ['Kitchenette', 'Free WiFi', 'Air Conditioning', 'Parking']
  },
  {
    id: 'staylo-004',
    name: 'Staylo Sunlight Inn CP',
    city: 'Delhi',
    type: 'Hotel',
    address: 'Connaught Place, Delhi 110001',
    phone: '+91 98993 08683',
    email: 'cp@staylo.in',
    timings: 'Open 24 Hours (Everyday)',
    lat: 28.62768772,
    lng: 77.21871435,
    amenities: ['Metro Access', 'Free WiFi', 'Room Service', 'Breakfast Included']
  },
  {
    id: 'staylo-005',
    name: 'Staylo Vrindavan Palace Noida',
    city: 'Noida',
    type: 'Hotel',
    address: 'Sector 62, Noida, Uttar Pradesh 201301',
    phone: '+91 98993 08683',
    email: 'noida@staylo.in',
    timings: 'Open 24 Hours (Everyday)',
    lat: 28.62618951,
    lng: 77.37351634,
    amenities: ['Corporate Hub', 'Free WiFi', 'Meeting Room', 'AC Rooms']
  },
  {
    id: 'staylo-006',
    name: 'Staylo Washington Residence',
    city: 'Ayodhya',
    type: 'Hotel',
    address: 'Ayodhya, Uttar Pradesh 224123',
    phone: '+91 98993 08683',
    email: 'washington@staylo.in',
    timings: 'Open 24 Hours (Everyday)',
    lat: 26.79155897,
    lng: 82.20235284,
    amenities: ['Premium Stay', 'Free WiFi', '24/7 Security', 'Temple Guide']
  },
  {
    id: 'staylo-007',
    name: 'Staylo Shanti Inn CP',
    city: 'Delhi',
    type: 'Hotel',
    address: 'Connaught Place, Delhi 110001',
    phone: '+91 98993 08683',
    email: 'shanti.cp@staylo.in',
    timings: 'Open 24 Hours (Everyday)',
    lat: 28.62768972,
    lng: 77.21870012,
    amenities: ['Central Location', 'Free WiFi', 'Comfortable Beds', 'Room Service']
  },
  {
    id: 'staylo-008',
    name: "Staylo Paradise Villa's",
    city: 'Bangalore',
    type: 'Hotel',
    address: 'Indiranagar, Bangalore, Karnataka 560038',
    phone: '+91 98993 08683',
    email: 'paradise.blr@staylo.in',
    timings: 'Open 24 Hours (Everyday)',
    lat: 12.9718973,
    lng: 77.64120013,
    amenities: ['Luxury Villa', 'Free WiFi', 'Lush Gardens', 'Lounge Bar']
  },
  {
    id: 'staylo-009',
    name: 'Staylo Heritage Homestay',
    city: 'Delhi',
    type: 'Hotel',
    address: 'Neb Sarai, Delhi 110030',
    phone: '+91 98993 08683',
    email: 'heritage.delhi@staylo.in',
    timings: 'Open 24 Hours (Everyday)',
    lat: 28.51475858,
    lng: 77.20238025,
    amenities: ['Traditional Decor', 'Free WiFi', 'Homely Food', 'Peaceful Location']
  },
  {
    id: 'staylo-010',
    name: 'Staylo Cozy Residencies CP',
    city: 'Delhi',
    type: 'Hotel',
    address: 'Connaught Place, Delhi 110001',
    phone: '+91 98993 08683',
    email: 'cozy.cp@staylo.in',
    timings: 'Open 24 Hours (Everyday)',
    lat: 28.62769123,
    lng: 77.21871324,
    amenities: ['Cozy Rooms', 'Free WiFi', 'Metro Proximity', '24/7 Desk']
  },
  {
    id: 'corp-hq',
    name: 'Staylo Corporate Headquarters',
    city: 'Noida',
    type: 'Office',
    address: 'Tech Boulevard, Sector 62, Noida, Uttar Pradesh 201301',
    phone: '+91 98993 08683',
    email: 'support@staylo.in',
    timings: '09:30 AM - 06:30 PM (Mon - Fri)',
    lat: 28.6273,
    lng: 77.3725,
    amenities: ['Partner Onboarding', 'Corporate Sales', '24/7 Support Center', 'Visitor Lounge']
  }
];

const FAQS = [
  {
    q: 'Do I need an appointment to visit a Staylo store?',
    a: 'No appointment is necessary! You can walk into any of our booking hubs or experience centers during operational hours. Our travel consultants will be happy to assist you immediately.'
  },
  {
    q: 'Can I make payments in cash at physical outlets?',
    a: 'Yes! We accept cash payments for bookings made at our Experience Centers and Booking Hubs, in addition to UPI, credit/debit cards, and net banking.'
  },
  {
    q: 'Can I modify or cancel my existing booking at a physical store?',
    a: 'Absolutely. If you booked through our website, app, or at a store, our store representatives can assist you with modifications, cancellations, and instant refunds matching our policies.'
  },
  {
    q: 'What is the Staylo Experience Center?',
    a: 'Staylo Experience Centers are premium lounges where you can inspect hotel room mockups, test amenities, interact with virtual reality property walkthroughs, and get personalized vacation advice from our experts.'
  }
];

export default function StoreLocatorPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStore, setSelectedStore] = useState<Store>(STORES[0]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const storeTypes = ['All', 'Hotel', 'Office'];

  const filteredStores = STORES.filter(store => {
    const matchesSearch = 
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'All' || store.type.includes(selectedType);

    return matchesSearch && matchesType;
  });

  const getMapEmbedUrl = (store: Store) => {
    const q = encodeURIComponent(`${store.name}, ${store.address}`);
    return `https://maps.google.com/maps?q=${q}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  const handleUseMyLocation = () => {
    setLocationLoading(true);
    setLocationMessage('');
    setTimeout(() => {
      setSelectedStore(STORES[0]);
      setLocationLoading(false);
      setLocationMessage('📍 Detected location: New Delhi. Showing nearest Staylo Premium Booking Hub.');
    }, 1200);
  };

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section style={{ background: 'linear-gradient(180deg, #FFF0F3 0%, #FFFFFF 100%)', padding: '80px 0 48px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', padding: '6px 16px', borderRadius: '9999px', boxShadow: '0 2px 12px rgba(255,31,113,0.1)', marginBottom: '16px' }}>
            <span style={{ color: '#FF1F71', fontWeight: 600, fontSize: '0.85rem' }}>Staylo Offline Booking & Support</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '16px' }}>
            Find a <span style={{ background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Staylo Store</span> Near You
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 28px' }}>
            Walk in for instant bookings, property walkthroughs, custom holiday planning, and live customer support.
          </p>
        </div>
      </section>

      {/* ===== SEARCH & FILTER BAR ===== */}
      <section style={{ padding: '0 0 40px' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <div style={{ flex: '2 1 300px', position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Search by city, center name, or address..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                />
              </div>

              <div style={{ flex: '1 1 200px' }}>
                <select 
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  {storeTypes.map(type => (
                    <option key={type} value={type}>{type === 'All' ? 'All Types' : type === 'Hotel' ? 'Hotels' : 'Offices'}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleUseMyLocation}
                disabled={locationLoading}
                className="btn btn-outline"
                style={{ flex: '0 1 auto', padding: '12px 20px', borderRadius: '10px' }}
              >
                {locationLoading ? 'Locating...' : '📍 Use My Location'}
              </button>
            </div>

            {locationMessage && (
              <div style={{ marginTop: '12px', padding: '10px 14px', background: '#FFF0F3', borderRadius: '8px', fontSize: '0.85rem', color: '#FF1F71', fontWeight: 500 }}>
                {locationMessage}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== STORE LOCATOR LAYOUT ===== */}
      <section style={{ paddingBottom: '80px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
            
            {/* Store List Panel */}
            <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '680px', overflowY: 'auto', paddingRight: '8px' }} className="store-list-container">
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Outlets Found ({filteredStores.length})
              </div>

              {filteredStores.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 16px', background: '#FFF8F9', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
                  <h4 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>No Stores Found</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Try clearing filters or search terms.</p>
                </div>
              ) : (
                filteredStores.map(store => {
                  const isSelected = selectedStore.id === store.id;
                  return (
                    <div 
                      key={store.id}
                      onClick={() => setSelectedStore(store)}
                      style={{
                        padding: '20px',
                        background: 'white',
                        borderRadius: '14px',
                        border: isSelected ? '2px solid var(--primary)' : '2.0px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        boxShadow: isSelected ? 'var(--shadow-card-hover)' : 'none',
                        transform: isSelected ? 'translateY(-2px)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#FFF0F3', color: 'var(--primary)', padding: '3px 8px', borderRadius: '6px' }}>
                          {store.type}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          {store.city}
                        </span>
                      </div>
                      
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                        {store.name}
                      </h3>
                      
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', gap: '4px' }}>
                        <span>📍</span> <span style={{ lineHeight: 1.4 }}>{store.address}</span>
                      </p>

                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {store.amenities.slice(0, 2).map(a => (
                          <span key={a} style={{ fontSize: '0.7rem', background: '#F0FDF4', color: '#15803D', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            ✓ {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Map & Detail Panel */}
            <div style={{ gridColumn: 'span 7' }}>
              <div style={{ background: 'white', borderRadius: '18px', border: '1px solid var(--border)', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-md)' }}>
                {/* Map Box */}
                <div style={{ height: '340px', background: '#E2E8F0', position: 'relative' }}>
                  <iframe
                    title={`Map of ${selectedStore.name}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={getMapEmbedUrl(selectedStore)}
                  />
                </div>

                {/* Details Box */}
                <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'var(--gradient-primary)', color: 'white', padding: '4px 10px', borderRadius: '6px' }}>
                        {selectedStore.type}
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '12px' }}>
                      {selectedStore.name}
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                      <div style={{ fontSize: '0.85rem' }}>
                        <div style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', marginBottom: '2px' }}>Address</div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.4 }}>{selectedStore.address}</div>
                      </div>
                      
                      <div style={{ fontSize: '0.85rem' }}>
                        <div style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', marginBottom: '2px' }}>Timings</div>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedStore.timings}</div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '20px' }}>
                      <div style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', marginBottom: '6px' }}>Amenities & Services Available</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {selectedStore.amenities.map(a => (
                          <span key={a} style={{ fontSize: '0.75rem', background: '#F8FAFC', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', fontWeight: 500 }}>
                            ✨ {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                    <a 
                      href={`tel:${selectedStore.phone.replace(/\s/g, '')}`} 
                      className="btn btn-outline" 
                      style={{ flex: 1, padding: '12px' }}
                    >
                      📞 Call Support
                    </a>
                    
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.lat},${selectedStore.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ flex: 1.5, padding: '12px' }}
                    >
                      🧭 Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== FAQS SECTION ===== */}
      <section style={{ background: 'var(--bg-light)', padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about Staylo outlets</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div 
                  key={i} 
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border)',
                    overflow: 'hidden',
                    transition: 'all 0.3s'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    style={{
                      width: '100%',
                      padding: '20px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: '1.2rem', color: 'var(--primary)', transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'all 0.2s' }}>+</span>
                  </button>
                  
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PROPERTY LISTING CTA ===== */}
      <section style={{ background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: '12px' }}>Are you a Hotel Partner?</h2>
          <p style={{ fontSize: '1rem', opacity: 0.9, maxWidth: '500px', margin: '0 auto 28px' }}>
            Visit our corporate office or local hubs to onboard your property or manage commission payout schedules.
          </p>
          <Link href="/extranet" className="btn btn-white btn-lg">
            Partner Portal →
          </Link>
        </div>
      </section>

      {/* ===== CUSTOM RESPONSIVE CSS ===== */}
      <style jsx>{`
        @media (max-width: 991px) {
          .store-list-container {
            max-height: 400px !important;
          }
          div[style*="grid-template-columns: repeat(12"] {
            display: flex !important;
            flex-direction: column !important;
          }
        }
      `}</style>
    </>
  );
}
