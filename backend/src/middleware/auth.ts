import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'staylo-dev-secret-key';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ status: 'error', message: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    prisma.user
      .findUnique({ where: { id: decoded.userId } })
      .then((user) => {
        if (!user) {
          res.status(401).json({ status: 'error', message: 'User not found' });
          return;
        }
        req.user = { id: user.id, email: user.email, name: user.name, role: user.role };
        next();
      })
      .catch(next);
  } catch {
    res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Authentication required' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ status: 'error', message: 'Insufficient permissions' });
      return;
    }
    next();
  };
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}
