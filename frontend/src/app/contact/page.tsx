'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <>
      <section style={{ background: 'linear-gradient(180deg, #FFF0F3 0%, #FFFFFF 100%)', padding: '80px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '16px' }}>
            Get in <span style={{ background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Touch</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
            Have a question or need help? Our team is here for you 24/7.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', maxWidth: '1000px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px' }}>Contact Information</h2>
            {[
              { icon: 'ðŸ“ž', label: 'Phone', value: '+91-98993-08683', href: 'tel:+919899308683' },
              { icon: 'âœ‰ï¸', label: 'Email', value: 'support@staylo.in', href: 'mailto:support@staylo.in' },
              { icon: 'ðŸ“', label: 'Address', value: 'New Delhi, India', href: '#' },
              { icon: 'â°', label: 'Support Hours', value: '24/7 Available', href: '#' },
            ].map(info => (
              <a key={info.label} href={info.href} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid #F1E4E8' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FFF0F3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{info.icon}</div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>{info.label}</div>
                  <div style={{ fontWeight: 600, color: '#1A1A2E' }}>{info.value}</div>
                </div>
              </a>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>âœ…</div>
                <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>Message Sent!</h3>
                <p style={{ color: '#64748B' }}>We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>Send us a message</h3>
                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <label>Name</label>
                  <input type="text" placeholder="Your name" required />
                </div>
                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <label>Email</label>
                  <input type="email" placeholder="you@example.com" required />
                </div>
                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <label>Subject</label>
                  <input type="text" placeholder="How can we help?" required />
                </div>
                <div className="input-group" style={{ marginBottom: '24px' }}>
                  <label>Message</label>
                  <textarea placeholder="Describe your query..." rows={4} required style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}