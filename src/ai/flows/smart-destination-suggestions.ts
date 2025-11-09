'use server';

/**
 * @fileOverview AI flow for suggesting destinations based on user preferences, past travel data, and trending locations.
 *
 * - `suggestDestinations` - A function that suggests destinations.
 * - `SuggestDestinationsInput` - The input type for the `suggestDestinations` function.
 * - `SuggestDestinationsOutput` - The output type for the `suggestDestinations` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDestinationsInputSchema = z.object({
  preferences: z
    .string()
    .describe('User preferences for travel, e.g., beach, mountains, city, historical sites.'),
  pastTravelData: z
    .string()
    .describe('Past travel history of the user, including locations visited and travel styles.'),
  trendingLocations: z
    .string()
    .describe('Current trending travel destinations.'),
});
export type SuggestDestinationsInput = z.infer<typeof SuggestDestinationsInputSchema>;

const SuggestDestinationsOutputSchema = z.object({
  suggestedDestinations: z
    .array(z.string())
    .describe('List of suggested destinations based on user input.'),
});
export type SuggestDestinationsOutput = z.infer<typeof SuggestDestinationsOutputSchema>;

export async function suggestDestinations(input: SuggestDestinationsInput): Promise<SuggestDestinationsOutput> {
  return suggestDestinationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDestinationsPrompt',
  input: {schema: SuggestDestinationsInputSchema},
  output: {schema: SuggestDestinationsOutputSchema},
  prompt: `You are a travel expert, and you are going to suggest destinations to users based on their preferences, past travel data, and trending locations.

Consider the following information:

User Preferences: {{{preferences}}}
Past Travel Data: {{{pastTravelData}}}
Trending Locations: {{{trendingLocations}}}

Based on the information above, suggest a list of destinations the user may want to visit. Return the destinations as a JSON array of strings.

{{#each suggestedDestinations}}
- {{{this}}}
{{/each}}`,
});

const suggestDestinationsFlow = ai.defineFlow(
  {
    name: 'suggestDestinationsFlow',
    inputSchema: SuggestDestinationsInputSchema,
    outputSchema: SuggestDestinationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
