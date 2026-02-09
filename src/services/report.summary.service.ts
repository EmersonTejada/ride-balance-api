import { prisma } from "../prisma/index.js";
import { differenceInCalendarDays } from "date-fns";
import { ReportSummary } from "../types/report.js";
import { decimalToNumber } from "../utils/decimal.js";

export const getReportSummary = async (
  userId: string,
  from: string, 
  to: string
): Promise<ReportSummary> => {
  /* =======================
     Normalizar fechas
     ======================= */
  const start = new Date(from)
  start.setUTCHours(0,0,0,0);
  const end = new Date(to)
  end.setUTCHours(23,59,59,999)

  /* =======================
     Validación de rango
     ======================= */
  const days = differenceInCalendarDays(end, start); 

  if (days <= 0 || days > 7) {
    throw new Error("Invalid date range");
  }

  /* =======================
     Filtros base
     ======================= */
  const ridesWhere = {
    userId,
    date: {
      gte: start,
      lte: end,
    },
  };

  const expensesWhere = {
    userId,
    date: {
      gte: start,
      lte: end,
    },
  };

  /* =======================
     KPIs
     ======================= */
  const [ridesAgg, expensesAgg] = await Promise.all([
    prisma.ride.aggregate({
      where: ridesWhere,
      _sum: { amount: true },
      _count: { id: true },
    }),

    prisma.expense.aggregate({
      where: expensesWhere,
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = decimalToNumber(ridesAgg._sum.amount);
  const totalExpenses = decimalToNumber(expensesAgg._sum.amount);
  const totalRides = ridesAgg._count.id ?? 0;

  const netIncome = totalIncome - totalExpenses;
  const avgIncomePerRide = totalRides > 0 ? totalIncome / totalRides : 0;

  /* =======================
     Ganancia por día
     ======================= */
  const incomeByDayRaw = await prisma.ride.groupBy({
    by: ["date"],
    where: ridesWhere,
    _sum: { amount: true },
    orderBy: { date: "asc" },
  });

  const incomeByDay = incomeByDayRaw.map((item) => ({
    date: item.date.toISOString().split("T")[0], // yyyy-mm-dd
    amount: decimalToNumber(item._sum.amount),
  }));

  /* =======================
     Gastos por categoría
     ======================= */
  const expensesByCategoryRaw = await prisma.expense.groupBy({
    by: ["category"],
    where: expensesWhere,
    _sum: { amount: true },
  });

  const expensesByCategory = expensesByCategoryRaw.map((item) => ({
    category: item.category,
    amount: decimalToNumber(item._sum.amount),
  }));

  const expensesTotalForPercentage = expensesByCategory.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const expensesByCategoryPercentage = expensesByCategory.map((item) => ({
    category: item.category,
    percentage:
      expensesTotalForPercentage > 0
        ? Number(((item.amount / expensesTotalForPercentage) * 100).toFixed(2))
        : 0,
  }));

  /* =======================
     Ganancia por plataforma
     ======================= */
  const incomeByPlatformRaw = await prisma.ride.groupBy({
    by: ["platform"],
    where: ridesWhere,
    _sum: { amount: true },
  });

  const incomeTotalForPercentage = incomeByPlatformRaw.reduce(
    (sum, item) => sum + decimalToNumber(item._sum.amount),
    0
  );

  const incomeByPlatformPercentage = incomeByPlatformRaw.map((item) => ({
    platform: item.platform,
    percentage:
      incomeTotalForPercentage > 0
        ? Number(
            (
              (decimalToNumber(item._sum.amount) / incomeTotalForPercentage) *
              100
            ).toFixed(2)
          )
        : 0,
  }));

  /* =======================
     Respuesta final
     ======================= */
  return {
    period: {
      from: start,
      to: end,
      days,
    },
    kpis: {
      totalIncome,
      totalExpenses,
      totalRides,
      netIncome,
      avgIncomePerRide,
    },
    charts: {
      incomeByDay,
      expensesByCategory,
      expensesByCategoryPercentage,
      incomeByPlatformPercentage,
    },
  };
};
