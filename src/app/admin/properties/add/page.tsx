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
import { Loader2, MapPin, User, Mail, Phone, TrendingUp, Percent, ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { indianCities } from "@/lib/cities";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const allAmenities = [
  "wifi", "pool", "gym", "parking", "restaurant", "room service", "air conditioning", "spa"
];

export default function AddPropertyPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        title: "Missing City",
        description: "Please select a city for the property.",
      });
      return;
    }

    const hotelData = {
      name,
      city,
      streetAddress,
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

    startTransition(() => {
      addHotel(firestore, hotelData)
        .then(() => {
            toast({
              title: "Property Added!",
              description: `${name} has been successfully added to your inventory.`,
            });
            router.push("/admin/properties");
        })
        .catch((error) => {
            // The contextual error is now emitted by addHotel.
            // The FirebaseErrorListener will show the detailed error in the console.
            // We show a generic toast to the user.
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "Could not add property. See console for details.",
            });
        });
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
                {isPending ? "Adding..." : "Add Property"}
            </Button>
        </div>
    </form>
    </div>
  );
}
