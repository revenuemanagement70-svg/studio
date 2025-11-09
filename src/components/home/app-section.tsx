import Link from 'next/link';
import { Smartphone } from 'lucide-react';

const GooglePlayIcon = () => (
  <svg className="size-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google Play</title><path fill="currentColor" d="M2.66 1.15a1.28 1.28 0 0 0-.96 1.48l3.24 16.5a1.28 1.28 0 0 0 1.25.96h.04a1.28 1.28 0 0 0 1.24-.96L21.4 5.3a1.28 1.28 0 0 0-.96-1.48l-1.29-.26-14.04-2.4Zm1.16 2.39L15.36 12 3.82 3.54ZM16.64 12l3.4-1.74-3.8-3.44v6.88Zm-1.28 1.69L3.82 20.46l11.54-8.77ZM4.9 21.84l12.5-6.25-2.7-2.7Z"/></svg>
);

const AppleIcon = () => (
  <svg className="size-5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Apple</title><path fill="currentColor" d="M19.05 16.42c-.22 1.54-1.5 2.82-1.5 2.82s-1.23.86-3.23-.42c-1.99-1.28-2.87-3.4-4.04-3.4s-1.44 2.06-3.56 3.42c-2.12 1.36-3.32.49-3.32.49s-1.5-1.54-1.72-3.35c-.22-1.81.79-3.42 1.5-4.56.71-1.13 1.5-2.26 2.76-2.26s1.6.72 2.92.72 1.6-.79 3.06-.79 2.06 1.21 2.75 2.25c.7 1.05 1.16 2.54.84 4.09zM15.19 8.6c.06-1.54.9-2.95 2.19-3.61-.13-.06-1.87-1.09-3.62.43-1.75 1.52-2.38 3.61-2.06 5.3.19 1.07.69 2.13 1.56 2.81.12.07 1.23.79 2.19-.43.06-.06-.8-1.29-.26-4.5z"/></svg>
);

export function AppSection() {
    return (
        <section className="py-12 lg:py-24 bg-gray-900 text-white" aria-labelledby="app-heading">
            <div className="container mx-auto px-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 id="app-heading" className="font-headline text-3xl lg:text-4xl font-bold mb-4">Book on the Go with the Staylo App</h2>
                        <p className="text-gray-400 lg:text-lg mb-8">
                            Download our mobile app and enjoy a seamless booking experience with exclusive app-only deals and instant notifications.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="#" className="flex items-center justify-center gap-3 bg-white text-gray-900 py-3 px-6 rounded-lg text-base font-bold hover:bg-gray-200 transition-colors">
                                <GooglePlayIcon /> Google Play
                            </Link>
                            <Link href="#" className="flex items-center justify-center gap-3 bg-white text-gray-900 py-3 px-6 rounded-lg text-base font-bold hover:bg-gray-200 transition-colors">
                                <AppleIcon /> App Store
                            </Link>
                        </div>
                    </div>
                    <div className="hidden md:flex justify-center items-center">
                        <Smartphone className="size-48 lg:size-64 opacity-20 rotate-12" />
                        <Smartphone className="size-48 lg:size-64 text-white -ml-24" />
                    </div>
                </div>
            </div>
        </section>
    );
}
