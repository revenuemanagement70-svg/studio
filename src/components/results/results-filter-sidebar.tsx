'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Wifi, ParkingCircle, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';


const ratings = [5, 4, 3, 2, 1];
const allAmenities = ["wifi", "pool", "gym", "parking", "restaurant"];

interface ResultsFilterSidebarProps {
    price: number;
    onPriceChange: (price: number) => void;
    ratings: number[];
    onRatingChange: (ratings: number[]) => void;
    amenities: string[];
    onAmenitiesChange: (amenities: string[]) => void;
}

export function ResultsFilterSidebar({
    price,
    onPriceChange,
    ratings: selectedRatings,
    onRatingChange,
    amenities: selectedAmenities,
    onAmenitiesChange
}: ResultsFilterSidebarProps) {

    const handleRatingChange = (rating: number) => {
        const newRatings = selectedRatings.includes(rating)
            ? selectedRatings.filter(r => r !== rating)
            : [...selectedRatings, rating];
        onRatingChange(newRatings);
    }
    
    const handleAmenityChange = (amenity: string) => {
        const newAmenities = selectedAmenities.includes(amenity)
            ? selectedAmenities.filter(a => a !== amenity)
            : [...selectedAmenities, amenity];
        onAmenitiesChange(newAmenities);
    }

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle>Filter Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="price-range" className="font-semibold">Max Price</Label>
                        <span className="font-bold text-primary">₹{price.toLocaleString('en-IN')}</span>
                    </div>
                    <Slider
                        id="price-range"
                        max={30000}
                        step={1000}
                        value={[price]}
                        onValueChange={(value) => onPriceChange(value[0])}
                    />
                </div>

                <div className="space-y-4">
                    <Label className="font-semibold">Star Rating</Label>
                    <div className="space-y-2">
                        {ratings.map(rating => (
                            <div key={rating} className="flex items-center gap-2">
                                <Checkbox 
                                    id={`rating-${rating}`} 
                                    checked={selectedRatings.includes(rating)}
                                    onCheckedChange={() => handleRatingChange(rating)}
                                />
                                <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1 font-normal cursor-pointer">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={cn("size-4", i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300")} />
                                    ))}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
                
                 <div className="space-y-4">
                    <Label className="font-semibold">Amenities</Label>
                    <div className="space-y-2">
                        {allAmenities.map(amenity => (
                             <div key={amenity} className="flex items-center gap-2">
                                <Checkbox 
                                    id={`amenity-${amenity}`}
                                    checked={selectedAmenities.includes(amenity)}
                                    onCheckedChange={() => handleAmenityChange(amenity)}
                                />
                                <Label htmlFor={`amenity-${amenity}`} className="capitalize font-normal cursor-pointer">{amenity}</Label>
                            </div>
                        ))}
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
