import React from 'react';
import { DollarSign, Shield, Zap, Headset, Undo, Gift } from 'lucide-react';
import { Card } from '@/components/ui/card';

const featuresList = [
    { icon: <DollarSign />, title: "Best Price Guarantee", description: "Find the same hotel cheaper elsewhere? We'll refund the difference." },
    { icon: <Shield />, title: "100% Secure Booking", description: "Your data is protected with industry-leading encryption." },
    { icon: <Zap />, title: "Instant Confirmation", description: "Get instant booking confirmation via SMS and email." },
    { icon: <Headset />, title: "24/7 Customer Support", description: "Our dedicated support team is available round the clock." },
    { icon: <Undo />, title: "Free Cancellation", description: "Free cancellation on most bookings up to 24 hours before check-in." },
    { icon: <Gift />, title: "Exclusive Rewards", description: "Earn rewards on every booking and save more on future stays." },
];

export function Features() {
    return (
        <section id="features" className="py-12 lg:py-24 bg-background" aria-labelledby="features-heading">
            <div className="container mx-auto px-5">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 text-primary py-1 px-4 rounded-full font-bold text-sm mb-4">
                        WHY CHOOSE US
                    </div>
                    <h2 id="features-heading" className="font-headline text-3xl lg:text-4xl font-bold mb-4">Experience Excellence</h2>
                    <p className="text-muted-foreground lg:text-lg">We provide the best hotel booking experience with unmatched features.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuresList.map((feature, index) => (
                        <Card key={index} className="p-6 text-center sm:text-left sm:flex sm:items-start sm:gap-6 hover:shadow-xl transition-shadow duration-300 border-0 bg-secondary/30">
                            <div className="mx-auto sm:mx-0 flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 mb-4 sm:mb-0">
                                {React.cloneElement(feature.icon, { className: 'size-8 text-primary' })}
                            </div>
                            <div>
                                <h3 className="font-headline text-lg font-bold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
