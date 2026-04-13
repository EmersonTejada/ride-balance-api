import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';

const mockCompare = jest.fn();
jest.unstable_mockModule('bcrypt', () => ({
  default: { compare: mockCompare }
}));

const mockSign = jest.fn();
const mockVerify = jest.fn();
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { sign: mockSign, verify: mockVerify }
}));

const mockFindUserByEmail = jest.fn();
jest.unstable_mockModule('../../../src/models/auth.model.js', () => ({
  findUserByEmail: mockFindUserByEmail,
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  findUserById: jest.fn()
}));

const authController = await import('../../../src/controllers/auth.controller.js');
const { AppError } = await import('../../../src/errors/AppError.js');

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {},
      headers: {}
    };
    res = {
      json: jest.fn() as any,
      status: jest.fn().mockReturnThis() as any
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw AppError if user does not exist', async () => {
      req.body = { email: 'wrong@example.com', password: 'mypassword' };
      mockFindUserByEmail.mockResolvedValueOnce(null as never);

      await expect(
        authController.login(req as Request, res as Response, next)
      ).rejects.toThrow(new AppError('Usuario no existe', 401));
    });

    it('should throw AppError if password is incorrect', async () => {
      req.body = { email: 'test@example.com', password: 'wrongpassword' };
      const mockUser = { id: '1', email: 'test@example.com', password: 'hashed-password' };
      
      mockFindUserByEmail.mockResolvedValueOnce(mockUser as never);
      mockCompare.mockResolvedValueOnce(false as never);

      await expect(
        authController.login(req as Request, res as Response, next)
      ).rejects.toThrow(new AppError('Contraseña incorrecta', 401));
    });

    it('should login successfully and return token', async () => {
      req.body = { email: 'test@example.com', password: 'correctpassword' };
      const mockUser = { id: '1', email: 'test@example.com', password: 'hashed-password', name: 'Test' };
      
      mockFindUserByEmail.mockResolvedValueOnce(mockUser as never);
      mockCompare.mockResolvedValueOnce(true as never);
      mockSign.mockReturnValueOnce('mocked.jwt.token' as any);
      process.env.JWT_SECRET = 'secret';

      await authController.login(req as Request, res as Response, next);

      expect(mockSign).toHaveBeenCalledWith(
        { userId: mockUser.id, email: mockUser.email, name: mockUser.name },
        'secret',
        { expiresIn: '1h' }
      );
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login exitoso',
        token: 'mocked.jwt.token'
      });
    });
  });

  describe('getUserProfile', () => {
    it('should verify token and return user profile', async () => {
      req.headers = { authorization: 'Bearer mocked.jwt.token' };
      const decodedToken = { userId: '1', email: 'test@example.com', name: 'Test' };
      mockVerify.mockReturnValueOnce(decodedToken as any);

      await authController.getUserProfile(req as Request, res as Response, next);

      expect(mockVerify).toHaveBeenCalledWith('mocked.jwt.token', 'secret');
      expect(res.json).toHaveBeenCalledWith({
        message: "Usuario Verificado",
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test'
          }
        }
      });
    });

    it('should throw AppError if no token provided', async () => {
      await expect(
        authController.getUserProfile(req as Request, res as Response, next)
      ).rejects.toThrow(new AppError('No autenticado', 401));
    });
  });
});
