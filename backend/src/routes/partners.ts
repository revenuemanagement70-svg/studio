import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { authenticate, requireRole } from '../middleware/auth';
import * as partnerService from '../services/partner.service';

const router = Router();

const onboardSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    city: z.string().min(2),
    address: z.string().min(5),
    description: z.string().min(10),
    images: z.array(z.string()).min(1),
    amenities: z.array(z.string()),
    rooms: z.array(
      z.object({
        type: z.string(),
        capacity: z.number().int().positive(),
        basePrice: z.number().positive(),
        totalRooms: z.number().int().positive(),
        amenities: z.array(z.string()),
      })
    ).min(1),
  }),
});

// POST /api/partners/onboard
router.post(
  '/onboard',
  authenticate,
  requireRole('PARTNER', 'ADMIN'),
  validate(onboardSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hotel = await partnerService.onboardHotel({
        partnerId: req.user!.id,
        ...req.body,
      });
      res.status(201).json({ status: 'success', data: { hotel } });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/partners/listings
router.get(
  '/listings',
  authenticate,
  requireRole('PARTNER', 'ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const listings = await partnerService.getPartnerListings(req.user!.id);
      res.json({ status: 'success', data: { listings } });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/partners/listings/:id
router.put(
  '/listings/:id',
  authenticate,
  requireRole('PARTNER', 'ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hotel = await partnerService.updateListing(req.params.id, req.user!.id, req.body);
      res.json({ status: 'success', data: { hotel } });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/partners/bookings
router.get(
  '/bookings',
  authenticate,
  requireRole('PARTNER', 'ADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookings = await partnerService.getPartnerBookings(req.user!.id);
      res.json({ status: 'success', data: { bookings } });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
