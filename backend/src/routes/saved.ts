import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// GET /api/saved - list saved hotels
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError(401, 'Not authenticated');
    const saved = await prisma.savedHotel.findMany({
      where: { userId },
      include: { hotel: { select: { id: true, name: true, city: true, rating: true, images: true, starRating: true, propertyType: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ status: 'success', data: saved });
  } catch (err) { next(err); }
});

// POST /api/saved/:hotelId - save a hotel
router.post('/:hotelId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError(401, 'Not authenticated');
    const hotelId = req.params.hotelId as string;
    const existing = await prisma.savedHotel.findUnique({ where: { userId_hotelId: { userId, hotelId } } });
    if (existing) { res.json({ status: 'success', message: 'Already saved' }); return; }
    await prisma.savedHotel.create({ data: { userId, hotelId } });
    res.status(201).json({ status: 'success', message: 'Hotel saved' });
  } catch (err) { next(err); }
});

// DELETE /api/saved/:hotelId - unsave a hotel
router.delete('/:hotelId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) throw new AppError(401, 'Not authenticated');
    const hotelId = req.params.hotelId as string;
    await prisma.savedHotel.deleteMany({ where: { userId, hotelId } });
    res.json({ status: 'success', message: 'Hotel removed from saved' });
  } catch (err) { next(err); }
});

export default router;