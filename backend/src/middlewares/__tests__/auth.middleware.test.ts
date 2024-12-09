import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../auth.middleware';
import { AuthError } from '../../utils/error.util';

// Mock jwt
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it('should throw error when no token is provided', () => {
    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(expect.any(AuthError));
    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'No token provided',
      })
    );
  });

  it('should throw error when token is invalid', () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid_token',
    };

    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(expect.any(AuthError));
    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid token',
      })
    );
  });

  it('should add user to request when token is valid', () => {
    const mockUser = {
      userId: 'test-user-id',
      email: 'test@example.com',
    };

    mockRequest.headers = {
      authorization: 'Bearer valid_token',
    };

    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, mockUser);
    });

    authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith();
    expect((mockRequest as any).user).toEqual(mockUser);
  });
});
