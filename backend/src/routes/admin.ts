import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// All admin routes require ADMIN role
router.use(authenticate);
router.use(requireRole('ADMIN'));

// GET /api/admin/dashboard - Platform-wide stats
router.get('/dashboard', async (_req, res, next) => {
  try {
    const [totalHotels, totalUsers, totalBookings, pendingHotels] = await Promise.all([
      prisma.hotel.count(),
      prisma.user.count(),
      prisma.booking.count(),
      prisma.hotel.count({ where: { status: 'PENDING' } }),
    ]);
    const bookings = await prisma.booking.findMany({ where: { status: 'CONFIRMED' } });
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const platformCommission = totalRevenue * 0.20;
    
    res.json({
      data: {
        totalHotels, totalUsers, totalBookings, pendingHotels,
        totalRevenue, platformCommission,
        partnersCount: await prisma.user.count({ where: { role: 'PARTNER' } }),
        guestsCount: await prisma.user.count({ where: { role: 'GUEST' } }),
      },
    });
  } catch (err) { next(err); }
});

// GET /api/admin/hotels - All hotels with filters
router.get('/hotels', async (req, res, next) => {
  try {
    const { status, city, search } = req.query;
    const where: any = {};
    if (status) where.status = status;
    if (city) where.city = city;
    if (search) where.name = { contains: search as string };
    const hotels = await prisma.hotel.findMany({
      where,
      include: { partner: { select: { id: true, name: true, email: true } }, _count: { select: { rooms: true, reviews: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: hotels });
  } catch (err) { next(err); }
});

// PATCH /api/admin/hotels/:id/approve - Approve a hotel
router.patch('/hotels/:id/approve', async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const hotel = await prisma.hotel.update({ where: { id }, data: { status: 'ACTIVE', isVerified: true } });
    res.json({ data: hotel });
  } catch (err) { next(err); }
});

// PATCH /api/admin/hotels/:id/feature - Toggle featured
router.patch('/hotels/:id/feature', async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const hotel = await prisma.hotel.findUnique({ where: { id } });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    const updated = await prisma.hotel.update({ where: { id }, data: { isFeatured: !hotel.isFeatured } });
    res.json({ data: updated });
  } catch (err) { next(err); }
});

// GET /api/admin/users - All users
router.get('/users', async (req, res, next) => {
  try {
    const { role } = req.query;
    const where: any = {};
    if (role) where.role = role;
    const users = await prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, phone: true, role: true, isVerified: true, createdAt: true, _count: { select: { bookings: true, hotels: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: users });
  } catch (err) { next(err); }
});

// PATCH /api/admin/users/:id/role - Change user role
router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const { role } = req.body;
    const user = await prisma.user.update({ where: { id }, data: { role } });
    res.json({ data: user });
  } catch (err) { next(err); }
});

// GET /api/admin/finance - Financial overview
router.get('/finance', async (_req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({ where: { status: { in: ['CONFIRMED', 'COMPLETED'] } }, include: { room: { include: { hotel: { select: { name: true, commission: true, partnerId: true } } } } } });
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalCommission = bookings.reduce((sum, b) => sum + (b.totalPrice * (b.room.hotel.commission / 100)), 0);
    res.json({ data: { totalRevenue, totalCommission, totalBookings: bookings.length } });
  } catch (err) { next(err); }
});

// POST /api/admin/cities - Create/manage cities
router.post('/cities', async (req, res, next) => {
  try {
    const city = await prisma.city.create({ data: req.body });
    res.status(201).json({ data: city });
  } catch (err) { next(err); }
});

// POST /api/admin/offers - Create offer
router.post('/offers', async (req, res, next) => {
  try {
    const offer = await prisma.offer.create({ data: req.body });
    res.status(201).json({ data: offer });
  } catch (err) { next(err); }
});

export default router;