import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import hotelRoutes from './routes/hotels';
import bookingRoutes from './routes/bookings';
import partnerRoutes from './routes/partners';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS - allow multiple origins
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow Vercel previews, staylo.in, and localhost
    if (
      origin.includes('vercel.app') ||
      origin.includes('staylo.in') ||
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }
    callback(null, true); // Allow all during development
  },
  credentials: true,
}));
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/partners', partnerRoutes);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Staylo API running on http://localhost:' + PORT);
});

export default app;