'use client';

import { useState, useEffect, useTransition, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useFirestore } from "@/firebase";
import { doc, getDoc } from 'firebase/firestore';
import { updateHotel } from "@/firebase/firestore/hotels";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import type { hotel as Hotel } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

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

function EditPropertyForm({ hotelId }: { hotelId: string }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [amenities, setAmenities] = useState("");
  const [imageUrls, setImageUrls] = useState("");

  const parsedUrls = useMemo(() => {
    return imageUrls.split('\n').map(url => url.trim()).filter(url => url.length > 0 && (url.startsWith('http') || url.startsWith('https')));
  }, [imageUrls]);

  useEffect(() => {
    if (!firestore || !hotelId) return;

    const fetchHotel = async () => {
      setLoading(true);
      try {
        const hotelRef = doc(firestore, "hotels", hotelId);
        const hotelSnap = await getDoc(hotelRef);

        if (hotelSnap.exists()) {
          const hotelData = hotelSnap.data() as Omit<Hotel, 'id'>;
          setName(hotelData.name);
          setAddress(hotelData.address);
          setDescription(hotelData.description);
          setPrice(String(hotelData.price));
          setRating(String(hotelData.rating));
          setAmenities(hotelData.amenities.join(', '));
          setImageUrls((hotelData.imageUrls || []).join('\n'));
        } else {
          toast({
            variant: "destructive",
            title: "Not Found",
            description: "Could not find the property to edit.",
          });
          router.push('/admin/properties');
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching property",
          description: error instanceof Error ? error.message : "An unknown error occurred.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [firestore, hotelId, router, toast]);

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

    const hotelData: Partial<Hotel> = {
      name,
      address,
      description,
      price: Number(price),
      rating: Number(rating),
      amenities: amenities.split(',').map(a => a.trim()),
      imageUrls: parsedUrls,
    };
    
    if (hotelData.imageUrls?.length === 0) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please provide at least one valid image URL.",
        });
        return;
    }

    startTransition(async () => {
      try {
        await updateHotel(firestore, hotelId, hotelData);
        toast({
          title: "Property Updated!",
          description: `${name} has been successfully updated.`,
        });
        router.push("/admin/properties");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error instanceof Error ? error.message : "Could not update property.",
        });
      }
    });
  };
  
  if (loading) {
    return <EditPropertyFormSkeleton />;
  }

  return (
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
                {isPending ? "Saving..." : "Save Changes"}
            </Button>
        </div>
    </form>
  )
}

function EditPropertyFormSkeleton() {
    return (
        <div className="space-y-8">
            <Card>
                <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="aspect-square rounded-lg" />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="flex justify-end gap-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
}

export default function EditPropertyPage() {
  const params = useParams();
  const hotelId = Array.isArray(params.hotelId) ? params.hotelId[0] : params.hotelId;

  return (
    <div>
      <div className="mb-8">
        <Button asChild variant="link" className="p-0 h-auto inline-flex items-center gap-2 text-primary font-bold mb-4 hover:underline">
            <Link href="/admin/properties">
            <ArrowLeft className="size-4" />
            Back to Properties
            </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Edit Property</h1>
        <p className="text-muted-foreground">Update the details for this hotel listing.</p>
      </div>
      
      {hotelId ? <EditPropertyForm hotelId={hotelId} /> : <p className="text-destructive">Hotel ID is missing.</p>}
    </div>
  );
}
