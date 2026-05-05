import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/reviews/:hotelId - Get reviews for a hotel
router.get('/:hotelId', async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId as string;
    const reviews = await prisma.review.findMany({
      where: { hotelId },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: reviews });
  } catch (err) {
    next(err);
  }
});

// POST /api/reviews - Create a review (authenticated)
router.post('/', authenticate, async (req: any, res, next) => {
  try {
    const { hotelId, rating, title, comment } = req.body;
    const userId = req.user.id;

    // Check if user already reviewed this hotel
    const existing = await prisma.review.findUnique({
      where: { userId_hotelId: { userId, hotelId } },
    });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this hotel' });
    }

    const review = await prisma.review.create({
      data: { userId, hotelId, rating, title, comment },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    // Update hotel average rating
    const reviews = await prisma.review.findMany({ where: { hotelId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await prisma.hotel.update({ where: { id: hotelId }, data: { rating: Math.round(avgRating * 10) / 10 } });

    res.status(201).json({ data: review });
  } catch (err) {
    next(err);
  }
});

export default router;