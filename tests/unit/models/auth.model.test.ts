import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

const mockCreate = jest.fn();
const mockFindUnique = jest.fn();

jest.unstable_mockModule('../../../src/prisma/index.js', () => ({
  prisma: {
    user: {
      create: mockCreate,
      findUnique: mockFindUnique
    }
  }
}));

const mockHash = jest.fn();
jest.unstable_mockModule('bcrypt', () => ({
  default: { hash: mockHash }
}));

const authModel = await import('../../../src/models/auth.model.js');

describe('Auth Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should hash the password and create a new user', async () => {
      const mockUser = {
        name: 'Test',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const expectedCreatedUser = {
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockHash.mockResolvedValueOnce('hashed-password' as never);
      mockCreate.mockResolvedValueOnce(expectedCreatedUser as never);
      
      const result = await authModel.createUser(mockUser);
      
      expect(mockHash).toHaveBeenCalledWith('password123', 10);
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          email: mockUser.email,
          password: 'hashed-password',
          name: mockUser.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        }
      });
      expect(result).toEqual(expectedCreatedUser);
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      const expectedUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password'
      };

      mockFindUnique.mockResolvedValueOnce(expectedUser as never);

      const result = await authModel.findUserByEmail('test@example.com');

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      expect(result).toEqual(expectedUser);
    });
  });
});
