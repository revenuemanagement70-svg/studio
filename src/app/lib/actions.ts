'use server';

import { hotelData } from '@/app/lib/hotel-data';
import type { hotel } from '@/lib/types';

// This is a temporary interface definition.
// It will be replaced by the actual AI flow output type later.
export interface PersonalizedHotelRecommendationsOutput {
  hotelRecommendations: hotel[];
}
export interface PersonalizedHotelRecommendationsInput {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  budget: string;
  travelStyle: string;
}


export async function getHotelRecommendations(
  input: PersonalizedHotelRecommendationsInput
): Promise<PersonalizedHotelRecommendationsOutput> {
  // Basic validation
  if (!input.destination) {
    throw new Error('Destination is required.');
  }
  
  try {
    const destinationLower = input.destination.toLowerCase();
    
    // NOTE: This now filters from the static hotel data.
    // The next step will be to fetch this from Firestore.
    const results = hotelData.filter(hotel => 
        hotel.address.toLowerCase().includes(destinationLower)
    );

    // Simulate a network delay to make loading states visible
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { hotelRecommendations: results };
  } catch (error) {
    console.error('Error fetching hotel recommendations:', error);
    throw new Error("Failed to get recommendations. Please try again later.");
  }
}
