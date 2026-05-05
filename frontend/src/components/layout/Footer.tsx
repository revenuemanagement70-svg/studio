import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">S</div>
              <span className="text-lg font-bold text-white">Staylo.in</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              India&apos;s premium hotel booking platform. Luxury stays, unbeatable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <div className="flex flex-col gap-2">
              <Link href="/search?city=Mumbai" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Mumbai Hotels</Link>
              <Link href="/search?city=Delhi" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Delhi Hotels</Link>
              <Link href="/search?city=Goa" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Goa Hotels</Link>
              <Link href="/search?city=Jaipur" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Jaipur Hotels</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <div className="flex flex-col gap-2">
              <Link href="/partner" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Partner With Us</Link>
              <Link href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">About</Link>
              <Link href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Careers</Link>
              <Link href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Contact</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Help Center</Link>
              <Link href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Cancellation Policy</Link>
              <Link href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-8 text-center">
          <p className="text-slate-500 text-sm">&copy; 2026 Staylo.in — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
