'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Star } from "lucide-react";
import { useHotels } from "@/firebase/firestore/use-hotels";
import { HotelCardSkeleton } from "@/components/results/hotel-card-skeleton";
import { Badge } from "@/components/ui/badge";

export default function PropertiesPage() {
  const { hotels, loading, error } = useHotels();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Properties</h1>
            <p className="text-muted-foreground">Manage your hotel listings.</p>
        </div>
        <Button asChild>
            <Link href="/admin/properties/add">
                <PlusCircle className="size-4 mr-2" />
                Add New Property
            </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Properties</CardTitle>
          <CardDescription>A list of all properties in your inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="space-y-4">
              <HotelCardSkeleton />
              <HotelCardSkeleton />
            </div>
          )}
          {error && <p className="text-destructive text-center">{error}</p>}
          {!loading && !error && (
            hotels.length > 0 ? (
              <div className="space-y-4">
                {hotels.map((hotel) => (
                  <Card key={hotel.name} className="flex items-center p-4 gap-4">
                    <div className="flex-grow">
                      <h3 className="font-bold font-headline">{hotel.name}</h3>
                      <p className="text-sm text-muted-foreground">{hotel.address}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">₹{hotel.price}/night</Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="size-3 fill-amber-400 text-amber-500" /> {hotel.rating}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No properties found. Add your first property to get started.</p>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
