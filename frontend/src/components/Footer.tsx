import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#0F172A', color: '#E2E8F0', padding: '64px 0 24px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>S</div>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>Staylo</span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '280px' }}>
              Your trusted partner for finding the perfect accommodation across India. 15,000+ hotels in 500+ cities.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/about" style={{ color: '#94A3B8', fontSize: '0.9rem', transition: 'all 0.3s' }}>About Us</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Careers</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Press</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Blog</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Help Center</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Safety</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Cancellation</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Contact Us</Link>
            </div>
          </div>

          {/* Partners */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Partners</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/extranet" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>List Property</Link>
              <Link href="/login" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Partner Login</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Affiliates</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Partner Support</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Privacy Policy</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Terms of Service</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Cookie Policy</Link>
              <Link href="/contact" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Refund Policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid #1E293B', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ color: '#64748B', fontSize: '0.85rem' }}>© 2026 Staylo. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="tel:+919899308683" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>📞 +91-98993-08683</a>
            <a href="mailto:support@staylo.in" style={{ color: '#94A3B8', fontSize: '0.85rem' }}>✉️ support@staylo.in</a>
          </div>
        </div>
      </div>
    </footer>
  );
}