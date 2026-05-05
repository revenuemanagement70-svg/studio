import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/offers - Get active offers
router.get('/', async (_req, res, next) => {
  try {
    const now = new Date();
    const offers = await prisma.offer.findMany({
      where: {
        isActive: true,
        validFrom: { lte: now },
        validTill: { gte: now },
      },
      orderBy: { discount: 'desc' },
    });
    res.json({ data: offers });
  } catch (err) {
    next(err);
  }
});

// POST /api/offers/validate - Validate a coupon code
router.post('/validate', async (req, res, next) => {
  try {
    const { code, amount } = req.body;
    const now = new Date();
    const offer = await prisma.offer.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        validFrom: { lte: now },
        validTill: { gte: now },
      },
    });
    if (!offer) {
      return res.status(400).json({ message: 'Invalid or expired coupon code' });
    }
    if (offer.minBooking && amount < offer.minBooking) {
      return res.status(400).json({ message: 'Minimum booking amount is Rs.' + offer.minBooking });
    }
    if (offer.usageLimit && offer.usedCount >= offer.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }
    let discountAmount = (amount * offer.discount) / 100;
    if (offer.maxDiscount && discountAmount > offer.maxDiscount) {
      discountAmount = offer.maxDiscount;
    }
    res.json({ data: { offer, discountAmount } });
  } catch (err) {
    next(err);
  }
});

export default router;