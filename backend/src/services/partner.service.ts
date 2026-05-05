import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

interface OnboardHotelInput {
  partnerId: string;
  name: string;
  city: string;
  address: string;
  description: string;
  images: string[];
  amenities: string[];
  rooms: {
    type: string;
    capacity: number;
    basePrice: number;
    totalRooms: number;
    amenities: string[];
  }[];
}

export async function onboardHotel(input: OnboardHotelInput) {
  const { partnerId, rooms, ...hotelData } = input;

  return prisma.hotel.create({
    data: {
      ...hotelData,
      images: JSON.stringify(hotelData.images || []),
      amenities: JSON.stringify(hotelData.amenities || []),
      partnerId,
      status: 'PENDING',
      rooms: {
        create: rooms.map(r => ({ ...r, amenities: JSON.stringify(r.amenities || []) })),
      },
    },
    include: { rooms: true },
  });
}

export async function getPartnerListings(partnerId: string) {
  return prisma.hotel.findMany({
    where: { partnerId },
    include: {
      rooms: {
        select: { id: true, type: true, capacity: true, basePrice: true, totalRooms: true },
      },
      _count: { select: { rooms: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateListing(id: string, partnerId: string, data: Record<string, any>) {
  const hotel = await prisma.hotel.findUnique({ where: { id } });
  if (!hotel) throw new AppError(404, 'Hotel not found');
  if (hotel.partnerId !== partnerId) throw new AppError(403, 'Not your listing');

  const { rooms, partnerId: _pid, images, amenities, ...rest } = data;

  return prisma.hotel.update({
    where: { id },
    data: {
      ...rest,
      ...(images ? { images: JSON.stringify(images) } : {}),
      ...(amenities ? { amenities: JSON.stringify(amenities) } : {}),
    },
    include: { rooms: true },
  });
}

export async function getPartnerBookings(partnerId: string) {
  const hotels = await prisma.hotel.findMany({
    where: { partnerId },
    select: { name: true },
  });

  const hotelNames = hotels.map((h) => h.name);

  return prisma.booking.findMany({
    where: { hotelName: { in: hotelNames } },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      room: { select: { type: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}