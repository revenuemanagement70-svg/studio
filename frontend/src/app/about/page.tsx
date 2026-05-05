import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <section style={{ background: 'linear-gradient(180deg, #FFF0F3 0%, #FFFFFF 100%)', padding: '80px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '16px' }}>
            About <span style={{ background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Staylo</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto' }}>
            We are on a mission to make hotel booking accessible, affordable, and delightful for every Indian traveler.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>Our Mission</h2>
              <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '24px' }}>
                Staylo.in was founded with a simple belief: everyone deserves a great place to stay, regardless of their budget. We partner with hotels across India to bring you verified, quality-assured accommodations at the best prices.
              </p>
              <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.8 }}>
                From luxury 5-star hotels to cozy budget stays, our platform connects travelers with 15,000+ properties across 500+ cities in India. Every property is verified, every booking is instant, and every stay is guaranteed.
              </p>
            </div>
            <div style={{ borderRadius: '20px', overflow: 'hidden', height: '400px' }}>
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800" alt="Hotel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#FFF8F9' }}>
        <div className="container">
          <div className="section-header">
            <h2>Our Values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
            {[
              { icon: 'ðŸ¤', title: 'Trust & Transparency', desc: 'No hidden charges. What you see is what you pay. Verified reviews from real guests.' },
              { icon: 'ðŸ’¡', title: 'Innovation', desc: 'Leveraging technology to make hotel booking smarter, faster, and more personalized.' },
              { icon: 'â¤ï¸', title: 'Guest First', desc: 'Every decision we make is driven by what is best for our guests and hotel partners.' },
            ].map(v => (
              <div key={v.title} style={{ textAlign: 'center', padding: '40px 24px', background: 'white', borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{v.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>{v.title}</h3>
                <p style={{ color: '#64748B', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'linear-gradient(135deg, #FF1F71, #FF7E5F)', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: '16px' }}>Ready to explore?</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '32px' }}>Start your journey with Staylo today.</p>
          <Link href="/search" className="btn btn-white btn-lg">Search Hotels â†’</Link>
        </div>
      </section>
    </>
  );
}