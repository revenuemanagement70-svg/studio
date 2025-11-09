import React from 'react';
import { Building2, Map, Users, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

const stats = [
    { icon: <Building2 />, number: '15,000+', label: 'Hotels Listed' },
    { icon: <Map />, number: '500+', label: 'Cities Covered' },
    { icon: <Users />, number: '10M+', label: 'Happy Guests' },
    { icon: <Star />, number: '4.8', label: 'Average Rating' },
];

export function Stats() {
    return (
        <section className="py-12 lg:py-20" aria-label="Statistics">
            <div className="container mx-auto px-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
                    {stats.map((stat, index) => (
                        <Card key={index} className="text-center p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-0 shadow-sm">
                            <div className="flex justify-center items-center mb-3 text-primary">
                                {React.cloneElement(stat.icon, { className: 'size-8' })}
                            </div>
                            <div className="text-2xl lg:text-3xl font-bold font-headline text-foreground">{stat.number}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
