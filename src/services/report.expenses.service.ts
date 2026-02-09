import { prisma } from "../prisma/index.js";
import { differenceInCalendarDays } from "date-fns";
import { decimalToNumber } from "../utils/decimal.js";
import { ExpensesReport } from "../types/expensesReport.js";

export const getExpensesReport = async (
  userId: string,
  from: string,
  to: string
): Promise<ExpensesReport> => {
  /* =======================
     Normalizar fechas
     ======================= */
  const start = new Date(from);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(to);
  end.setUTCHours(23, 59, 59, 999);

  const days = differenceInCalendarDays(end, start);

  if (days <= 0 || days > 7) {
    throw new Error("Invalid date range");
  }

  const where = {
    userId,
    date: {
      gte: start,
      lte: end,
    },
  };

  /* =======================
     KPIs
     ======================= */
  const expensesAgg = await prisma.expense.aggregate({
    where,
    _sum: { amount: true },
  });

  const totalExpenses = decimalToNumber(expensesAgg._sum.amount);

  /* =======================
     Gastos por día
     ======================= */
  const expensesByDayRaw = await prisma.expense.groupBy({
    by: ["date"],
    where,
    _sum: { amount: true },
    orderBy: { date: "asc" },
  });

  const expensesByDay = expensesByDayRaw.map((item) => ({
    date: item.date.toISOString().split("T")[0],
    amount: decimalToNumber(item._sum.amount),
  }));

  /* =======================
     Gastos por categoría
     ======================= */
  const expensesByCategoryRaw = await prisma.expense.groupBy({
    by: ["category"],
    where,
    _sum: { amount: true },
  });

  const totalForPercentage = expensesByCategoryRaw.reduce(
    (sum, item) => sum + decimalToNumber(item._sum.amount),
    0
  );

  const expensesByCategory = expensesByCategoryRaw.map((item) => {
    const amount = decimalToNumber(item._sum.amount);
    return {
      category: item.category,
      amount,
      percentage:
        totalForPercentage > 0
          ? Number(((amount / totalForPercentage) * 100).toFixed(2))
          : 0,
    };
  });

  /* =======================
     Respuesta
     ======================= */
  return {
    period: {
      from: start,
      to: end,
      days,
    },
    kpis: {
      totalExpenses,
    },
    charts: {
      expensesByDay,
      expensesByCategory,
    },
  };
};
