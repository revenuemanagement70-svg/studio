'use client';

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useFirestore } from "@/firebase";
import { addHotel } from "@/firebase/firestore/hotels";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const allAmenities = [
  "wifi", "pool", "gym", "parking", "restaurant", "room service", "air conditioning", "spa"
];

function ImagePreviews({ urls }: { urls: string[] }) {
    if (urls.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8 border-dashed border-2 rounded-lg">
                <ImageIcon className="mx-auto size-8 mb-2" />
                <p>Image previews will appear here.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {urls.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                    <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>
            ))}
        </div>
    );
}

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
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState("");

  const parsedUrls = useMemo(() => {
    return imageUrls.split('\n').map(url => url.trim()).filter(url => url.length > 0 && (url.startsWith('http') || url.startsWith('https')));
  }, [imageUrls]);

  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

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
      amenities: selectedAmenities,
      imageUrls: parsedUrls,
    };

    if (hotelData.imageUrls.length === 0) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please provide at least one valid image URL.",
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

      <form className="space-y-8" onSubmit={handleSubmit}>
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price per night (₹)</Label>
                            <Input id="price" type="number" placeholder="e.g., 7500" value={price} onChange={e => setPrice(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rating">Rating (1-5)</Label>
                            <Input id="rating" type="number" step="0.1" min="1" max="5" placeholder="e.g., 4.8" value={rating} onChange={e => setRating(e.target.value)} required />
                        </div>
                    </div>
                     <div className="space-y-4">
                        <Label>Amenities & Facilities</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 rounded-lg border p-4">
                            {allAmenities.map((amenity) => (
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
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="imageUrls">Image URLs (one per line)</Label>
                    <Textarea id="imageUrls" placeholder="https://example.com/image1.jpg&#x000A;https://example.com/image2.jpg" value={imageUrls} onChange={e => setImageUrls(e.target.value)} required rows={4} />
                </div>
                <div className="space-y-2">
                    <Label>Image Previews</Label>
                    <ImagePreviews urls={parsedUrls} />
                </div>
            </CardContent>
        </Card>

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
    </div>
  );
}
