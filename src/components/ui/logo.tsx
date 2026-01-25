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
            <path
                d="M17.5 4.5C17.5 6.98528 15.4853 9 13 9H11C8.51472 9 6.5 11.0147 6.5 13.5C6.5 15.9853 8.51472 18 11 18H13"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
      </div>
      <span className="gradient-text">Staylo</span>
    </Link>
  );
}
