'use server';

import {
  personalizedHotelRecommendations,
  type PersonalizedHotelRecommendationsInput,
  type PersonalizedHotelRecommendationsOutput,
} from '@/ai/flows/personalized-hotel-recommendations';

export async function getHotelRecommendations(
  input: PersonalizedHotelRecommendationsInput
): Promise<PersonalizedHotelRecommendationsOutput> {
  // Basic validation
  if (!input.destination) {
    throw new Error('Destination is required.');
  }
  
  try {
    const recommendations = await personalizedHotelRecommendations(input);
    // The AI might return an empty list, which is a valid response.
    if (!recommendations.hotelRecommendations) {
        return { hotelRecommendations: [] };
    }
    return recommendations;
  } catch (error) {
    console.error('Error fetching hotel recommendations:', error);
    // Re-throwing a more user-friendly error
    throw new Error("Failed to get recommendations from AI. The AI model might be unavailable or the request timed out. Please try again later.");
  }
}
