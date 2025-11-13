'use client';

import { useState, useEffect, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useFirestore, useFirebase } from "@/firebase";
import { doc, getDoc } from 'firebase/firestore';
import { updateHotel } from "@/firebase/firestore/hotels";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, MapPin, User, Mail, Phone, TrendingUp, Percent, ChevronsUpDown, Upload, X, Image as ImageIcon } from "lucide-react";
import type { hotel as Hotel } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { indianCities } from "@/lib/cities";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import Image from "next/image";
import * as React from "react";

const allAmenities = [
  "wifi", "pool", "gym", "parking", "restaurant", "room service", "air conditioning", "spa"
];

function ImagePreview({ file, onRemove }: { file: File | string, onRemove: () => void }) {
    const [preview, setPreview] = useState<string | null>(null);

    React.useEffect(() => {
        if (typeof file === 'string') {
            setPreview(file);
        } else {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [file]);

    if (!preview) {
        return <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
         <div className="relative group">
            <Image src={preview} alt="Hotel image" width={96} height={96} className="w-24 h-24 object-cover rounded-md" />
             <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100"
                onClick={onRemove}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}

function EditPropertyForm({ hotelId }: { hotelId: string }) {
  const { firestore, storage } = useFirebase() ?? {};
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
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
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);
  
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

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
          setStreetAddress(hotelData.streetAddress || "");
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
          setExistingImageUrls(hotelData.imageUrls || []);
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
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        setNewImageFiles(prev => [...prev, ...files]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore || !storage) {
      toast({
        variant: "destructive",
        title: "Database Error",
        description: "Firestore or Storage is not available.",
      });
      return;
    }
     if (!city) {
      toast({
        variant: "destructive",
        title: "Missing City",
        description: "Please select a city for the property.",
      });
      return;
    }

    const hotelData: Partial<Hotel> = {
      name,
      city,
      streetAddress,
      description,
      price: Number(price),
      rating: Number(rating),
      amenities: selectedAmenities,
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
        await updateHotel(firestore, storage, hotelId, hotelData, newImageFiles, existingImageUrls);
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
                             <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={cityPopoverOpen}
                                        className="w-full justify-between font-normal"
                                    >
                                        {city || "Select city..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search city..." />
                                        <CommandEmpty>No city found.</CommandEmpty>
                                         <CommandList>
                                            <CommandGroup>
                                                {indianCities.map((c) => (
                                                    <CommandItem
                                                        key={c}
                                                        value={c}
                                                        onSelect={(currentValue) => {
                                                            setCity(currentValue === city ? "" : currentValue)
                                                            setCityPopoverOpen(false)
                                                        }}
                                                    >
                                                        {c}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="streetAddress">Street Address</Label>
                            <Input id="streetAddress" placeholder="e.g., 123 Palace Road" value={streetAddress} onChange={e => setStreetAddress(e.target.value)} required />
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
            <CardContent className="pt-6">
                <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2"><ImageIcon className="size-5" /> Property Images</h3>
                 <div className="space-y-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {existingImageUrls.map((url, index) => (
                            <ImagePreview key={index} file={url} onRemove={() => removeExistingImage(index)} />
                        ))}
                         {newImageFiles.map((file, index) => (
                            <ImagePreview key={index + existingImageUrls.length} file={file} onRemove={() => removeNewImage(index)} />
                        ))}
                    </div>
                    <div>
                        <Label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                            </div>
                            <Input id="image-upload" type="file" className="hidden" onChange={handleImageChange} multiple accept="image/png, image/jpeg, image/webp" />
                        </Label>
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
