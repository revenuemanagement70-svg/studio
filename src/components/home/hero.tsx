import { Flame, CheckCircle } from 'lucide-react';
import { SearchSection } from './search-section';
import { SmartSuggestions } from './smart-suggestions';

export function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden" aria-labelledby="hero-heading">
      <div className="container mx-auto px-5 z-10 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white py-2 px-5 rounded-full text-sm font-semibold text-primary shadow-lg mb-6">
            <Flame className="size-4" aria-hidden="true" />
            India's #1 Hotel Booking Platform
          </div>
          <h1 id="hero-heading" className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold !leading-tight mb-4">
            Find Your Perfect Stay<br />
            <span className="gradient-text">Across India</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg flex items-center justify-center gap-2 mb-8">
            <CheckCircle className="size-5 text-primary" /> 15,000+ Hotels • Best Price Guarantee • Instant Confirmation
          </p>
        </div>

        <SearchSection />
        <SmartSuggestions />
      </div>
    </section>
  );
}
