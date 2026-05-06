import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

function parseJsonArray(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return []; }
  }
  return [];
}

interface SearchParams {
  city?: string;
  checkin?: string;
  checkout?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  sort?: string;
  propertyType?: string;
  starRating?: number;
  page?: number;
  limit?: number;
}

export async function searchHotels(params: SearchParams) {
  const { city, guests, sort, propertyType, starRating, page = 1, limit = 12 } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.HotelWhereInput = { status: 'ACTIVE' };
  if (city) where.city = { contains: city, mode: 'insensitive' };
  if (guests) where.rooms = { some: { capacity: { gte: guests } } };
  if (propertyType) where.propertyType = propertyType;
  if (starRating) where.starRating = { gte: starRating };

  let orderBy: any = { rating: 'desc' };
  if (sort === 'price_asc') orderBy = { rooms: { _count: 'asc' } };
  if (sort === 'price_desc') orderBy = { rooms: { _count: 'desc' } };
  if (sort === 'name') orderBy = { name: 'asc' };

  const [hotels, total] = await Promise.all([
    prisma.hotel.findMany({
      where,
      include: {
        rooms: { select: { id: true, type: true, capacity: true, basePrice: true, totalRooms: true, amenities: true } },
        _count: { select: { reviews: true } },
      },
      skip, take: limit, orderBy,
    }),
    prisma.hotel.count({ where }),
  ]);

  const parsed = hotels.map(h => ({
    ...h,
    images: parseJsonArray(h.images),
    amenities: parseJsonArray(h.amenities),
    rooms: h.rooms.map(r => ({ ...r, amenities: parseJsonArray(r.amenities) })),
  }));

  return { hotels: parsed, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getHotelById(id: string) {
  const hotel = await prisma.hotel.findUnique({
    where: { id },
    include: {
      rooms: { include: { availability: { where: { date: { gte: new Date() } }, orderBy: { date: 'asc' }, take: 60 } } },
      reviews: { include: { user: { select: { id: true, name: true, avatar: true } } }, orderBy: { createdAt: 'desc' }, take: 20 },
      partner: { select: { name: true } },
    },
  });
  if (!hotel) throw new AppError(404, 'Hotel not found');
  return {
    ...hotel,
    images: parseJsonArray(hotel.images),
    amenities: parseJsonArray(hotel.amenities),
    policies: (() => { try { return JSON.parse(hotel.policies); } catch { return {}; } })(),
    rooms: hotel.rooms.map(r => ({ ...r, amenities: parseJsonArray(r.amenities), images: parseJsonArray((r as any).images || '[]') })),
  };
}

export async function getHotelAvailability(id: string, checkin: Date, checkout: Date) {
  const hotel = await prisma.hotel.findUnique({
    where: { id },
    include: { rooms: { include: { availability: { where: { date: { gte: checkin, lt: checkout } }, orderBy: { date: 'asc' } } } } },
  });
  if (!hotel) throw new AppError(404, 'Hotel not found');
  const roomsWithAvailability = hotel.rooms.map((room) => {
    const minAvailable = room.availability.length > 0 ? Math.min(...room.availability.map((a) => a.roomsAvailable)) : room.totalRooms;
    const avgPrice = room.availability.length > 0 ? room.availability.reduce((sum, a) => sum + a.price, 0) / room.availability.length : room.basePrice;
    return { ...room, availableRooms: minAvailable, averagePrice: Math.round(avgPrice * 100) / 100 };
  });
  return { hotel: { id: hotel.id, name: hotel.name, city: hotel.city }, rooms: roomsWithAvailability };
}

export async function getFeaturedHotels() {
  const featured = await prisma.hotel.findMany({
    where: { status: 'ACTIVE', isFeatured: true },
    include: {
      rooms: { select: { basePrice: true, amenities: true }, take: 1, orderBy: { basePrice: 'asc' } },
      _count: { select: { reviews: true } },
    },
    take: 8,
    orderBy: { rating: 'desc' },
  });
  return featured.map(h => ({
    ...h,
    images: parseJsonArray(h.images),
    amenities: parseJsonArray(h.amenities),
    rooms: h.rooms.map((r: any) => ({ ...r, amenities: parseJsonArray(r.amenities) })),
  }));
}