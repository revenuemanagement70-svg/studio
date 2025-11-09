'use client';

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useFirestore } from "@/firebase";
import { addHotel } from "@/firebase/firestore/hotels";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AddPropertyPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [amenities, setAmenities] = useState("");
  const [imageUrls, setImageUrls] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Firestore is not available.",
      });
      return;
    }

    const hotelData = {
      name,
      address,
      description,
      price: Number(price),
      rating: Number(rating),
      amenities: amenities.split(',').map(a => a.trim()),
      imageUrls: imageUrls.split('\n').map(url => url.trim()).filter(url => url),
    };

    if (hotelData.imageUrls.length === 0) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please provide at least one image URL.",
        });
        return;
    }

    startTransition(async () => {
      try {
        await addHotel(firestore, hotelData);
        toast({
          title: "Property Added!",
          description: `${name} has been successfully added to your inventory.`,
        });
        router.push("/admin/properties");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error instanceof Error ? error.message : "Could not add property.",
        });
      }
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Add New Property</h1>
        <p className="text-muted-foreground">Fill in the details below to add a new hotel to your inventory.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="name">Property Name</Label>
                    <Input id="name" placeholder="e.g., The Grand Heritage" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="e.g., 123 Palace Road, Jaipur, Rajasthan" value={address} onChange={e => setAddress(e.target.value)} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="A short description of the property." value={description} onChange={e => setDescription(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="imageUrls">Image URLs (one per line)</Label>
                    <Textarea id="imageUrls" placeholder="https://example.com/image1.jpg&#x000A;https://example.com/image2.jpg" value={imageUrls} onChange={e => setImageUrls(e.target.value)} required rows={4} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="price">Price per night (₹)</Label>
                        <Input id="price" type="number" placeholder="e.g., 7500" value={price} onChange={e => setPrice(e.target.value)} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="rating">Rating (1-5)</Label>
                        <Input id="rating" type="number" step="0.1" min="1" max="5" placeholder="e.g., 4.8" value={rating} onChange={e => setRating(e.target.value)} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                        <Input id="amenities" placeholder="e.g., wifi, pool, gym" value={amenities} onChange={e => setAmenities(e.target.value)} required />
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <Button variant="outline" asChild type="button">
                        <Link href="/admin/properties">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending && <Loader2 className="animate-spin" />}
                      {isPending ? "Adding..." : "Add Property"}
                    </Button>
                </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
