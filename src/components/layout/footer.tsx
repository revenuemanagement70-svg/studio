import Link from 'next/link';
import { Facebook, Instagram, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-gray-300 pt-16 pb-8" aria-labelledby="footer-heading">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-1 sm:col-span-2">
            <h3 id="footer-heading" className="text-2xl font-black gradient-text font-headline mb-4">Staylo</h3>
            <p className="text-gray-400 text-sm mb-4 max-w-xs">
              Your trusted partner for finding the perfect accommodation across India.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-800 hover:bg-primary text-white transition-colors"><Facebook className="size-4" /></a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-800 hover:bg-primary text-white transition-colors"><Instagram className="size-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-headline font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">Press</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">Safety</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">Cancellation</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-semibold text-white mb-4">Partners</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">List Property</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">Partner Login</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">Affiliates</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">Partner Support</Link></li>
            </ul>
          </div>
           <div>
            <h4 className="font-headline font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Staylo. All rights reserved.</p>
          <div className="flex justify-center items-center gap-x-6 gap-y-2 mt-2 flex-wrap">
            <a href="tel:+919899308683" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Phone className="size-4" /> +91-98993-08683
            </a>
            <a href="mailto:support@staylo.com" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Mail className="size-4" /> support@staylo.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
