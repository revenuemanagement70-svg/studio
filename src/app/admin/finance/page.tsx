'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useHotels } from "@/firebase/firestore/use-hotels";
import { Skeleton } from "@/components/ui/skeleton";
import type { hotel as Hotel } from "@/lib/types";

function FinanceTable({ hotels }: { hotels: Hotel[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead className="text-right">Price/Night (₹)</TableHead>
                    <TableHead className="text-right">Tax Rate (%)</TableHead>
                    <TableHead className="text-right">Commission Rate (%)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {hotels.map(hotel => (
                    <TableRow key={hotel.id}>
                        <TableCell>
                            <div className="font-medium font-headline">{hotel.name}</div>
                            <div className="text-xs text-muted-foreground">{hotel.address}</div>
                        </TableCell>
                        <TableCell className="text-right">{hotel.price.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right">{hotel.taxRate?.toFixed(1) ?? 'N/A'}</TableCell>
                        <TableCell className="text-right">{hotel.commissionRate?.toFixed(1) ?? 'N/A'}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function FinanceTableSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center p-4 border-b">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-3 w-64" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-12" />
                </div>
            ))}
        </div>
    );
}


export default function FinancePage() {
    const { hotels, loading, error } = useHotels();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline">Finance Overview</h1>
                <p className="text-muted-foreground">Review financial settings for all your properties.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Property Financials</CardTitle>
                    <CardDescription>A summary of pricing and rate settings for each property.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading && <FinanceTableSkeleton />}
                    {error && <p className="text-destructive text-center py-8">{error}</p>}
                    {!loading && !error && hotels.length > 0 && <FinanceTable hotels={hotels} />}
                     {!loading && !error && hotels.length === 0 && <p className="text-muted-foreground text-center py-8">No properties found.</p>}
                </CardContent>
            </Card>
        </div>
    );
}
