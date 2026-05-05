import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#0F172A', color: '#E2E8F0', padding: '48px 0 20px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px', marginBottom: '36px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>S</div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>Staylo</span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.6, maxWidth: '260px' }}>
              Your trusted partner for finding the perfect accommodation across India.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '12px', fontSize: '0.9rem' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/about" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>About Us</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Careers</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Blog</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '12px', fontSize: '0.9rem' }}>Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Help Center</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Cancellation</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Contact Us</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '12px', fontSize: '0.9rem' }}>Partners</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/extranet" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>List Property</Link>
              <Link href="/login" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Partner Login</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '12px', fontSize: '0.9rem' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Privacy Policy</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Terms of Service</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Refund Policy</Link>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1E293B', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ color: '#64748B', fontSize: '0.8rem' }}>© 2026 Staylo. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href="tel:+919899308683" style={{ color: '#94A3B8', fontSize: '0.8rem' }}>📞 +91-98993-08683</a>
            <a href="mailto:support@staylo.in" style={{ color: '#94A3B8', fontSize: '0.8rem' }}>✉️ support@staylo.in</a>
          </div>
        </div>
      </div>
    </footer>
  );
}