import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import * as bookingService from '../services/booking.service';

const router = Router();

const createBookingSchema = z.object({
  body: z.object({
    roomId: z.string().uuid(),
    checkin: z.string(),
    checkout: z.string(),
    guests: z.number().int().positive(),
  }),
});

// POST /api/bookings
router.post('/', authenticate, validate(createBookingSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.createBooking({
      userId: req.user!.id,
      roomId: req.body.roomId,
      checkin: new Date(req.body.checkin),
      checkout: new Date(req.body.checkout),
      guests: req.body.guests,
    });
    res.status(201).json({ status: 'success', data: { booking } });
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/my
router.get('/my', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user!.id);
    res.json({ status: 'success', data: { bookings } });
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    res.json({ status: 'success', data: { booking } });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user!.id);
    res.json({ status: 'success', data: { booking } });
  } catch (err) {
    next(err);
  }
});

export default router;
