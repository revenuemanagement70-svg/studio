'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AddPropertyPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Add New Property</h1>
        <p className="text-muted-foreground">Fill in the details below to add a new hotel to your inventory.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
            <form className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Property Name</Label>
                    <Input id="name" placeholder="e.g., The Grand Heritage" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="e.g., 123 Palace Road, Jaipur, Rajasthan" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="A short description of the property." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="price">Price per night (₹)</Label>
                        <Input id="price" type="number" placeholder="e.g., 7500" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="rating">Rating (1-5)</Label>
                        <Input id="rating" type="number" step="0.1" min="1" max="5" placeholder="e.g., 4.8" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                        <Input id="amenities" placeholder="e.g., wifi, pool, gym" />
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/admin/properties">Cancel</Link>
                    </Button>
                    <Button type="submit">Add Property</Button>
                </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
