import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/cities - Get all cities
router.get('/', async (_req, res, next) => {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { hotelCount: 'desc' },
    });
    res.json({ data: cities });
  } catch (err) {
    next(err);
  }
});

// GET /api/cities/popular - Get popular cities
router.get('/popular', async (_req, res, next) => {
  try {
    const cities = await prisma.city.findMany({
      where: { isPopular: true },
      orderBy: { hotelCount: 'desc' },
    });
    res.json({ data: cities });
  } catch (err) {
    next(err);
  }
});

export default router;