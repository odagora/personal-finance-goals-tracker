import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { JWTPayload, AuthenticatedRequest } from '../types/auth.types';
import { AuthError } from '../utils/error.util';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AuthError('No token provided');
    }

    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        throw new AuthError('Invalid token');
      }

      // Type assertion is safe here because we're adding the user property
      (req as AuthenticatedRequest).user = decoded as JWTPayload;
      next();
    });
  } catch (error) {
    next(error);
  }
};
