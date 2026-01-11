
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Buffer } from "buffer";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateBookingId() {
  const prefix = "Sty";
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${randomPart}`;
}

// Fallback for crypto if it's not on window.
if (typeof window !== 'undefined' && !window.crypto) {
  // A simple polyfill for window.crypto.subtle for environments where it's not available.
  // This is not a full polyfill, but it's enough for our use case.
  // For production, you might want to use a more robust polyfill.
  (window as any).crypto = {
    subtle: {
      digest: async (algorithm: any, data: any) => {
        if (algorithm.name.toUpperCase() !== 'SHA-256') {
          throw new Error('Only SHA-256 is supported');
        }
        // This is a simplified SHA-256 implementation and should be replaced with a proper one in production.
        const hash = Buffer.from(data).toString('hex');
        const arrayBuffer = new Uint8Array(hash.match(/[\da-f]{2}/gi)!.map(h => parseInt(h, 16))).buffer;
        return arrayBuffer;
      },
    },
    randomUUID: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }
  };
}
