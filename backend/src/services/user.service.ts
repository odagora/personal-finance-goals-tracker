import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import { CreateUserDTO, LoginDTO, AuthResponse } from '../types/user.types';
import { ValidationError, AuthError } from '../utils/error.util';

const prisma = new PrismaClient();

class UserService {
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  }

  async register(userData: CreateUserDTO): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    // Hash password and create user
    const hashedPassword = await this.hashPassword(userData.password);
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
      },
    });

    // Generate token
    const token = this.generateToken(user.id, user.email);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async login(credentials: LoginDTO): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new AuthError('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    if (!isValidPassword) {
      throw new AuthError('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user.id, user.email);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}

export default new UserService();
