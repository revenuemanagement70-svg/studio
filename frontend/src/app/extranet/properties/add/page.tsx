'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const AMENITY_OPTIONS = ['WiFi', 'AC', 'TV', 'Parking', 'Pool', 'Gym', 'Restaurant', 'Room Service', 'Laundry', 'Bar', 'Spa', 'Business Center', 'Elevator', 'Pet Friendly', 'CCTV', 'Power Backup', '24/7 Front Desk', 'Airport Shuttle'];
const PROPERTY_TYPES = ['Hotel', 'Resort', 'Hostel', 'Villa', 'Apartment', 'Homestay', 'Guest House', 'Boutique'];
const CITIES = ['Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Bangalore', 'Udaipur', 'Manali', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Kochi'];

export default function AddPropertyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('Hotel');
  const [starRating, setStarRating] = useState(3);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState('');
  const [policies, setPolicies] = useState({ checkinTime: '14:00', checkoutTime: '11:00', cancellation: 'Free cancellation up to 24 hours' });

  // Room state
  const [rooms, setRooms] = useState([{ type: 'Deluxe Room', capacity: 2, basePrice: 2000, totalRooms: 5, amenities: ['WiFi', 'AC', 'TV'] }]);

  const toggleAmenity = (a: string) => {
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const updateRoom = (idx: number, field: string, value: any) => {
    setRooms(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  const addRoom = () => {
    setRooms(prev => [...prev, { type: 'Standard Room', capacity: 2, basePrice: 1500, totalRooms: 3, amenities: ['WiFi', 'AC'] }]);
  };

  const removeRoom = (idx: number) => {
    if (rooms.length <= 1) return;
    setRooms(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!name || !city || !address) { setError('Name, city, and address are required'); return; }
    if (rooms.length === 0) { setError('Add at least one room type'); return; }
    setSaving(true); setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }
      const imageUrls = images.split('\n').map(s => s.trim()).filter(Boolean);
      const res = await fetch(API_URL + '/extranet/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({
          name, city, address, description, propertyType, starRating,
          amenities, images: imageUrls, policies,
          rooms: rooms.map(r => ({ ...r, basePrice: Number(r.basePrice), capacity: Number(r.capacity), totalRooms: Number(r.totalRooms) })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add property');
      setSuccess(true);
      setTimeout(() => router.push('/extranet/properties'), 2000);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  if (success) return (
    <div style={{ padding: '80px 16px', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>OK</div>
      <h2 style={{ fontWeight: 800, marginBottom: '8px' }}>Property Listed!</h2>
      <p style={{ color: '#64748B' }}>Your property is now pending approval. Redirecting...</p>
    </div>
  );

  const sectionStyle = { background: 'white', borderRadius: '18px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: '20px' };
  const headingStyle = { fontWeight: 700 as const, marginBottom: '16px', fontSize: '1rem' };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', fontWeight: 900, marginBottom: '24px' }}>Add New Property</h1>
      {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#EF4444', fontSize: '0.85rem' }}>{error}</div>}

      <div style={sectionStyle}>
        <h2 style={headingStyle}>Basic Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div className="input-group"><label>Property Name *</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Grand Palace Hotel" /></div>
          <div className="input-group"><label>City *</label>
            <select value={city} onChange={e => setCity(e.target.value)}><option value="">Select City</option>{CITIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
          </div>
          <div className="input-group"><label>Property Type</label>
            <select value={propertyType} onChange={e => setPropertyType(e.target.value)}>{PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
          </div>
          <div className="input-group"><label>Star Rating</label>
            <select value={starRating} onChange={e => setStarRating(Number(e.target.value))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Star</option>)}</select>
          </div>
        </div>
        <div className="input-group" style={{ marginTop: '14px' }}><label>Full Address *</label><input value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main Street, Area Name" /></div>
        <div className="input-group" style={{ marginTop: '14px' }}><label>Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Tell guests about your property..." style={{ padding: '12px 16px', border: '1.5px solid #F1E4E8', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'vertical', width: '100%' }} /></div>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>Amenities</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {AMENITY_OPTIONS.map(a => (
            <button key={a} onClick={() => toggleAmenity(a)} style={{
              padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              border: amenities.includes(a) ? '2px solid #FF1F71' : '2px solid #F1E4E8',
              background: amenities.includes(a) ? '#FFF0F3' : 'white',
              color: amenities.includes(a) ? '#FF1F71' : '#64748B',
            }}>{amenities.includes(a) ? 'V ' : ''}{a}</button>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>Image URLs</h2>
        <textarea value={images} onChange={e => setImages(e.target.value)} rows={3} placeholder="Paste image URLs, one per line" style={{ padding: '12px 16px', border: '1.5px solid #F1E4E8', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.85rem', resize: 'vertical', width: '100%' }} />
        <p style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '6px' }}>Use Unsplash or any public image URLs</p>
      </div>

      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>Room Types</h2>
          <button onClick={addRoom} className="btn btn-outline btn-sm">+ Add Room</button>
        </div>
        {rooms.map((room, idx) => (
          <div key={idx} style={{ border: '1.5px solid #F1E4E8', borderRadius: '14px', padding: '18px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Room {idx + 1}</span>
              {rooms.length > 1 && <button onClick={() => removeRoom(idx)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>Remove</button>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              <div className="input-group"><label>Room Type</label><input value={room.type} onChange={e => updateRoom(idx, 'type', e.target.value)} /></div>
              <div className="input-group"><label>Max Guests</label><input type="number" value={room.capacity} onChange={e => updateRoom(idx, 'capacity', e.target.value)} min={1} /></div>
              <div className="input-group"><label>Price/Night (Rs.)</label><input type="number" value={room.basePrice} onChange={e => updateRoom(idx, 'basePrice', e.target.value)} min={100} /></div>
              <div className="input-group"><label>Total Rooms</label><input type="number" value={room.totalRooms} onChange={e => updateRoom(idx, 'totalRooms', e.target.value)} min={1} /></div>
            </div>
          </div>
        ))}
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>Policies</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div className="input-group"><label>Check-in Time</label><input type="time" value={policies.checkinTime} onChange={e => setPolicies({ ...policies, checkinTime: e.target.value })} /></div>
          <div className="input-group"><label>Check-out Time</label><input type="time" value={policies.checkoutTime} onChange={e => setPolicies({ ...policies, checkoutTime: e.target.value })} /></div>
        </div>
        <div className="input-group" style={{ marginTop: '14px' }}><label>Cancellation Policy</label><input value={policies.cancellation} onChange={e => setPolicies({ ...policies, cancellation: e.target.value })} /></div>
      </div>

      <button onClick={handleSubmit} className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: '32px' }} disabled={saving}>
        {saving ? 'Submitting...' : 'List Property'}
      </button>
    </div>
  );
}