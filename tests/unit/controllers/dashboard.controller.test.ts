import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';

const mockGetWeeklyDashboard = jest.fn();

jest.unstable_mockModule('../../../src/services/dashboard.service.js', () => ({
  getWeeklyDashboard: mockGetWeeklyDashboard
}));

const dashboardController = await import('../../../src/controllers/dashboard.controller.js');

describe('Dashboard Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: { 'x-timezone': 'America/Caracas' },
      userId: 'test-user-id'
    } as any;
    res = {
      json: jest.fn() as any,
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getWeeklyDashboard', () => {
    it('should return weekly dashboard data', async () => {
      const expectedData = {
        period: { from: '2023-01-01T00:00:00', to: '2023-01-07T23:59:59', days: 7, timezone: 'America/Caracas' },
        kpis: { totalIncome: '100.00', totalExpenses: '20.00', totalRides: 10, netIncome: '80.00', avgIncomePerRide: '10.00' },
        charts: { incomeByDay: [] }
      };

      mockGetWeeklyDashboard.mockResolvedValueOnce(expectedData as never);

      await dashboardController.getWeeklyDashboard(req as Request, res as Response, next);

      expect(mockGetWeeklyDashboard).toHaveBeenCalledWith('test-user-id', 'America/Caracas');
      expect(res.json).toHaveBeenCalledWith({ message: "Dashboard semanal", data: expectedData });
    });
  });
});
