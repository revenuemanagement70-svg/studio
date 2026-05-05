import Link from "next/link";

const FEATURES = [
  { icon: "📈", title: "Grow Revenue", desc: "Access thousands of travelers searching for hotels every day." },
  { icon: "🎯", title: "Smart Dashboard", desc: "Track bookings, revenue, and occupancy in real-time." },
  { icon: "⚡", title: "Easy Listing", desc: "List your property in minutes with our simple onboarding process." },
  { icon: "🛡️", title: "Secure Payments", desc: "Guaranteed payouts with transparent commission structure." },
];

export default function PartnerPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 sm:py-28 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 to-indigo-950/50" />
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Partner</span>
            {" "}
            <span className="text-white">With Staylo</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Join India&apos;s fastest-growing hotel platform. List your property, reach more travelers, and grow your business.
          </p>
          <Link href="/partner/onboard" className="btn-primary text-lg px-10 py-4 inline-block">
            List Your Property →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="glass-card p-6 sm:p-8">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
