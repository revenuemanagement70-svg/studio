

export type hotel = {
    id: string;
    name: string;
    address: string;
    price: number;
    rating: number;
    amenities: string[];
    description: string;
    imageUrls: string[];
    latitude?: number;
    longitude?: number;
    managerName?: string;
    contactEmail?: string;
    contactPhone?: string;
};

export type booking = {
    id: string;
    bookingId: string;
    hotelId: string;
    hotelName: string;
    userId: string;
    userName: string;
    userEmail: string;
    checkin: string;
    checkout: string;
    guests: number;
    totalPrice: number;
    bookedAt: any;
};

export type RoomAvailability = {
    id: string;
    date: string; // YYYY-MM-DD
    price: number;
    roomsAvailable: number;
};
