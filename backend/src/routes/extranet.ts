import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// All extranet routes require PARTNER role
router.use(authenticate);
router.use(requireRole('PARTNER'));

// GET /api/extranet/dashboard - Partner dashboard stats
router.get('/dashboard', async (req: any, res, next) => {
  try {
    const partnerId = req.user.id;
    const hotels = await prisma.hotel.findMany({ where: { partnerId }, include: { rooms: true, reviews: true } });
    const hotelIds = hotels.map(h => h.id);
    
    const rooms = await prisma.room.findMany({ where: { hotelId: { in: hotelIds } } });
    const roomIds = rooms.map(r => r.id);
    
    const bookings = await prisma.booking.findMany({ where: { roomId: { in: roomIds } } });
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const commission = totalRevenue * 0.20;
    const partnerEarnings = totalRevenue - commission;
    
    const avgRating = hotels.length > 0 ? hotels.reduce((sum, h) => sum + h.rating, 0) / hotels.length : 0;
    const totalRooms = rooms.reduce((sum, r) => sum + r.totalRooms, 0);

    res.json({
      data: {
        totalHotels: hotels.length,
        totalRooms,
        totalBookings: bookings.length,
        confirmedBookings: confirmedBookings.length,
        totalRevenue,
        commission,
        partnerEarnings,
        avgRating: Math.round(avgRating * 10) / 10,
        recentBookings: bookings.slice(-10).reverse(),
      },
    });
  } catch (err) { next(err); }
});

// GET /api/extranet/properties - Partner's properties
router.get('/properties', async (req: any, res, next) => {
  try {
    const partnerId = req.user.id;
    const hotels = await prisma.hotel.findMany({
      where: { partnerId },
      include: { rooms: true, _count: { select: { reviews: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: hotels });
  } catch (err) { next(err); }
});

// POST /api/extranet/properties - Add a new property
router.post('/properties', async (req: any, res, next) => {
  try {
    const partnerId = req.user.id;
    const { name, city, address, description, propertyType, starRating, amenities, images, policies, rooms } = req.body;
    const hotel = await prisma.hotel.create({
      data: {
        name, city, address: address || '', description: description || '',
        propertyType: propertyType || 'Hotel', starRating: starRating || 3,
        partnerId, status: 'PENDING', rating: 0, isFeatured: false, commission: 20,
        images: JSON.stringify(images || []),
        amenities: JSON.stringify(amenities || []),
        policies: JSON.stringify(policies || {}),
        rooms: {
          create: (rooms || []).map((r: any) => ({
            type: r.type || 'Standard Room',
            capacity: r.capacity || 2,
            basePrice: r.basePrice || 1000,
            totalRooms: r.totalRooms || 1,
            amenities: JSON.stringify(r.amenities || []),
          })),
        },
      },
      include: { rooms: true },
    });
    res.status(201).json({ data: hotel });
  } catch (err) { next(err); }
});

// PUT /api/extranet/properties/:id - Update property
router.put('/properties/:id', async (req: any, res, next) => {
  try {
    const id = req.params.id as string;
    const partnerId = req.user.id;
    const hotel = await prisma.hotel.findFirst({ where: { id, partnerId } });
    if (!hotel) return res.status(404).json({ message: 'Property not found' });
    
    const updateData: Record<string, any> = { ...req.body };
    if (updateData.images) updateData.images = JSON.stringify(updateData.images);
    if (updateData.amenities) updateData.amenities = JSON.stringify(updateData.amenities);
    if (updateData.policies) updateData.policies = JSON.stringify(updateData.policies);
    
    const updated = await prisma.hotel.update({ where: { id }, data: updateData });
    res.json({ data: updated });
  } catch (err) { next(err); }
});

// GET /api/extranet/bookings - Partner's bookings
router.get('/bookings', async (req: any, res, next) => {
  try {
    const partnerId = req.user.id;
    const hotels = await prisma.hotel.findMany({ where: { partnerId }, select: { id: true } });
    const hotelIds = hotels.map(h => h.id);
    const rooms = await prisma.room.findMany({ where: { hotelId: { in: hotelIds } }, select: { id: true } });
    const roomIds = rooms.map(r => r.id);
    
    const bookings = await prisma.booking.findMany({
      where: { roomId: { in: roomIds } },
      include: { user: { select: { name: true, email: true, phone: true } }, room: { include: { hotel: { select: { name: true, city: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: bookings });
  } catch (err) { next(err); }
});

// GET /api/extranet/reviews - Partner's reviews
router.get('/reviews', async (req: any, res, next) => {
  try {
    const partnerId = req.user.id;
    const hotels = await prisma.hotel.findMany({ where: { partnerId }, select: { id: true } });
    const hotelIds = hotels.map(h => h.id);
    
    const reviews = await prisma.review.findMany({
      where: { hotelId: { in: hotelIds } },
      include: { user: { select: { name: true } }, hotel: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: reviews });
  } catch (err) { next(err); }
});

// POST /api/extranet/reviews/:id/reply - Reply to a review
router.post('/reviews/:id/reply', async (req: any, res, next) => {
  try {
    const id = req.params.id as string;
    const { reply } = req.body;
    const review = await prisma.review.update({ where: { id }, data: { reply } });
    res.json({ data: review });
  } catch (err) { next(err); }
});

// GET /api/extranet/inventory/:hotelId - Room inventory for a hotel
router.get('/inventory/:hotelId', async (req: any, res, next) => {
  try {
    const hotelId = req.params.hotelId as string;
    const partnerId = req.user.id;
    const hotel = await prisma.hotel.findFirst({ where: { id: hotelId, partnerId } });
    if (!hotel) return res.status(404).json({ message: 'Property not found' });
    
    const rooms = await prisma.room.findMany({
      where: { hotelId },
      include: { availability: { orderBy: { date: 'asc' } } },
    });
    res.json({ data: rooms });
  } catch (err) { next(err); }
});

// PUT /api/extranet/inventory/bulk - Bulk update prices/availability
router.put('/inventory/bulk', async (req: any, res, next) => {
  try {
    const { roomId, startDate, endDate, price, roomsAvailable } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const updates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      updates.push(
        prisma.roomAvailability.upsert({
          where: { roomId_date: { roomId, date } },
          update: { ...(price !== undefined && { price }), ...(roomsAvailable !== undefined && { roomsAvailable }) },
          create: { roomId, date, price: price || 0, roomsAvailable: roomsAvailable || 0 },
        })
      );
    }
    await Promise.all(updates);
    res.json({ data: { updated: updates.length } });
  } catch (err) { next(err); }
});

export default router;