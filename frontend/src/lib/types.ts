export interface User {
  id: string;
  name: string;
  email: string;
  role: 'GUEST' | 'PARTNER' | 'ADMIN';
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string;
  images: string[];
  amenities: string[];
  rating: number;
  rooms: Room[];
  createdAt: string;
}

export interface Room {
  id: string;
  type: string;
  capacity: number;
  basePrice: number;
  totalRooms: number;
  amenities: string[];
  availability?: RoomAvailability[];
  availableRooms?: number;
  averagePrice?: number;
}

export interface RoomAvailability {
  id: string;
  date: string;
  price: number;
  roomsAvailable: number;
}

export interface Booking {
  id: string;
  bookingRef: string;
  hotelName: string;
  checkin: string;
  checkout: string;
  guests: number;
  totalPrice: number;
  taxes: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  room: Room & { hotel: { id: string; name: string; city: string; images: string[] } };
}

export interface SearchResult {
  hotels: Hotel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
