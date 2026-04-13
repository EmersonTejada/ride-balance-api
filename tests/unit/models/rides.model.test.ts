import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

const mockCreate = jest.fn();
const mockFindMany = jest.fn();
const mockFindFirst = jest.fn();
const mockDeleteMany = jest.fn();
const mockUpdateManyAndReturn = jest.fn();

jest.unstable_mockModule('../../../src/prisma/index.js', () => ({
  prisma: {
    ride: {
      create: mockCreate,
      findMany: mockFindMany,
      findFirst: mockFindFirst,
      deleteMany: mockDeleteMany,
      updateManyAndReturn: mockUpdateManyAndReturn,
    }
  }
}));

const ridesModel = await import('../../../src/models/rides.model.js');

describe('Rides Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userId = 'test-user-id';

  describe('createRide', () => {
    it('should create a new ride', async () => {
      const newRideData = { amount: 15.5, platform: 'yummy' as any };
      const expectedRide = { id: '1', ...newRideData, userId, date: new Date() };

      mockCreate.mockResolvedValueOnce(expectedRide as never);

      const result = await ridesModel.createRide(newRideData, userId);

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          amount: newRideData.amount,
          platform: newRideData.platform,
          userId,
        }
      });
      expect(result).toEqual(expectedRide);
    });
  });

  describe('getAllRides', () => {
    it('should return all rides for a user without filters', async () => {
      const expectedRides = [{ id: '1', amount: 10, userId }];
      mockFindMany.mockResolvedValueOnce(expectedRides as never);

      const result = await ridesModel.getAllRides(userId);

      expect(mockFindMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { date: 'desc' }
      });
      expect(result).toEqual(expectedRides);
    });

    it('should apply filters correctly', async () => {
      const filters = { platform: 'ridery' as any, from: '2023-01-01', to: '2023-12-31' };
      mockFindMany.mockResolvedValueOnce([] as never);

      await ridesModel.getAllRides(userId, filters);

      expect(mockFindMany).toHaveBeenCalledWith({
        where: {
          userId,
          platform: 'ridery',
          date: { gte: new Date('2023-01-01'), lte: new Date('2023-12-31') }
        },
        orderBy: { date: 'desc' }
      });
    });
  });

  describe('getRideById', () => {
    it('should return a ride by ID', async () => {
      const expectedRide = { id: 'ride-id', amount: 10, userId };
      mockFindFirst.mockResolvedValueOnce(expectedRide as never);

      const result = await ridesModel.getRideById('ride-id', userId);

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: 'ride-id', userId }
      });
      expect(result).toEqual(expectedRide);
    });
  });

  describe('deleteRide', () => {
    it('should delete a ride by ID', async () => {
      const expectedResult = { count: 1 };
      mockDeleteMany.mockResolvedValueOnce(expectedResult as never);

      const result = await ridesModel.deleteRide('ride-id', userId);

      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { id: 'ride-id', userId }
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updatedRide', () => {
    it('should update a ride by ID', async () => {
      const updateData = { amount: 20 };
      const expectedResult = [{ id: 'ride-id', amount: 20 }];
      mockUpdateManyAndReturn.mockResolvedValueOnce(expectedResult as never);

      const result = await ridesModel.updatedRide('ride-id', userId, updateData);

      expect(mockUpdateManyAndReturn).toHaveBeenCalledWith({
        where: { id: 'ride-id', userId },
        data: { amount: 20, platform: undefined }
      });
      expect(result).toEqual(expectedResult);
    });
  });
});
