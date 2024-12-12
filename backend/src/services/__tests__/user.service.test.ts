import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import UserService from '../user.service';
import { AuthError } from '../../utils/error.util';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

const prisma = new PrismaClient();

describe('UserService', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashed_password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Create a separate mock for the create response that matches our select clause
  const mockCreateResponse = {
    id: mockUser.id,
    email: mockUser.email,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    createdAt: mockUser.createdAt,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockCreateResponse);

      const result = await UserService.register({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(result).toHaveProperty('token');
      expect(result.user).toEqual(mockCreateResponse);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
    });

    it('should throw error if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        UserService.register({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        })
      ).rejects.toThrow(AuthError);
    });
  });

  describe('login', () => {
    it('should login user successfully with correct credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await UserService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('token');
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        createdAt: mockUser.createdAt,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
    });

    it('should throw error if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        UserService.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(AuthError);
    });

    it('should throw error if password is incorrect', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        UserService.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(AuthError);
    });
  });
});
