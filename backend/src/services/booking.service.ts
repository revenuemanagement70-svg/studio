import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { generateBookingRef } from '../utils/booking-ref';
import { calculateTax } from '../utils/pricing';

const prisma = new PrismaClient();

interface CreateBookingInput {
  userId: string;
  roomId: string;
  checkin: Date;
  checkout: Date;
  guests: number;
}

export async function createBooking(input: CreateBookingInput) {
  const { userId, roomId, checkin, checkout, guests } = input;

  const nights = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24));
  if (nights <= 0) throw new AppError(400, 'Checkout must be after checkin');

  return prisma.$transaction(async (tx) => {
    const room = await tx.room.findUnique({
      where: { id: roomId },
      include: {
        hotel: { select: { id: true, name: true } },
        availability: {
          where: { date: { gte: checkin, lt: checkout } },
        },
      },
    });

    if (!room) throw new AppError(404, 'Room not found');
    if (room.capacity < guests) throw new AppError(400, `Room capacity is ${room.capacity} guests`);

    const dates: Date[] = [];
    for (let d = new Date(checkin); d < checkout; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    let totalPrice = 0;

    for (const date of dates) {
      const avail = room.availability.find(
        (a) => a.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
      );

      if (avail) {
        if (avail.roomsAvailable <= 0) {
          throw new AppError(409, `No rooms available for ${date.toISOString().split('T')[0]}`);
        }
        totalPrice += avail.price;
        await tx.roomAvailability.update({
          where: { id: avail.id },
          data: { roomsAvailable: { decrement: 1 } },
        });
      } else {
        totalPrice += room.basePrice;
        await tx.roomAvailability.create({
          data: {
            roomId: room.id,
            date,
            price: room.basePrice,
            roomsAvailable: room.totalRooms - 1,
          },
        });
      }
    }

    const taxes = calculateTax(totalPrice);

    const booking = await tx.booking.create({
      data: {
        bookingRef: generateBookingRef(),
        userId,
        roomId: room.id,
        hotelId: room.hotel.id,
        hotelName: room.hotel.name,
        checkin,
        checkout,
        guests,
        totalPrice,
        taxes,
        status: 'CONFIRMED',
      },
    });

    return booking;
  });
}

export async function getBookingById(id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      room: { include: { hotel: { select: { id: true, name: true, city: true, images: true } } } },
    },
  });
  if (!booking) throw new AppError(404, 'Booking not found');
  return booking;
}

export async function getUserBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      room: { include: { hotel: { select: { id: true, name: true, city: true, images: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function cancelBooking(id: string, userId: string) {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new AppError(404, 'Booking not found');
  if (booking.userId !== userId) throw new AppError(403, 'Not your booking');
  if (booking.status === 'CANCELLED') throw new AppError(400, 'Already cancelled');
  if (booking.status === 'COMPLETED') throw new AppError(400, 'Cannot cancel completed booking');

  return prisma.$transaction(async (tx) => {
    const dates: Date[] = [];
    for (let d = new Date(booking.checkin); d < booking.checkout; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    for (const date of dates) {
      await tx.roomAvailability.updateMany({
        where: {
          roomId: booking.roomId,
          date: {
            gte: new Date(date.toISOString().split('T')[0]),
            lt: new Date(new Date(date).setDate(date.getDate() + 1)),
          },
        },
        data: { roomsAvailable: { increment: 1 } },
      });
    }

    return tx.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  });
}
