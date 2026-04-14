import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';

const mockCreateExpense = jest.fn();
const mockGetAllExpenses = jest.fn();
const mockGetExpenseById = jest.fn();
const mockDeleteExpense = jest.fn();
const mockUpdateExpense = jest.fn();

jest.unstable_mockModule('../../../src/models/expenses.model.js', () => ({
  createExpense: mockCreateExpense,
  getAllExpenses: mockGetAllExpenses,
  getExpenseById: mockGetExpenseById,
  deleteExpense: mockDeleteExpense,
  updateExpense: mockUpdateExpense
}));

const expensesController = await import('../../../src/controllers/expenses.controller.js');
const { AppError } = await import('../../../src/errors/AppError.js');

describe('Expenses Controller', () => {
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

  describe('createExpense', () => {
    it('should create an expense successfully', async () => {
      req.body = { amount: 50, category: 'fuel' };
      const expectedExpense = { id: '1', ...req.body };
      mockCreateExpense.mockResolvedValueOnce(expectedExpense as never);

      await expensesController.createExpense(req as Request<any, any, any, any>, res as Response, next);

      expect(mockCreateExpense).toHaveBeenCalledWith(req.body, 'test-user-id');
      expect(res.json).toHaveBeenCalledWith({ message: "Gasto creado exitosamente", data: expectedExpense });
    });
  });

  describe('getAllExpenses', () => {
    it('should get all expenses', async () => {
      const expectedExpenses = [{ id: '1', amount: 50 }];
      mockGetAllExpenses.mockResolvedValueOnce(expectedExpenses as never);

      await expensesController.getAllExpenses(req as Request, res as Response, next);

      expect(mockGetAllExpenses).toHaveBeenCalledWith('test-user-id', { category: undefined, from: undefined, to: undefined });
      expect(res.json).toHaveBeenCalledWith({ message: "Gastos obtenidos exitosamente", data: expectedExpenses });
    });
  });

  describe('getExpenseById', () => {
    it('should get an expense by ID', async () => {
      req.params = { id: 'expense-id' };
      const expectedExpense = { id: 'expense-id' };
      mockGetExpenseById.mockResolvedValueOnce(expectedExpense as never);

      await expensesController.getExpenseById(req as Request, res as Response, next);

      expect(mockGetExpenseById).toHaveBeenCalledWith('expense-id', 'test-user-id');
      expect(res.json).toHaveBeenCalledWith({ message: "Gasto obtenido exitosamente", data: expectedExpense });
    });
  });

  describe('deleteExpense', () => {
    it('should delete an expense', async () => {
      req.params = { id: 'expense-id' };
      mockDeleteExpense.mockResolvedValueOnce({ count: 1 } as never);

      await expensesController.deleteExpense(req as Request, res as Response, next);

      expect(mockDeleteExpense).toHaveBeenCalledWith('expense-id', 'test-user-id');
      expect(res.json).toHaveBeenCalledWith({ message: "Gasto eliminado exitosamente", data: { count: 1 } });
    });
  });

  describe('updateExpense', () => {
    it('should update an expense', async () => {
      req.params = { id: 'expense-id' };
      req.body = { amount: 60 };
      const expectedExpense = { id: 'expense-id', amount: 60 };
      mockUpdateExpense.mockResolvedValueOnce([expectedExpense] as never);

      await expensesController.updateExpense(req as Request, res as Response, next);

      expect(mockUpdateExpense).toHaveBeenCalledWith('expense-id', 'test-user-id', req.body);
      expect(res.json).toHaveBeenCalledWith({ message: "Gasto actualizado correctamente", data: expectedExpense });
    });
  });
});
