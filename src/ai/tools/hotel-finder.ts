'use server';

import { ai } from '@/ai/genkit';
import { hotelData } from '@/app/lib/hotel-data';
import { z } from 'zod';

export const findHotels = ai.defineTool(
  {
    name: 'findHotels',
    description: 'Finds hotels based on a destination.',
    inputSchema: z.object({
      destination: z.string().describe('The city to search for hotels in.'),
    }),
    outputSchema: z.array(
      z.object({
        name: z.string(),
        address: z.string(),
        price: z.number(),
        rating: z.number(),
        amenities: z.array(z.string()),
        description: z.string(),
      })
    ),
  },
  async (input) => {
    console.log(`[hotel-finder tool] Searching for hotels in: ${input.destination}`);
    const destinationLower = input.destination.toLowerCase();
    
    const results = hotelData.filter(hotel => 
        hotel.address.toLowerCase().includes(destinationLower)
    );

    console.log(`[hotel-finder tool] Found ${results.length} hotels.`);
    return results;
  }
);
