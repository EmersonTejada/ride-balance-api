import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockAggregateRide = jest.fn();
const mockAggregateExpense = jest.fn();
const mockQueryRaw = jest.fn();

jest.unstable_mockModule('../../../src/prisma/index.js', () => ({
  prisma: {
    ride: { aggregate: mockAggregateRide },
    expense: { aggregate: mockAggregateExpense },
    $queryRaw: mockQueryRaw,
  }
}));

const dashboardService = await import('../../../src/services/dashboard.service.js');

describe('Dashboard Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userId = 'user-1';
  const tz = 'America/Caracas';

  describe('getWeeklyDashboard', () => {
    it('should calculate KPIs and charts correctly', async () => {
      // Mock Rides
      mockAggregateRide.mockResolvedValueOnce({
        _sum: { amount: { toNumber: () => 100 } },
        _count: { id: 10 }
      } as never);

      // Mock Expenses
      mockAggregateExpense.mockResolvedValueOnce({
        _sum: { amount: { toNumber: () => 30 } }
      } as never);

      // Mock queryRaw (Income by Day)
      const mockQueryRawResult = [
        { day: new Date('2023-10-10T12:00:00Z'), total: 50 },
        { day: new Date('2023-10-11T12:00:00Z'), total: 50 }
      ];
      mockQueryRaw.mockResolvedValueOnce(mockQueryRawResult as never);

      const result = await dashboardService.getWeeklyDashboard(userId, tz);

      expect(result.kpis.totalIncome).toBe('100.00');
      expect(result.kpis.totalExpenses).toBe('30.00');
      expect(result.kpis.totalRides).toBe(10);
      expect(result.kpis.netIncome).toBe('70.00');
      expect(result.kpis.avgIncomePerRide).toBe('10.00');
      
      expect(mockAggregateRide).toHaveBeenCalled();
      expect(mockAggregateExpense).toHaveBeenCalled();
      expect(mockQueryRaw).toHaveBeenCalled();
    });
  });
});
