import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import crypto from 'crypto';

const router = Router();
const prisma = new PrismaClient();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';

// POST /api/payments/create-order
router.post('/create-order', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId, checkin, checkout, guests, guestName, guestEmail, guestPhone } = req.body;
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError(401, 'Not authenticated');
    if (!roomId || !checkin || !checkout) throw new AppError(400, 'Missing required fields');

    const room = await prisma.room.findUnique({ where: { id: roomId }, include: { hotel: { select: { id: true, name: true, city: true, partnerId: true, commission: true } } } });
    if (!room) throw new AppError(404, 'Room not found');

    const nights = Math.max(1, Math.ceil((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000));
    const subtotal = room.basePrice * nights;
    const taxes = Math.round(subtotal * 0.18);
    const totalPrice = subtotal + taxes;
    const amountInPaise = totalPrice * 100;

    // Create booking in PENDING status
    const bookingRef = 'STY-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const booking = await prisma.booking.create({
      data: {
        bookingRef,
        userId,
        hotelId: room.hotel.id,
        roomId: room.id,
        checkin: new Date(checkin),
        checkout: new Date(checkout),
        guests: guests || 2,
        guestName: guestName || 'Guest',
        guestEmail: guestEmail || '',
        guestPhone: guestPhone || '',
        totalPrice,
        platformFee: Math.round(totalPrice * (room.hotel.commission / 100)),
        hotelPayout: totalPrice - Math.round(totalPrice * (room.hotel.commission / 100)),
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
    });

    // In production, you'd create a real Razorpay order here using their API
    // For now, we create a mock order ID
    const orderId = 'order_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

    res.json({
      status: 'success',
      data: {
        orderId,
        bookingId: booking.id,
        bookingRef: booking.bookingRef,
        amount: amountInPaise,
        currency: 'INR',
        hotelName: room.hotel.name,
        description: `${room.type} at ${room.hotel.name} - ${nights} night(s)`,
        prefill: { name: guestName, email: guestEmail, contact: guestPhone },
        key: RAZORPAY_KEY_ID,
      },
    });
  } catch (err) { next(err); }
});

// POST /api/payments/verify
router.post('/verify', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    if (!bookingId) throw new AppError(400, 'Missing bookingId');

    // In production, verify signature:
    // const generated_signature = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex');
    // if (generated_signature !== razorpay_signature) throw new AppError(400, 'Payment verification failed');

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentId: razorpay_payment_id || 'pay_' + Date.now().toString(36),
      },
    });

    res.json({
      status: 'success',
      data: {
        bookingRef: booking.bookingRef,
        hotelName: (await prisma.hotel.findUnique({ where: { id: booking.hotelId }, select: { name: true } }))?.name,
        checkin: booking.checkin,
        checkout: booking.checkout,
        totalPrice: booking.totalPrice,
        status: booking.status,
      },
    });
  } catch (err) { next(err); }
});

// POST /api/payments/pay-at-hotel (skip payment, confirm directly)
router.post('/pay-at-hotel', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId, checkin, checkout, guests, guestName, guestEmail, guestPhone } = req.body;
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError(401, 'Not authenticated');
    if (!roomId || !checkin || !checkout) throw new AppError(400, 'Missing required fields');

    const room = await prisma.room.findUnique({ where: { id: roomId }, include: { hotel: { select: { id: true, name: true, commission: true } } } });
    if (!room) throw new AppError(404, 'Room not found');

    const nights = Math.max(1, Math.ceil((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000));
    const subtotal = room.basePrice * nights;
    const taxes = Math.round(subtotal * 0.18);
    const totalPrice = subtotal + taxes;

    const bookingRef = 'STY-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const booking = await prisma.booking.create({
      data: {
        bookingRef, userId, hotelId: room.hotel.id, roomId: room.id,
        checkin: new Date(checkin), checkout: new Date(checkout),
        guests: guests || 2, guestName: guestName || 'Guest',
        guestEmail: guestEmail || '', guestPhone: guestPhone || '',
        totalPrice,
        platformFee: Math.round(totalPrice * (room.hotel.commission / 100)),
        hotelPayout: totalPrice - Math.round(totalPrice * (room.hotel.commission / 100)),
        status: 'CONFIRMED', paymentStatus: 'PAY_AT_HOTEL',
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        bookingRef: booking.bookingRef,
        hotelName: room.hotel.name,
        checkin: booking.checkin,
        checkout: booking.checkout,
        totalPrice: booking.totalPrice,
        status: booking.status,
      },
    });
  } catch (err) { next(err); }
});

export default router;