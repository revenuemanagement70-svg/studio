import { Percent, CreditCard, Crown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const offersList = [
    { icon: <Percent />, title: "Flat 30% OFF", description: "Book now and save up to 30% on your first booking. Valid for new users on stays worth ₹2,000 or more.", cta: "Grab Deal" },
    { icon: <CreditCard />, title: "Bank Offers", description: "Extra 15% instant discount with HDFC, ICICI, and Axis Bank cards. Limited period offer.", cta: "View Banks" },
    { icon: <Crown />, title: "Premium Membership", description: "Join Staylo Premium for exclusive access to luxury hotels, free upgrades, and priority support.", cta: "Join Now" },
];

export function Offers() {
    return (
        <section id="offers" className="py-12 lg:py-24 bg-gradient-to-r from-primary to-accent text-white" aria-labelledby="offers-heading">
            <div className="container mx-auto px-5">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-block bg-white/10 text-white py-1 px-4 rounded-full font-bold text-sm mb-4">
                        LIMITED TIME
                    </div>
                    <h2 id="offers-heading" className="font-headline text-3xl lg:text-4xl font-bold mb-4">Exclusive Deals & Offers</h2>
                    <p className="opacity-90 lg:text-lg">Save more on your next booking with our special offers</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {offersList.map((offer, index) => (
                        <Card key={index} className="bg-white/10 border-white/20 text-white overflow-hidden transition-transform duration-300 hover:-translate-y-2 flex flex-col">
                           <CardHeader>
                             <div className="text-4xl mb-4 opacity-80">{offer.icon}</div>
                             <CardTitle className="text-xl font-bold font-headline text-white">{offer.title}</CardTitle>
                           </CardHeader>
                           <CardContent className="flex flex-col flex-grow">
                                <p className="opacity-80 text-sm flex-grow mb-6">{offer.description}</p>
                                <Button variant="secondary" className="mt-auto w-fit bg-white text-primary hover:bg-white/90 font-bold">
                                    {offer.cta} <ArrowRight className="size-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
