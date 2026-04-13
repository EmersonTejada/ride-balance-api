import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';

const mockGetSummary = jest.fn();
const mockGetRidesReport = jest.fn();
const mockGetExpensesReport = jest.fn();

jest.unstable_mockModule('../../../src/services/report.summary.service.js', () => ({
  getReportSummary: mockGetSummary
}));
jest.unstable_mockModule('../../../src/services/report.rides.service.js', () => ({
  getRidesReport: mockGetRidesReport
}));
jest.unstable_mockModule('../../../src/services/report.expenses.service.js', () => ({
  getExpensesReport: mockGetExpensesReport
}));

const reportController = await import('../../../src/controllers/report.controller.js');

describe('Reports Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: { 'x-timezone': 'America/Caracas' },
      query: { month: '2023-10' },
      userId: 'test-user-id'
    } as any;
    res = {
      json: jest.fn() as any,
      locals: { query: { from: '2023-10-01', to: '2023-10-31' } }
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getSummary', () => {
    it('should return summary report', async () => {
      const expectedData = { kpis: {} };
      mockGetSummary.mockResolvedValueOnce(expectedData as never);

      await reportController.getSummary(req as Request, res as Response, next);

      expect(mockGetSummary).toHaveBeenCalledWith('test-user-id', '2023-10-01', '2023-10-31', 'America/Caracas');
      expect(res.json).toHaveBeenCalledWith({ message: "Reporte obtenido exitosamente", data: expectedData });
    });
  });

  describe('getRidesReport', () => {
    it('should return rides report', async () => {
      const expectedData = { kpis: {} };
      mockGetRidesReport.mockResolvedValueOnce(expectedData as never);

      await reportController.getRidesReport(req as Request, res as Response, next);

      expect(mockGetRidesReport).toHaveBeenCalledWith('test-user-id', '2023-10-01', '2023-10-31', 'America/Caracas');
      expect(res.json).toHaveBeenCalledWith({ message: "Reporte obtenido exitosamente", data: expectedData });
    });
  });

  describe('getExpensesReport', () => {
    it('should return expenses report', async () => {
      const expectedData = { kpis: {} };
      mockGetExpensesReport.mockResolvedValueOnce(expectedData as never);

      await reportController.getExpensesReport(req as Request, res as Response, next);

      expect(mockGetExpensesReport).toHaveBeenCalledWith('test-user-id', '2023-10-01', '2023-10-31', 'America/Caracas');
      expect(res.json).toHaveBeenCalledWith({ message: "Reporte obtenido exitosamente", data: expectedData });
    });
  });
});
