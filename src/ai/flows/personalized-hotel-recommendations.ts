'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing personalized hotel recommendations.
 *
 * - personalizedHotelRecommendations - A function that takes travel dates, guest count, and other factors as input and returns personalized hotel recommendations.
 * - PersonalizedHotelRecommendationsInput - The input type for the personalizedHotelRecommendations function.
 * - PersonalizedHotelRecommendationsOutput - The return type for the personalizedHotelRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { findHotels } from '../tools/hotel-finder';

const PersonalizedHotelRecommendationsInputSchema = z.object({
  destination: z.string().describe('The destination city for the hotel search.'),
  checkInDate: z.string().describe('The check-in date for the hotel stay (YYYY-MM-DD).'),
  checkOutDate: z.string().describe('The check-out date for the hotel stay (YYYY-MM-DD).'),
  numberOfGuests: z.number().int().min(1).describe('The number of guests for the hotel stay.'),
  budget: z.string().optional().describe("The guest's expected budget for the hotel, can be low, medium, or high."),
  amenities: z.string().optional().describe("A comma separated list of desired amenities, such as 'pool, gym, free wifi'."),
  travelStyle: z.string().optional().describe("The travel style of the guest, such as 'business', 'family', 'romantic', or 'adventure'."),
});
export type PersonalizedHotelRecommendationsInput = z.infer<typeof PersonalizedHotelRecommendationsInputSchema>;

const PersonalizedHotelRecommendationsOutputSchema = z.object({
  hotelRecommendations: z.array(
    z.object({
      name: z.string().describe('The name of the hotel.'),
      address: z.string().describe('The address of the hotel.'),
      price: z.number().describe('The price per night of the hotel.'),
      rating: z.number().describe('The rating of the hotel (out of 5).'),
      amenities: z.array(z.string()).describe('The list of amenities offered by the hotel.'),
      description: z.string().describe('A short description of the hotel.'),
    })
  ).describe('A list of personalized hotel recommendations.'),
});
export type PersonalizedHotelRecommendationsOutput = z.infer<typeof PersonalizedHotelRecommendationsOutputSchema>;

export async function personalizedHotelRecommendations(
  input: PersonalizedHotelRecommendationsInput
): Promise<PersonalizedHotelRecommendationsOutput> {
  return personalizedHotelRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedHotelRecommendationsPrompt',
  input: {schema: PersonalizedHotelRecommendationsInputSchema},
  output: {schema: PersonalizedHotelRecommendationsOutputSchema},
  tools: [findHotels],
  prompt: `You are a hotel recommendation expert. A user is planning a trip to {{destination}} from {{checkInDate}} to {{checkOutDate}} with {{numberOfGuests}} guests.

  {{#if budget}}The user's budget is {{budget}}.{{/if}}
  {{#if amenities}}The user is looking for hotels with the following amenities: {{amenities}}.{{/if}}
  {{#if travelStyle}}The user's travel style is {{travelStyle}}.{{/if}}

  Based on this information, recommend a few hotels in {{destination}} that would be a good fit for the user. Provide the hotel name, address, price per night, rating, list of amenities, and a short description.  Include at least 3 recommendations.

  To do this, you MUST first use the findHotels tool to search for hotels in the user's desired destination. Then, use the user's other preferences (like budget and travel style) to select, rank, and present the best options from the search results.
  
  Do not make up hotels. Only recommend hotels that are returned by the findHotels tool.`,
});

const personalizedHotelRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedHotelRecommendationsFlow',
    inputSchema: PersonalizedHotelRecommendationsInputSchema,
    outputSchema: PersonalizedHotelRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
