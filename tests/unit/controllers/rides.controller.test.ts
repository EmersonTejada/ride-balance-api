import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';

const mockCreateRide = jest.fn();
const mockGetAllRides = jest.fn();
const mockGetRideById = jest.fn();
const mockDeleteRide = jest.fn();
const mockUpdatedRide = jest.fn();

jest.unstable_mockModule('../../../src/models/rides.model.js', () => ({
  createRide: mockCreateRide,
  getAllRides: mockGetAllRides,
  getRideById: mockGetRideById,
  deleteRide: mockDeleteRide,
  updatedRide: mockUpdatedRide
}));

const ridesController = await import('../../../src/controllers/rides.controller.js');
const { AppError } = await import('../../../src/errors/AppError.js');

describe('Rides Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      userId: 'test-user-id'
    } as any;
    res = {
      json: jest.fn() as any,
      status: jest.fn().mockReturnThis() as any
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('createRide', () => {
    it('should create a ride successfully', async () => {
      req.body = { amount: 15.5, platform: 'yummy' };
      const expectedRide = { id: '1', ...req.body };
      mockCreateRide.mockResolvedValueOnce(expectedRide as never);

      await ridesController.createRide(req as Request<any, any, any, any>, res as Response, next);

      expect(mockCreateRide).toHaveBeenCalledWith(req.body, 'test-user-id');
      expect(res.json).toHaveBeenCalledWith({ message: "Viaje creado exitosamente", data: expectedRide });
    });
  });

  describe('getAllRides', () => {
    it('should get all rides', async () => {
      req.query = { platform: 'yummy' };
      const expectedRides = [{ id: '1', platform: 'yummy' }];
      mockGetAllRides.mockResolvedValueOnce(expectedRides as never);

      await ridesController.getAllRides(req as Request, res as Response, next);

      expect(mockGetAllRides).toHaveBeenCalledWith('test-user-id', { platform: 'yummy', from: undefined, to: undefined });
      expect(res.json).toHaveBeenCalledWith({ message: "Viajes obtenidos exitosamente", data: expectedRides });
    });
  });

  describe('getRideById', () => {
    it('should get a ride by ID', async () => {
      req.params = { id: 'ride-id' };
      const expectedRide = { id: 'ride-id' };
      mockGetRideById.mockResolvedValueOnce(expectedRide as never);

      await ridesController.getRideById(req as Request, res as Response, next);

      expect(mockGetRideById).toHaveBeenCalledWith('ride-id', 'test-user-id');
      expect(res.json).toHaveBeenCalledWith({ message: "Viaje obtenido exitosamente", data: expectedRide });
    });

    it('should throw AppError if ride is not found', async () => {
      req.params = { id: 'ride-id' };
      mockGetRideById.mockResolvedValueOnce(null as never);

      await expect(
        ridesController.getRideById(req as Request, res as Response, next)
      ).rejects.toThrow(new AppError('No existe un viaje con el id ride-id', 404));
    });
  });

  describe('deleteRide', () => {
    it('should delete a ride', async () => {
      req.params = { id: 'ride-id' };
      mockDeleteRide.mockResolvedValueOnce({ count: 1 } as never);

      await ridesController.deleteRide(req as Request, res as Response, next);

      expect(mockDeleteRide).toHaveBeenCalledWith('ride-id', 'test-user-id');
      expect(res.json).toHaveBeenCalledWith({ message: "Viaje eliminado exitosamente", data: null });
    });

    it('should throw AppError if ride to delete is not found', async () => {
      req.params = { id: 'ride-id' };
      mockDeleteRide.mockResolvedValueOnce({ count: 0 } as never);

      await expect(
        ridesController.deleteRide(req as Request, res as Response, next)
      ).rejects.toThrow(new AppError('No existe un viaje con el id ride-id', 404));
    });
  });

  describe('updateRide', () => {
    it('should update a ride', async () => {
      req.params = { id: 'ride-id' };
      req.body = { amount: 20 };
      const expectedRide = { id: 'ride-id', amount: 20 };
      mockUpdatedRide.mockResolvedValueOnce([expectedRide] as never);

      await ridesController.updateRide(req as Request, res as Response, next);

      expect(mockUpdatedRide).toHaveBeenCalledWith('ride-id', 'test-user-id', req.body);
      expect(res.json).toHaveBeenCalledWith({ message: "Viaje actualizado exitosamente", data: expectedRide });
    });

    it('should throw AppError if ride to update is not found', async () => {
      req.params = { id: 'ride-id' };
      req.body = { amount: 20 };
      mockUpdatedRide.mockResolvedValueOnce([] as never);

      await expect(
        ridesController.updateRide(req as Request, res as Response, next)
      ).rejects.toThrow(new AppError('No existe un viaje con el id ride-id', 404));
    });
  });
});
