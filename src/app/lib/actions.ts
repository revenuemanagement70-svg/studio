'use server';

import { hotelData } from '@/app/lib/hotel-data';
import type { PersonalizedHotelRecommendationsInput, PersonalizedHotelRecommendationsOutput } from '@/ai/flows/personalized-hotel-recommendations';

export async function getHotelRecommendations(
  input: PersonalizedHotelRecommendationsInput
): Promise<PersonalizedHotelRecommendationsOutput> {
  // Basic validation
  if (!input.destination) {
    throw new Error('Destination is required.');
  }
  
  try {
    const destinationLower = input.destination.toLowerCase();
    
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
