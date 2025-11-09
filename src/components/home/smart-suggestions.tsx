'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Lightbulb, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { suggestDestinations } from '@/ai/flows/smart-destination-suggestions';

const travelStyles = ['Beach', 'Mountains', 'City', 'Historical Sites'];
const trendingLocations = ['Goa', 'Shimla', 'Mumbai', 'Jaipur', 'Varanasi'];

export function SmartSuggestions() {
  const [preference, setPreference] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  const handleSuggestion = async () => {
    if (!preference) return;
    setLoading(true);
    setSuggestions([]);
    try {
      const result = await suggestDestinations({
        preferences: preference,
        pastTravelData: 'none',
        trendingLocations: trendingLocations.join(', '),
      });
      setSuggestions(result.suggestedDestinations);
    } catch (error) {
      console.error('Error getting suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationClick = (destination: string) => {
    router.push(`/results?destination=${destination}`);
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto text-center">
      <h3 className="inline-flex items-center gap-2 font-headline text-xl font-semibold mb-4">
        <Sparkles className="size-5 text-accent" />
        Need some Inspiration?
      </h3>
      <p className="text-muted-foreground mb-6">
        Let our AI suggest the perfect destination for you based on your travel style.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Select onValueChange={setPreference} value={preference}>
          <SelectTrigger className="w-full sm:w-[240px] h-12 text-base">
             <Lightbulb className="mr-2 h-5 w-5 text-primary" />
            <SelectValue placeholder="Choose a travel style..." />
          </SelectTrigger>
          <SelectContent>
            {travelStyles.map((style) => (
              <SelectItem key={style} value={style}>
                {style}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSuggestion} disabled={loading || !preference} size="lg" className="h-12 w-full sm:w-auto">
          {loading ? 'Thinking...' : 'Get Suggestions'}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <h4 className="font-bold mb-4 text-lg">Here are some suggestions for you:</h4>
          <div className="flex flex-wrap justify-center gap-3">
            {suggestions.map((dest) => (
              <Button
                key={dest}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
                onClick={() => handleDestinationClick(dest)}
              >
                <Map className="mr-2" />
                {dest}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
