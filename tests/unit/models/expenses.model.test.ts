import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockCreate = jest.fn();
const mockFindMany = jest.fn();
const mockFindFirst = jest.fn();
const mockDeleteMany = jest.fn();
const mockUpdateManyAndReturn = jest.fn();

jest.unstable_mockModule('../../../src/prisma/index.js', () => ({
  prisma: {
    expense: {
      create: mockCreate,
      findMany: mockFindMany,
      findFirst: mockFindFirst,
      deleteMany: mockDeleteMany,
      updateManyAndReturn: mockUpdateManyAndReturn,
    }
  }
}));

const expensesModel = await import('../../../src/models/expenses.model.js');

describe('Expenses Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const userId = 'test-user-id';

  describe('createExpense', () => {
    it('should create a new expense', async () => {
      const newExpenseData = { amount: 50, platform: 'yummy', category: 'fuel', description: 'Gasoline' } as any;
      const expectedExpense = { id: '1', ...newExpenseData, userId };

      mockCreate.mockResolvedValueOnce(expectedExpense as never);

      const result = await expensesModel.createExpense(newExpenseData, userId);

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          amount: newExpenseData.amount,
          description: newExpenseData.description,
          category: newExpenseData.category,
          subcategory: newExpenseData.subcategory,
          userId,
        }
      });
      expect(result).toEqual(expectedExpense);
    });
  });

  describe('getAllExpenses', () => {
    it('should return all expenses with no filters', async () => {
      const expectedExpenses = [{ id: '1', amount: 50, userId }];
      mockFindMany.mockResolvedValueOnce(expectedExpenses as never);

      const result = await expensesModel.getAllExpenses(userId);

      expect(mockFindMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { date: 'desc' }
      });
      expect(result).toEqual(expectedExpenses);
    });
  });

  describe('getExpenseById', () => {
    it('should return expense by ID', async () => {
      const expectedExpense = { id: 'expense-id', amount: 50, userId };
      mockFindFirst.mockResolvedValueOnce(expectedExpense as never);

      const result = await expensesModel.getExpenseById('expense-id', userId);

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: 'expense-id', userId }
      });
      expect(result).toEqual(expectedExpense);
    });
  });

  describe('deleteExpense', () => {
    it('should delete an expense', async () => {
      const expectedResult = { count: 1 };
      mockDeleteMany.mockResolvedValueOnce(expectedResult as never);

      const result = await expensesModel.deleteExpense('expense-id', userId);

      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { id: 'expense-id', userId }
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateExpense', () => {
    it('should update an expense', async () => {
      const updateData = { amount: 60 };
      const expectedResult = [{ id: 'expense-id', amount: 60 }];
      mockUpdateManyAndReturn.mockResolvedValueOnce(expectedResult as never);

      const result = await expensesModel.updateExpense('expense-id', userId, updateData as any);

      expect(mockUpdateManyAndReturn).toHaveBeenCalledWith({
        where: { id: 'expense-id', userId },
        data: {
          amount: updateData.amount,
          description: undefined,
          category: undefined,
          subcategory: undefined,
        }
      });
      expect(result).toEqual(expectedResult);
    });
  });
});
