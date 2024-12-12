import { Request } from 'express';

export interface RegisterUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}
