import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CITIES = [
  { name: 'Mumbai', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800', isPopular: true },
  { name: 'Delhi', state: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', isPopular: true },
  { name: 'Goa', state: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', isPopular: true },
  { name: 'Jaipur', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', isPopular: true },
  { name: 'Bangalore', state: 'Karnataka', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800', isPopular: true },
  { name: 'Udaipur', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', isPopular: true },
  { name: 'Manali', state: 'Himachal Pradesh', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', isPopular: true },
  { name: 'Hyderabad', state: 'Telangana', image: 'https://images.unsplash.com/photo-1572883454114-c01be4f0e55d?w=800', isPopular: false },
  { name: 'Chennai', state: 'Tamil Nadu', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', isPopular: false },
  { name: 'Kolkata', state: 'West Bengal', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800', isPopular: false },
];

const HOTELS_DATA = [
  { name: 'Staylo Grand Mumbai', city: 'Mumbai', address: '123 Marine Drive, Mumbai 400020', description: 'Experience luxury redefined at Staylo Grand Mumbai, overlooking the iconic Marine Drive. Our hotel offers world-class amenities, fine dining, and unparalleled views of the Arabian Sea.', starRating: 4, propertyType: 'Hotel', rating: 4.5, isFeatured: true, isVerified: true },
  { name: 'Marine Bay Suites', city: 'Mumbai', address: '45 Juhu Beach Road, Mumbai 400049', description: 'A premium beachfront hotel in Juhu offering spacious suites with ocean views. Perfect for both business and leisure travelers.', starRating: 4, propertyType: 'Hotel', rating: 4.3, isFeatured: true, isVerified: true },
  { name: 'Gateway Residency', city: 'Mumbai', address: '78 Colaba Causeway, Mumbai 400005', description: 'Located near the Gateway of India, this boutique hotel blends colonial charm with modern comfort.', starRating: 3, propertyType: 'Hotel', rating: 4.1, isFeatured: false, isVerified: true },
  { name: 'Imperial Crown Delhi', city: 'Delhi', address: '1 Rajpath, New Delhi 110001', description: 'A majestic 5-star experience in the heart of Lutyens Delhi. Walking distance to India Gate and major government buildings.', starRating: 5, propertyType: 'Hotel', rating: 4.7, isFeatured: true, isVerified: true },
  { name: 'Rajpath Residency', city: 'Delhi', address: '24 Connaught Place, New Delhi 110001', description: 'Modern business hotel in the bustling heart of CP. Ideal for corporate travelers with meeting rooms and high-speed WiFi.', starRating: 3, propertyType: 'Hotel', rating: 4.0, isFeatured: false, isVerified: true },
  { name: 'Beachfront Paradise Goa', city: 'Goa', address: 'Calangute Beach Road, Goa 403516', description: 'Wake up to the sound of waves at our beachfront resort in Calangute. Features a pool, spa, and beachside restaurant.', starRating: 4, propertyType: 'Resort', rating: 4.6, isFeatured: true, isVerified: true },
  { name: 'Panjim Heritage Hotel', city: 'Goa', address: '15 Latin Quarter, Panjim, Goa 403001', description: 'A charming heritage property in the heart of Old Goa. Experience Portuguese architecture with modern amenities.', starRating: 3, propertyType: 'Hotel', rating: 4.2, isFeatured: false, isVerified: true },
  { name: 'Royal Haveli Jaipur', city: 'Jaipur', address: 'Amber Fort Road, Jaipur 302001', description: 'Stay in a restored Rajasthani haveli with stunning views of Amber Fort. Features traditional decor, rooftop dining, and cultural evenings.', starRating: 4, propertyType: 'Hotel', rating: 4.8, isFeatured: true, isVerified: true },
  { name: 'Pink City Palace', city: 'Jaipur', address: 'MI Road, Jaipur 302001', description: 'A heritage boutique hotel inspired by the Pink City architecture. Walking distance to Hawa Mahal and City Palace.', starRating: 3, propertyType: 'Hotel', rating: 4.1, isFeatured: false, isVerified: true },
  { name: 'Tech Park Inn Bangalore', city: 'Bangalore', address: 'Whitefield, Bangalore 560066', description: 'Modern hotel in the IT corridor of Bangalore. Perfect for tech professionals with 24/7 coworking space and high-speed internet.', starRating: 3, propertyType: 'Hotel', rating: 4.0, isFeatured: false, isVerified: true },
  { name: 'Staylo Lake Palace Udaipur', city: 'Udaipur', address: 'Lake Pichola, Udaipur 313001', description: 'A breathtaking lakeside property overlooking Lake Pichola. Experience the romance of Udaipur with rooftop dining and boat rides.', starRating: 5, propertyType: 'Resort', rating: 4.9, isFeatured: true, isVerified: true },
  { name: 'Mountain View Resort Manali', city: 'Manali', address: 'Old Manali Road, Manali 175131', description: 'Nestled in the Himalayas, our resort offers stunning mountain views, adventure activities, and cozy wooden cottages.', starRating: 4, propertyType: 'Resort', rating: 4.4, isFeatured: true, isVerified: true },
];

const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
];

const ROOM_TYPES = [
  { type: 'Standard', capacity: 2, basePrice: 1999, totalRooms: 20, amenities: ['Wi-Fi', 'AC', 'TV', 'Attached Bathroom'] },
  { type: 'Deluxe', capacity: 3, basePrice: 3499, totalRooms: 15, amenities: ['Wi-Fi', 'AC', 'TV', 'Mini Bar', 'Room Service', 'Breakfast'] },
  { type: 'Suite', capacity: 4, basePrice: 6999, totalRooms: 5, amenities: ['Wi-Fi', 'AC', 'TV', 'Mini Bar', 'Room Service', 'Jacuzzi', 'Living Area', 'Breakfast'] },
];

const HOTEL_AMENITIES = ['Free Wi-Fi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Free Parking', '24/7 Room Service', '24/7 Front Desk', 'Laundry', 'Airport Shuttle', 'Business Center'];

const OFFERS = [
  { code: 'STAYLO50', title: 'First Booking Offer', description: 'Get 50% off on your first booking with Staylo!', discount: 50, maxDiscount: 2000, minBooking: 1500, validFrom: new Date('2026-01-01'), validTill: new Date('2026-12-31'), isActive: true },
  { code: 'WEEKEND25', title: 'Weekend Getaway', description: '25% off on weekend stays (Fri-Sun)', discount: 25, maxDiscount: 3000, minBooking: 2000, validFrom: new Date('2026-01-01'), validTill: new Date('2026-12-31'), isActive: true },
  { code: 'SUMMER30', title: 'Summer Special', description: '30% off on bookings in hill stations', discount: 30, maxDiscount: 5000, minBooking: 3000, validFrom: new Date('2026-04-01'), validTill: new Date('2026-07-31'), isActive: true },
  { code: 'GOA40', title: 'Goa Monsoon Magic', description: 'Flat 40% off on all Goa properties', discount: 40, maxDiscount: 4000, minBooking: 2000, validFrom: new Date('2026-06-01'), validTill: new Date('2026-09-30'), isActive: true },
];

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.savedHotel.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.roomAvailability.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.city.deleteMany();
  await prisma.payout.deleteMany();

  // Create cities
  for (const city of CITIES) {
    await prisma.city.create({ data: city });
  }
  console.log('Created ' + CITIES.length + ' cities');

  // Create offers
  for (const offer of OFFERS) {
    await prisma.offer.create({ data: offer });
  }
  console.log('Created ' + OFFERS.length + ' offers');

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: { name: 'Super Admin', email: 'admin@staylo.in', password: adminPassword, role: 'ADMIN', isVerified: true },
  });
  console.log('Created admin:', admin.email);

  const partnerPassword = await bcrypt.hash('partner123', 12);
  const partner = await prisma.user.create({
    data: { name: 'Hotel Partner', email: 'partner@staylo.in', password: partnerPassword, role: 'PARTNER', isVerified: true },
  });
  console.log('Created partner:', partner.email);

  const guestPassword = await bcrypt.hash('guest123', 12);
  const guest = await prisma.user.create({
    data: { name: 'Test Guest', email: 'guest@staylo.in', password: guestPassword, role: 'GUEST', isVerified: true },
  });
  console.log('Created guest:', guest.email);

  // Create hotels
  let hotelCount = 0;
  for (const hotelData of HOTELS_DATA) {
    const amenityCount = 6 + Math.floor(Math.random() * 6);
    const shuffled = [...HOTEL_AMENITIES].sort(() => Math.random() - 0.5);

    const hotel = await prisma.hotel.create({
      data: {
        ...hotelData,
        images: JSON.stringify(HOTEL_IMAGES.sort(() => Math.random() - 0.5)),
        amenities: JSON.stringify(shuffled.slice(0, amenityCount)),
        commission: 20.0,
        partnerId: partner.id,
        status: 'ACTIVE',
        rooms: {
          create: ROOM_TYPES.map((rt) => ({
            type: rt.type,
            capacity: rt.capacity,
            basePrice: rt.basePrice + Math.floor(Math.random() * 1000),
            totalRooms: rt.totalRooms,
            amenities: JSON.stringify(rt.amenities),
            images: JSON.stringify([HOTEL_IMAGES[Math.floor(Math.random() * HOTEL_IMAGES.length)]]),
          })),
        },
      },
      include: { rooms: true },
    });

    // Create availability for 60 days
    const today = new Date();
    for (const room of hotel.rooms) {
      for (let i = 0; i < 60; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        date.setHours(0, 0, 0, 0);
        const weekendMultiplier = (date.getDay() === 0 || date.getDay() === 6) ? 1.3 : 1.0;
        await prisma.roomAvailability.create({
          data: {
            roomId: room.id,
            date,
            price: Math.round(room.basePrice * weekendMultiplier),
            roomsAvailable: room.totalRooms - Math.floor(Math.random() * 3),
          },
        });
      }
    }
    hotelCount++;
    console.log('Created hotel: ' + hotelData.name);
  }

  // Update city hotel counts
  for (const city of CITIES) {
    const count = await prisma.hotel.count({ where: { city: city.name } });
    await prisma.city.update({ where: { name: city.name }, data: { hotelCount: count } });
  }

  // Create sample reviews
  const hotels = await prisma.hotel.findMany({ take: 5 });
  const reviewTexts = [
    { title: 'Amazing stay!', comment: 'Clean rooms, great service, and excellent location. Will definitely come back!', rating: 5 },
    { title: 'Good value for money', comment: 'The room was comfortable and the staff was friendly. Breakfast could be better.', rating: 4 },
    { title: 'Decent experience', comment: 'Nothing fancy but gets the job done. Good for a short stay.', rating: 3 },
    { title: 'Loved the ambiance', comment: 'Beautiful property with great attention to detail. The pool area was fantastic!', rating: 5 },
    { title: 'Comfortable stay', comment: 'Well-maintained property. The AC worked great and WiFi was fast.', rating: 4 },
  ];

  for (let i = 0; i < Math.min(hotels.length, reviewTexts.length); i++) {
    await prisma.review.create({
      data: {
        userId: guest.id,
        hotelId: hotels[i].id,
        ...reviewTexts[i],
      },
    });
  }
  console.log('Created sample reviews');

  console.log('\nSeed complete!');
  console.log('Hotels: ' + hotelCount);
  console.log('Cities: ' + CITIES.length);
  console.log('Offers: ' + OFFERS.length);
  console.log('\nTest accounts:');
  console.log('  Admin:   admin@staylo.in / admin123');
  console.log('  Partner: partner@staylo.in / partner123');
  console.log('  Guest:   guest@staylo.in / guest123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });