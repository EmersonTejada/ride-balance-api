import { prisma } from "../prisma/index.js";
import { ExpenseFilters, NewExpense, UpdateExpense } from "../types/expense";

export const createExpense = async (expense: NewExpense, userId: string) => {
  const newExpense = prisma.expense.create({
    data: {
      amount: expense.amount,
      description: expense.description,
      category: expense.category,
      subcategory: expense.subcategory,
      userId,
    },
  });
  return newExpense;
};

export const getAllExpenses = async (
  userId: string,
  filters?: ExpenseFilters,
) => {
  const where: any = { userId };

  if (filters?.category) {
    where.category = filters.category;
  }

  if (filters?.subcategory) {
    where.subcategory = filters.subcategory;
  }

  if (filters?.from) {
    where.date = { ...where.date, gte: new Date(filters.from) };
  }
  if (filters?.to) {
    where.date = { ...where.date, lte: new Date(filters.to) };
  }
  const result = await prisma.expense.findMany({ where });
  return result;
};

export const getExpenseById = async (expenseId: string, userId: string) => {
  const expense = await prisma.expense.findFirst({
    where: {
      id: expenseId,
      userId: userId

    }
  })
  return expense
}

export const deleteExpense = async (id: string, userId: string) => {
  const deletedExpense = await prisma.expense.deleteMany({
    where: { id, userId },
  });
  return deletedExpense;
};

export const updateExpense = async (
  id: string,
  userId: string,
  data: UpdateExpense,
) => {
  const updatedExpense = await prisma.expense.updateManyAndReturn({
    where: { id, userId },
    data: {
      amount: data.amount,
      description: data.description,
      category: data.category,
      subcategory: data.subcategory,
    },
  });
  return updatedExpense;
};
