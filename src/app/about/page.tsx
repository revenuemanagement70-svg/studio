import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Image from 'next/image';
import { Globe, Heart, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const values = [
  {
    icon: <Heart className="size-8 text-primary" />,
    title: 'Customer First',
    description: 'We are obsessed with providing the best experience for our guests and partners. Their satisfaction is our ultimate metric for success.',
  },
  {
    icon: <Globe className="size-8 text-primary" />,
    title: 'Think Big',
    description: 'We aim to build a world-class product that redefines the future of travel and hospitality, not just in India, but globally.',
  },
  {
    icon: <Users className="size-8 text-primary" />,
    title: 'Empower People',
    description: 'We believe in fostering a culture of ownership, trust, and collaboration, empowering our team to do their best work.',
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/30">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        {/* Hero Section */}
        <section className="relative bg-background py-20 lg:py-32">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1542314831-068cd1dbb563?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxob3RlbCUyMGxvYmJ5fGVufDB8fHx8MTc2MjgxNTM1OXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Modern hotel lobby"
              data-ai-hint="hotel lobby"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="container mx-auto px-5 relative text-center text-white">
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold !leading-tight mb-4">
              About Staylo
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Connecting travelers with unforgettable stays across India.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-5">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-headline text-3xl lg:text-4xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground lg:text-lg mb-6">
                  At Staylo, our mission is to make travel simple, accessible, and enjoyable for everyone. We believe that finding the perfect place to stay should be as exciting as the journey itself. By leveraging cutting-edge technology and building strong partnerships, we are creating a trusted platform that offers unparalleled choice, value, and service to millions of travelers.
                </p>
                <p className="text-muted-foreground lg:text-lg">
                  We empower our hotel partners with the tools they need to thrive in the digital age, ensuring they can provide the best possible hospitality to our shared customers.
                </p>
              </div>
              <div className="relative h-80 w-full rounded-xl shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJlY2VwdGlvbnxlbnwwfHx8fDE3NjMxMzYxODl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Hotel reception with friendly staff"
                  data-ai-hint="hotel reception"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 lg:py-24 bg-secondary/30">
            <div className="container mx-auto px-5">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="font-headline text-3xl lg:text-4xl font-bold mb-4">Our Core Values</h2>
                    <p className="text-muted-foreground lg:text-lg">The principles that guide every decision we make.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {values.map((value) => (
                        <Card key={value.title} className="text-center p-8 bg-background border-0 shadow-lg">
                            <div className="mx-auto flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 mb-6">
                                {value.icon}
                            </div>
                            <h3 className="font-headline text-xl font-bold mb-2">{value.title}</h3>
                            <p className="text-muted-foreground text-sm">{value.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
