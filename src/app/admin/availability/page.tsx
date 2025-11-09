'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHotels } from "@/firebase/firestore/use-hotels";
import type { hotel as Hotel, RoomAvailability } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { addDays, format } from 'date-fns';
import { setAvailabilityForDateRange, getAvailabilityForHotel } from '@/firebase/firestore/availability';
import { Loader2 } from 'lucide-react';

function AvailabilityCalendar({ hotel }: { hotel: Hotel }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
    const [price, setPrice] = useState('');
    const [rooms, setRooms] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [availability, setAvailability] = useState<RoomAvailability[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!firestore) return;
        setLoading(true);
        getAvailabilityForHotel(firestore, hotel.id).then(data => {
            setAvailability(data);
            setLoading(false);
        });
    }, [firestore, hotel.id]);

    const handleDateSelect = (range: DateRange | undefined) => {
        if (range?.from && range.to) {
            setSelectedDates(range);
            setIsDialogOpen(true);
        } else {
             setSelectedDates(range);
        }
    };

    const handleSave = async () => {
        if (!firestore || !selectedDates?.from || !selectedDates?.to || !price || !rooms) {
            toast({ variant: 'destructive', title: 'Missing Information' });
            return;
        }

        setIsSaving(true);
        try {
            await setAvailabilityForDateRange(firestore, hotel.id, selectedDates.from, selectedDates.to, Number(price), Number(rooms));
            toast({ title: 'Availability Updated' });
            
            // Refetch availability
            const data = await getAvailabilityForHotel(firestore, hotel.id);
            setAvailability(data);

        } catch (error) {
            toast({ variant: 'destructive', title: 'Error saving availability' });
        } finally {
            setIsSaving(false);
            setIsDialogOpen(false);
            setPrice('');
            setRooms('');
            setSelectedDates(undefined);
        }
    };
    
    const modifiers = {
        available: availability.map(a => new Date(a.date))
    };

    const modifiersStyles = {
        available: {
            color: 'hsl(var(--primary))',
            fontWeight: 'bold',
            border: '2px solid hsl(var(--primary))'
        }
    };

    const footer = selectedDates?.from && selectedDates?.to ? (
        <p className="p-4 bg-muted text-center text-sm">You have selected {format(selectedDates.from, "PPP")} to {format(selectedDates.to, "PPP")}.</p>
    ) : selectedDates?.from ? (
         <p className="p-4 bg-muted text-center text-sm">Please select an end date.</p>
    ) : <p className="p-4 bg-muted text-center text-sm">Please pick the first day.</p>
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Availability for {hotel.name}</CardTitle>
                <CardDescription>Select a date or a date range to set pricing and room count. Dates with configured availability are marked in color.</CardDescription>
            </CardHeader>
            <CardContent>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                     <Calendar
                        mode="range"
                        selected={selectedDates}
                        onSelect={handleDateSelect}
                        className="rounded-md border"
                        numberOfMonths={2}
                        disabled={{ before: new Date() }}
                        modifiers={modifiers}
                        modifiersStyles={modifiersStyles}
                        footer={footer}
                    />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Set Price and Availability</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price per night (₹)</Label>
                                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rooms">Number of Available Rooms</Label>
                                <Input id="rooms" type="number" value={rooms} onChange={(e) => setRooms(e.target.value)} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving && <Loader2 className="animate-spin" />}
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}

export default function AvailabilityPage() {
    const { hotels, loading: hotelsLoading } = useHotels();
    const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

    const selectedHotel = hotels.find(h => h.id === selectedHotelId) || null;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline">Availability & Pricing</h1>
                <p className="text-muted-foreground">Manage room availability and set dynamic pricing for your properties.</p>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Select a Property</CardTitle>
                    <CardDescription>Choose a hotel from the list to manage its calendar.</CardDescription>
                </CardHeader>
                <CardContent>
                    {hotelsLoading ? (
                        <p>Loading hotels...</p>
                    ) : (
                        <Select onValueChange={(value) => setSelectedHotelId(value)}>
                            <SelectTrigger className="w-full md:w-1/2">
                                <SelectValue placeholder="Select a hotel..." />
                            </SelectTrigger>
                            <SelectContent>
                                {hotels.map(hotel => (
                                    <SelectItem key={hotel.id} value={hotel.id}>{hotel.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </CardContent>
            </Card>

            {selectedHotel ? (
                <AvailabilityCalendar hotel={selectedHotel} />
            ) : (
                <div className="text-center text-muted-foreground py-16 border-dashed border-2 rounded-lg">
                    <p>Please select a hotel to view its availability calendar.</p>
                </div>
            )}
        </div>
    );
}