import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const INDIAN_CITIES = [
  { city: 'Mumbai', hotels: ['The Taj Palace Mumbai', 'Marine Bay Suites', 'Gateway Grand'] },
  { city: 'Delhi', hotels: ['Imperial Crown Delhi', 'Rajpath Residency'] },
  { city: 'Goa', hotels: ['Beachfront Paradise Goa', 'Panjim Heritage Hotel'] },
  { city: 'Jaipur', hotels: ['Royal Haveli Jaipur', 'Pink City Palace'] },
  { city: 'Bangalore', hotels: ['Tech Park Inn Bangalore'] },
];

const ROOM_TYPES = [
  { type: 'Standard', capacity: 2, basePrice: 2500, totalRooms: 20, amenities: ['Wi-Fi', 'AC', 'TV'] },
  { type: 'Deluxe', capacity: 3, basePrice: 4500, totalRooms: 15, amenities: ['Wi-Fi', 'AC', 'TV', 'Mini Bar', 'Room Service'] },
  { type: 'Suite', capacity: 4, basePrice: 8000, totalRooms: 5, amenities: ['Wi-Fi', 'AC', 'TV', 'Mini Bar', 'Room Service', 'Jacuzzi', 'Living Area'] },
];

const HOTEL_AMENITIES = ['Wi-Fi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Parking', 'Room Service', '24/7 Front Desk', 'Laundry'];

const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
];

async function main() {
  console.log('Seeding database...');

  await prisma.booking.deleteMany();
  await prisma.roomAvailability.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@staylo.in', password: adminPassword, role: 'ADMIN' },
  });
  console.log('Created admin:', admin.email);

  const partnerPassword = await bcrypt.hash('partner123', 12);
  const partner = await prisma.user.create({
    data: { name: 'Hotel Partner', email: 'partner@staylo.in', password: partnerPassword, role: 'PARTNER' },
  });
  console.log('Created partner:', partner.email);

  const guestPassword = await bcrypt.hash('guest123', 12);
  const guest = await prisma.user.create({
    data: { name: 'Test Guest', email: 'guest@staylo.in', password: guestPassword, role: 'GUEST' },
  });
  console.log('Created guest:', guest.email);

  let hotelCount = 0;
  for (const cityData of INDIAN_CITIES) {
    for (const hotelName of cityData.hotels) {
      const rating = 3.5 + Math.random() * 1.5;
      const amenityCount = 5 + Math.floor(Math.random() * 5);
      const shuffledAmenities = [...HOTEL_AMENITIES].sort(() => Math.random() - 0.5);

      const hotel = await prisma.hotel.create({
        data: {
          name: hotelName,
          city: cityData.city,
          address: hotelCount + ' Main Road, ' + cityData.city + ', India',
          description: hotelName + ' is a premium hotel in ' + cityData.city + '. Experience luxury and world-class hospitality.',
          images: JSON.stringify(HOTEL_IMAGES),
          amenities: JSON.stringify(shuffledAmenities.slice(0, amenityCount)),
          rating: Math.round(rating * 10) / 10,
          partnerId: partner.id,
          status: 'ACTIVE',
          rooms: {
            create: ROOM_TYPES.map((rt) => ({
              type: rt.type,
              capacity: rt.capacity,
              basePrice: rt.basePrice + Math.floor(Math.random() * 1000),
              totalRooms: rt.totalRooms,
              amenities: JSON.stringify(rt.amenities),
            })),
          },
        },
        include: { rooms: true },
      });

      const today = new Date();
      for (const room of hotel.rooms) {
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() + i);
          date.setHours(0, 0, 0, 0);
          await prisma.roomAvailability.create({
            data: { roomId: room.id, date, price: room.basePrice, roomsAvailable: room.totalRooms },
          });
        }
      }

      hotelCount++;
      console.log('Created hotel: ' + hotelName);
    }
  }

  console.log('\nSeed complete! Hotels: ' + hotelCount);
  console.log('\nTest accounts:');
  console.log('  Admin:   admin@staylo.in / admin123');
  console.log('  Partner: partner@staylo.in / partner123');
  console.log('  Guest:   guest@staylo.in / guest123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
