import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { validate } from '../middleware/validate';
import { authenticate, generateToken } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    role: z.enum(['GUEST', 'PARTNER']).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError(409, 'Email already registered');

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, phone, role: role || 'GUEST' },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      status: 'success',
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError(401, 'Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AppError(401, 'Invalid credentials');

    const token = generateToken(user.id);

    res.json({
      status: 'success',
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req: Request, res: Response) => {
  res.json({ status: 'success', data: { user: req.user } });
});

export default router;
