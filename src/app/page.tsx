import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/home/hero';
import { Stats } from '@/components/home/stats';
import { Features } from '@/components/home/features';
import { Destinations } from '@/components/home/destinations';
import { Offers } from '@/components/home/offers';
import { AppSection } from '@/components/home/app-section';
import { FirebaseProvider } from '@/firebase/provider';

export default function Home() {
  return (
    <FirebaseProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main id="main">
          <a href="#main" className="sr-only focus:not-sr-only">Skip to main content</a>
          <Hero />
          <Stats />
          <Features />
          <Destinations />
          <Offers />
          <AppSection />
        </main>
        <Footer />
      </div>
    </FirebaseProvider>
  );
}
