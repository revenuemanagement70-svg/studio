'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function PropertiesPage() {
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
          <p className="text-muted-foreground">Property listings will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
