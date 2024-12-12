import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthError } from '../utils/error.util';
import { RegisterUserDTO, LoginUserDTO } from '../types/auth.types';

const prisma = new PrismaClient();

class UserService {
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private generateToken(
    userId: string,
    email: string,
    firstName: string,
    lastName: string
  ): string {
    return jwt.sign({ userId, email, firstName, lastName }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  async register({ email, password, firstName, lastName }: RegisterUserDTO) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AuthError('Email already registered');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id, user.email, user.firstName, user.lastName);

    return { user, token };
  }

  async login({ email, password }: LoginUserDTO) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AuthError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AuthError('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.email, user.firstName, user.lastName);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      },
      token,
    };
  }
}

export default new UserService();
