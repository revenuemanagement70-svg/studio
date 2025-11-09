'use client';

import { useState, useEffect, useTransition, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Loader2, ArrowLeft, MapPin, User, Mail, Phone, TrendingUp, Percent } from "lucide-react";
import type { hotel as Hotel } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const allAmenities = [
  "wifi", "pool", "gym", "parking", "restaurant", "room service", "air conditioning", "spa"
];

const allowedCities = ["Delhi", "Mumbai", "Goa", "Jaipur"];

function EditPropertyForm({ hotelId }: { hotelId: string }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [managerName, setManagerName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [commissionRate, setCommissionRate] = useState("");

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
          setCity(hotelData.city || "");
          setAddress(hotelData.address);
          setDescription(hotelData.description);
          setPrice(String(hotelData.price));
          setRating(String(hotelData.rating));
          setSelectedAmenities(hotelData.amenities || []);
          setLatitude(String(hotelData.latitude || ""));
          setLongitude(String(hotelData.longitude || ""));
          setManagerName(hotelData.managerName || "");
          setContactEmail(hotelData.contactEmail || "");
          setContactPhone(hotelData.contactPhone || "");
          setTaxRate(String(hotelData.taxRate || ""));
          setCommissionRate(String(hotelData.commissionRate || ""));
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
     if (!city) {
      toast({
        variant: "destructive",
        title: "City is required",
        description: "Please select a city for the property.",
      });
      return;
    }

    const hotelData: Partial<Hotel> = {
      name,
      city,
      address,
      description,
      price: Number(price),
      rating: Number(rating),
      amenities: selectedAmenities,
      imageUrls: [`https://picsum.photos/seed/${name.replace(/\s+/g, '-')}/1200/800`],
      latitude: Number(latitude),
      longitude: Number(longitude),
      managerName,
      contactEmail,
      contactPhone,
      taxRate: Number(taxRate) || 0,
      commissionRate: Number(commissionRate) || 0,
    };

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
                <h3 className="font-headline font-bold text-lg mb-4">Basic Information</h3>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Property Name</Label>
                        <Input id="name" placeholder="e.g., The Grand Heritage" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Select onValueChange={setCity} value={city}>
                                <SelectTrigger id="city">
                                    <SelectValue placeholder="Select a city" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allowedCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Street Address</Label>
                            <Input id="address" placeholder="e.g., 123 Palace Road" value={address} onChange={e => setAddress(e.target.value)} required />
                        </div>
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
            <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2"><User className="size-5" /> Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="managerName">Manager Name</Label>
                    <Input id="managerName" placeholder="e.g., Ramesh Kumar" value={managerName} onChange={e => setManagerName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input id="contactPhone" type="tel" placeholder="e.g., 9876543210" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input id="contactEmail" type="email" placeholder="e.g., contact@grandheritage.com" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
                </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 space-y-6">
            <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2"><TrendingUp className="size-5"/> Financials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="taxRate" className="flex items-center gap-1.5">Tax Rate <Percent className="size-3.5" /></Label>
                    <Input id="taxRate" type="number" step="0.1" min="0" max="100" placeholder="e.g., 18" value={taxRate} onChange={e => setTaxRate(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="commissionRate" className="flex items-center gap-1.5">Commission Rate <Percent className="size-3.5" /></Label>
                    <Input id="commissionRate" type="number" step="0.1" min="0" max="100" placeholder="e.g., 10" value={commissionRate} onChange={e => setCommissionRate(e.target.value)} />
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2"><MapPin className="size-5"/> Location Coordinates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" type="number" step="any" placeholder="e.g., 26.9124" value={latitude} onChange={e => setLatitude(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" type="number" step="any" placeholder="e.g., 75.7873" value={longitude} onChange={e => setLongitude(e.target.value)} required />
                </div>
            </div>
            <p className="text-xs text-muted-foreground pt-1">You can get these from Google Maps by right-clicking on a location.</p>
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
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                     <div className="space-y-4">
                        <Skeleton className="h-4 w-32" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 rounded-lg border p-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Skeleton className="h-5 w-5" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6 space-y-6">
                    <Skeleton className="h-6 w-48 mb-4" />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-24" />
                           <Skeleton className="h-10 w-full" />
                       </div>
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-24" />
                           <Skeleton className="h-10 w-full" />
                       </div>
                       <div className="space-y-2 md:col-span-2">
                           <Skeleton className="h-4 w-24" />
                           <Skeleton className="h-10 w-full" />
                       </div>
                   </div>
                </CardContent>
            </Card>

             <Card>
                <CardContent className="pt-6 space-y-6">
                     <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                             <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
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
