'use client';

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Star, Trash2, Pencil } from "lucide-react";
import { useHotels } from "@/firebase/firestore/use-hotels";
import { HotelCardSkeleton } from "@/components/results/hotel-card-skeleton";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteHotel } from "@/firebase/firestore/hotels";
import { useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import type { hotel as Hotel } from "@/lib/types";

function DeleteConfirmationDialog({ hotel, onDeleted }: { hotel: Hotel, onDeleted: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!firestore || !hotel.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete property.",
      });
      return;
    }
    try {
      await deleteHotel(firestore, hotel.id);
      toast({
        title: "Property Deleted",
        description: `${hotel.name} has been removed.`,
      });
      onDeleted();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          error instanceof Error ? error.message : "Could not delete property.",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" className="size-9"><Trash2 className="size-4" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            property "{hotel.name}" and remove it from any user's favorites.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


export default function PropertiesPage() {
  const { hotels, loading, error } = useHotels();
  const [deletedHotels, setDeletedHotels] = useState<string[]>([]);
  
  const handleHotelDeleted = (hotelId: string) => {
    setDeletedHotels(prev => [...prev, hotelId]);
  }
  
  const visibleHotels = hotels.filter(h => !deletedHotels.includes(h.id));

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
            visibleHotels.length > 0 ? (
              <div className="space-y-4">
                {visibleHotels.map((hotel) => (
                  <Card key={hotel.id} className="flex items-center p-4 gap-4">
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
                       <Button asChild variant="outline" size="icon" className="size-9">
                        <Link href={`/admin/properties/edit/${hotel.id}`}>
                           <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <DeleteConfirmationDialog hotel={hotel} onDeleted={() => handleHotelDeleted(hotel.id)} />
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
