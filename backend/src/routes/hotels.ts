import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import * as hotelService from '../services/hotel.service';

const router = Router();

const searchSchema = z.object({
  query: z.object({
    city: z.string().optional(),
    checkin: z.string().optional(),
    checkout: z.string().optional(),
    guests: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    amenities: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

// GET /api/hotels/search
router.get('/search', validate(searchSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city, guests, amenities, page, limit } = req.query;
    const result = await hotelService.searchHotels({
      city: city as string,
      guests: guests ? parseInt(guests as string) : undefined,
      amenities: amenities ? (amenities as string).split(',') : undefined,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 12,
    });
    res.json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
});

// GET /api/hotels/featured
router.get('/featured', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const hotels = await hotelService.getFeaturedHotels();
    res.json({ status: 'success', data: { hotels } });
  } catch (err) {
    next(err);
  }
});

// GET /api/hotels/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotel = await hotelService.getHotelById(req.params.id);
    res.json({ status: 'success', data: { hotel } });
  } catch (err) {
    next(err);
  }
});

// GET /api/hotels/:id/availability
router.get('/:id/availability', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { checkin, checkout } = req.query;
    if (!checkin || !checkout) {
      res.status(400).json({ status: 'error', message: 'checkin and checkout required' });
      return;
    }
    const result = await hotelService.getHotelAvailability(
      req.params.id,
      new Date(checkin as string),
      new Date(checkout as string)
    );
    res.json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
