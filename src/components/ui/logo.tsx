'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

export function Logo({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-2xl font-black font-headline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg",
        className
      )}
      {...props}
    >
      <div className="bg-primary text-primary-foreground p-1.5 rounded-md flex items-center justify-center">
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18 20V8C18 5.79086 16.2091 4 14 4H6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 12H12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="gradient-text">Staylo</span>
    </Link>
  );
}
