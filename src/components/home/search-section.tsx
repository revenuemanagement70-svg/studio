'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import {
  Building2,
  Home,
  Building,
  MapPin,
  Calendar,
  Users,
  Search,
  Wallet,
  Plane,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';

const searchTabs = [
  { id: 'hotels', label: 'Hotels', icon: <Building2 /> },
  { id: 'homes', label: 'Homes', icon: <Home /> },
  { id: 'corporate', label: 'Corporate', icon: <Building /> },
];

export function SearchSection() {
  const [activeTab, setActiveTab] = useState('hotels');
  const router = useRouter();

  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState('');
  const [budget, setBudget] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (dates?.from) params.set('checkin', format(dates.from, 'yyyy-MM-dd'));
    if (dates?.to) params.set('checkout', format(dates.to, 'yyyy-MM-dd'));
    if (guests) params.set('guests', guests);
    if (budget) params.set('budget', budget);
    if (travelStyle) params.set('travelStyle', travelStyle);

    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="bg-background p-4 sm:p-6 rounded-2xl shadow-2xl max-w-6xl mx-auto" role="region" aria-label="Search hotels">
      <div className="flex gap-2 sm:gap-4 border-b mb-6 pb-4 overflow-x-auto">
        {searchTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-shrink-0 flex items-center gap-2 py-2.5 px-4 rounded-lg font-semibold transition-colors text-muted-foreground hover:text-primary',
              activeTab === tab.id && 'bg-gradient-to-r from-primary to-accent text-white hover:text-white shadow-md'
            )}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {React.cloneElement(tab.icon, { className: 'size-5' })}
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-4">
            <Label htmlFor="destination" className="flex items-center gap-1.5 mb-2 text-sm font-semibold"><MapPin className="size-4" /> Destination</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-primary" />
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where are you going?"
                className="pl-10 h-14 text-base rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-6">
            <div className="col-span-1">
              <Label htmlFor="dates" className="flex items-center gap-1.5 mb-2 text-sm font-semibold"><Calendar className="size-4" /> Check-in & Check-out</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dates"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal h-14 text-base rounded-lg',
                      !dates && 'text-muted-foreground'
                    )}
                  >
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    {dates?.from ? (
                      dates.to ? (
                        <>
                          {format(dates.from, 'LLL dd, y')} - {format(dates.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(dates.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dates?.from}
                    selected={dates}
                    onSelect={setDates}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="col-span-1">
              <Label htmlFor="guests" className="flex items-center gap-1.5 mb-2 text-sm font-semibold"><Users className="size-4" /> Guests</Label>
              <Select onValueChange={setGuests} value={guests}>
                <SelectTrigger id="guests" className="h-14 text-base rounded-lg">
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Guest</SelectItem>
                  <SelectItem value="2">2 Guests</SelectItem>
                  <SelectItem value="3">3 Guests</SelectItem>
                  <SelectItem value="4">4 Guests</SelectItem>
                  <SelectItem value="5">5+ Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <Button type="submit" className="w-full h-14 text-base font-bold rounded-lg bg-gradient-to-r from-primary to-accent">
              <Search className="size-5 mr-2" /> Search
            </Button>
          </div>
        </div>

        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen} className="mt-4">
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget" className="flex items-center gap-1.5 mb-2 text-sm font-semibold"><Wallet className="size-4" /> Budget</Label>
                <Select onValueChange={setBudget} value={budget}>
                  <SelectTrigger id="budget" className="h-14 text-base rounded-lg">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="travelStyle" className="flex items-center gap-1.5 mb-2 text-sm font-semibold"><Plane className="size-4" /> Travel Style</Label>
                <Select onValueChange={setTravelStyle} value={travelStyle}>
                  <SelectTrigger id="travelStyle" className="h-14 text-base rounded-lg">
                    <SelectValue placeholder="Select travel style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="romantic">Romantic</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
          <div className="flex justify-center mt-2">
              <CollapsibleTrigger asChild>
                <Button variant="link" size="sm">
                  <ChevronsUpDown className="size-4 mr-2" />
                  {isAdvancedOpen ? 'Hide' : 'Show'} Advanced Options
                </Button>
              </CollapsibleTrigger>
            </div>
        </Collapsible>
      </form>
    </div>
  );
}
