'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function BookingsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here you would typically fetch the booking from Firestore
        alert(`Searching for booking: ${searchQuery}`);
    }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Bookings</h1>
            <p className="text-muted-foreground">Search and manage hotel bookings.</p>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Bookings</CardTitle>
          <CardDescription>Enter a booking ID to find booking details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center gap-4">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-primary" />
                <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter Booking ID (e.g., StyABCD)"
                    className="pl-10 h-12 text-base"
                />
            </div>
            <Button type="submit" className="h-12 text-base font-bold">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>A list of the most recent bookings.</CardDescription>
        </CardHeader>
        <CardContent>
           <p className="text-muted-foreground text-center py-8">Recent bookings will be shown here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
